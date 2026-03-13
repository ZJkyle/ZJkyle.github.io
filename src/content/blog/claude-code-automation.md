---
title: Claude Code 工作流程自動化筆記
date: 2025-12-31
description: 解決 Claude Code 使用痛點：Context 重複說明與手動操作，透過 CLAUDE.md、Hooks 和 Settings 實現自動化。
tags: [claude-code, automation, workflow, productivity]
---

這是我學習 Claude Code 自動化功能的筆記。主要解決兩個痛點：每次對話都要重複解釋專案背景、以及手動執行重複性任務。

## 我的痛點

使用 Claude Code 一段時間後，發現兩個主要問題：

1. **Context 重複說明**：每次開新對話，都要重新解釋專案架構、coding style、常用指令
2. **手動操作多**：format、lint、commit 這些重複動作還是要手動觸發

研究後發現 Claude Code 有完整的解決方案。

---

## 解法一：CLAUDE.md 記憶系統

Claude Code 會自動讀取專案根目錄的 `CLAUDE.md`，這是讓它「記住」專案資訊的關鍵。

### 記憶層級

| 層級 | 檔案位置 | 用途 |
|------|----------|------|
| 專案共享 | `./CLAUDE.md` | 團隊共用，commit 到 git |
| 專案本地 | `./CLAUDE.local.md` | 個人設定，自動 gitignore |
| 使用者全域 | `~/.claude/CLAUDE.md` | 跨專案的個人偏好 |
| 模組化規則 | `.claude/rules/*.md` | 針對特定路徑的規則 |

### 我的 CLAUDE.md 結構

```markdown
# 專案名稱

## 專案概述
@README.md          # 用 @ 引用檔案，Claude 會自動讀取

## 技術棧
- 框架: React + TypeScript
- 測試: Jest
- 部署: GitHub Actions

## 常用指令
- npm run dev       # 開發伺服器
- npm run test      # 執行測試
- npm run build     # 建置

## 程式碼規範
- 使用 TypeScript strict mode
- 函數命名用 camelCase
- 元件命名用 PascalCase

## 當前進度
- [x] 完成基礎架構
- [ ] 實作使用者認證
- [ ] 撰寫單元測試
```

關鍵是把「每次都要講的事」寫進去：
- 專案架構和技術選擇
- 常用指令（不用每次問「怎麼跑測試」）
- Coding style（Claude 會遵循）
- 當前進度（Claude 知道現在在做什麼）

### 模組化規則（大專案適用）

對於大型專案，可以用 `.claude/rules/` 目錄來分類規則：

```
.claude/
├── CLAUDE.md              # 主文件
└── rules/
    ├── frontend.md        # 前端規則
    ├── backend.md         # 後端規則
    └── testing.md         # 測試規範
```

每個規則檔可以指定適用的路徑：

```markdown
---
paths: src/components/**/*.tsx
---

# 前端元件規則

- 使用 functional component
- Props 要定義 interface
- 每個元件要有對應的 .test.tsx
```

這樣 Claude 在編輯 `src/components/` 下的檔案時，會自動套用這些規則。

---

## 解法二：Hooks 自動化

Hooks 讓你在特定事件觸發時自動執行腳本。

### 可用的 Hook 事件

| 事件 | 觸發時機 | 常見用途 |
|------|----------|----------|
| PreToolUse | 工具執行前 | 阻止敏感操作、驗證輸入 |
| PostToolUse | 工具執行後 | 自動格式化、執行 lint |
| SessionStart | 對話開始時 | 載入環境變數 |
| Stop | Claude 完成時 | 提醒、清理 |

### 設定方式

Hooks 設定在 `.claude/settings.json`：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$(jq -r '.tool_input.file_path')\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

這個設定會在 Claude 寫入或編輯檔案後，自動執行 Prettier 格式化。

### 實用 Hook 範例

**1. 自動格式化**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write \"$(jq -r '.tool_input.file_path')\" 2>/dev/null || true"
      }]
    }]
  }
}
```

**2. 保護敏感檔案**

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write|Read",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | grep -E '(\\.env|secrets|credentials)' && exit 2 || exit 0"
      }]
    }]
  }
}
```

`exit 2` 會阻止操作執行。

**3. 記錄 Bash 指令**

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' >> ~/.claude/bash-history.log"
      }]
    }]
  }
}
```

---

## 解法三：Settings 權限設定

透過 settings 預先授權常用操作，減少確認彈窗。

### 設定檔位置

```
優先級（高到低）：
1. .claude/settings.local.json  # 個人本地設定
2. .claude/settings.json        # 專案共享設定
3. ~/.claude/settings.json      # 使用者全域設定
```

### 權限設定範例

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(git status:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Read(src/**/*)",
      "Edit(src/**/*)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Edit(node_modules/**)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(rm:*)"
    ]
  }
}
```

- `allow`: 直接執行，不需確認
- `deny`: 完全禁止
- `ask`: 每次都要確認

---

## 完整工作流程設定

整合以上功能，我的專案設定如下：

### 目錄結構

```
my-project/
├── CLAUDE.md                 # 專案記憶（commit 到 git）
├── CLAUDE.local.md           # 個人偏好（gitignore）
└── .claude/
    ├── settings.json         # 共享設定
    ├── settings.local.json   # 個人設定
    └── rules/
        └── posts.md          # 文章撰寫規則
```

---

## 開源資源整合

除了 Claude Code 內建功能，社群也有很多實用的開源工具可以整合。以下是我研究的幾個值得關注的專案。

### 1. anthropics/skills（官方 Skills）

[GitHub: anthropics/skills](https://github.com/anthropics/skills)

Anthropic 官方提供的模組化能力擴充包，讓 Claude 獲得特定領域的專業能力。

**可用的 Skills：**

| Skill | 功能 |
|-------|------|
| **pdf** | 提取文本/表格、合併/分割 PDF、填充表單 |
| **docx** | 創建和編輯 Word 文件、追蹤修改 |
| **xlsx** | Excel 電子表格、公式、資料分析 |
| **pptx** | PowerPoint 演示文稿 |
| **mcp-builder** | 快速建立 MCP Server |
| **webapp-testing** | 使用 Playwright 進行網頁測試 |
| **skill-creator** | 建立自訂 skill 的指南 |

### 2. BloopAI/vibe-kanban（任務管理看板）

[GitHub: BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)

Kanban 風格的任務管理工具，專為 coding agent 設計。將複雜任務拆解成可追蹤的小任務，視覺化呈現進度。

### 3. getzep/graphiti（知識圖譜記憶）

[GitHub: getzep/graphiti](https://github.com/getzep/graphiti)

為 AI Agent 建立實時知識圖譜，實現真正的長期記憶。

---

## 小結

| 痛點 | 解決方案 |
|------|----------|
| 重複說明專案背景 | CLAUDE.md 記憶系統 |
| 每次解釋 coding style | .claude/rules/*.md 模組化規則 |
| 手動格式化 | PostToolUse hook |
| 權限確認太多 | settings.json 預先授權 |
| 誤改敏感檔案 | PreToolUse hook + deny 權限 |
| 處理 PDF/Office 文件 | anthropics/skills |
| 複雜任務管理 | vibe-kanban |
| 長期記憶 | graphiti |

設定好之後，每次開新對話 Claude 就會：
1. 自動讀取 CLAUDE.md 了解專案
2. 遵循定義好的規範
3. 常用操作不需要確認
4. 編輯檔案後自動格式化
5. 可以使用安裝的 skills 處理特殊任務

---

## 參考資源

- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code)
- [anthropics/skills](https://github.com/anthropics/skills) - 官方 Skills 倉庫
- [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban) - 任務管理看板
- [getzep/graphiti](https://github.com/getzep/graphiti) - 知識圖譜記憶系統
- [Agent Skills 標準](http://agentskills.io)
