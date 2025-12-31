---
title: Claude Code 工作流程自動化筆記
date: 2025-12-31
tags: [claude-code, automation, workflow, productivity]
categories: [AI Tools]
---

這是我學習 Claude Code 自動化功能的筆記。主要解決兩個痛點：每次對話都要重複解釋專案背景、以及手動執行重複性任務。

<!-- more -->

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

### 我的設定

針對我的 Hexo 部落格專案：

```json
{
  "permissions": {
    "allow": [
      "Bash(hexo:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm run:*)",
      "Read(source/**/*)",
      "Edit(source/**/*)"
    ],
    "deny": [
      "Edit(_config.yml)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(hexo deploy:*)"
    ]
  }
}
```

這樣日常的文章編輯、本地預覽都不需要確認，但 push 和 deploy 會提醒我。

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

### CLAUDE.md 內容

```markdown
# My Blog

## 專案資訊
使用 Hexo + GitHub Pages 的個人部落格。

## 常用指令
- hexo server -p 4000    # 本地預覽
- hexo new post "標題"   # 新增文章
- hexo generate          # 產生靜態檔
- hexo deploy            # 部署到 GitHub Pages

## 文章規範
- Front matter 必須包含 title, date, tags, categories
- 使用 <!-- more --> 標記摘要結束位置
- 圖片放在 source/images/

## 當前進度
- [ ] 充實 Projects 頁面
- [ ] 研究 EdgeSwarm inference system
```

### .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(hexo:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Read(source/**/*)",
      "Edit(source/**/*)"
    ],
    "ask": [
      "Bash(git push:*)"
    ]
  },
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

**安裝方式：**
```bash
# 在 Claude Code 中安裝特定 skill
/install anthropics/skills:pdf
/install anthropics/skills:docx
```

**使用範例：**
```
# 安裝後直接在對話中使用
"使用 PDF skill 從 report.pdf 提取所有表格"
"用 DOCX skill 建立一份會議記錄範本"
```

**自訂 Skill 結構：**
```
my-skill/
├── SKILL.md          # 必要：skill 定義和說明
└── resources/        # 可選：腳本、參考文件、素材
    ├── scripts/
    ├── references/
    └── assets/
```

SKILL.md 範例：
```markdown
---
name: my-custom-skill
description: 這個 skill 用於...（清晰描述觸發時機）
---

# My Custom Skill

## 使用時機
- 當用戶要求...
- 當需要處理...

## 執行步驟
1. 首先...
2. 然後...

## 注意事項
- 不要...
- 確保...
```

---

### 2. BloopAI/vibe-kanban（任務管理看板）

[GitHub: BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)

Kanban 風格的任務管理工具，專為 coding agent 設計。

**核心概念：**
- 將複雜任務拆解成可追蹤的小任務
- 視覺化呈現進度（待辦 → 進行中 → 完成）
- 與 Claude Code 整合，自動更新任務狀態

**為什麼需要它：**

Claude Code 內建的 TodoWrite 適合簡單任務，但對於複雜專案：
- 需要更好的視覺化
- 需要跨 session 持久化
- 需要多人協作追蹤

**安裝：**
```bash
# 使用 cargo 安裝（Rust）
cargo install vibe-kanban

# 或從 release 下載 binary
```

**基本使用：**
```bash
# 初始化看板
vibe init

# 新增任務
vibe add "實作用戶認證"

# 查看看板
vibe board

# 移動任務狀態
vibe move 1 doing
vibe move 1 done
```

**與 Claude Code 整合：**

在 CLAUDE.md 中加入：
```markdown
## 任務管理

使用 vibe-kanban 追蹤任務進度。

常用指令：
- `vibe board` - 查看當前看板
- `vibe add "任務描述"` - 新增任務
- `vibe move <id> doing` - 開始任務
- `vibe move <id> done` - 完成任務

在開始工作前，先用 `vibe board` 確認當前任務。
完成任務後，用 `vibe move` 更新狀態。
```

---

### 3. getzep/graphiti（知識圖譜記憶）

[GitHub: getzep/graphiti](https://github.com/getzep/graphiti)

為 AI Agent 建立實時知識圖譜，實現真正的長期記憶。

**解決的問題：**
- CLAUDE.md 是靜態的，需要手動更新
- 對話結束後，學到的資訊就遺失了
- 複雜專案需要追蹤實體間的關係

**Graphiti 的能力：**
- 自動從對話中提取實體（人、專案、概念）
- 建立實體間的關係圖
- 跨 session 持久化記憶
- 語義搜索相關 context

**安裝：**
```bash
pip install graphiti-core
```

**基本整合範例：**
```python
from graphiti_core import Graphiti

# 初始化知識圖譜
kg = Graphiti()

# 對話後更新知識
kg.add_episode(
    content="用戶說他們的專案使用 React + TypeScript",
    source="conversation"
)

# 查詢相關知識
context = kg.search("這個專案用什麼框架？")
# 返回: "專案使用 React + TypeScript"
```

**進階整合（自動記憶）：**

這需要在 Claude Code 外部建立一個 wrapper：

```python
# claude_with_memory.py
from graphiti_core import Graphiti
import subprocess

kg = Graphiti(uri="bolt://localhost:7687")  # 需要 Neo4j

def chat_with_memory(user_input):
    # 1. 從知識圖譜取得相關 context
    relevant_context = kg.search(user_input, limit=5)

    # 2. 將 context 注入到對話中
    enhanced_prompt = f"""
    相關背景知識：
    {relevant_context}

    用戶問題：{user_input}
    """

    # 3. 呼叫 Claude Code
    result = subprocess.run(
        ["claude", "-p", enhanced_prompt],
        capture_output=True, text=True
    )

    # 4. 將對話存入知識圖譜
    kg.add_episode(
        content=f"User: {user_input}\nAssistant: {result.stdout}",
        source="claude_conversation"
    )

    return result.stdout
```

**適用場景：**
- 長期進行的複雜專案
- 需要記住多個相關專案的資訊
- 多人協作，需要共享知識庫

**注意：** Graphiti 需要額外架設 Neo4j 資料庫，設定較複雜。建議先熟悉基本的 Claude Code 功能後再考慮整合。

---

## 工具選擇建議

| 需求 | 推薦工具 | 複雜度 |
|------|----------|--------|
| 處理 PDF/Office 文件 | anthropics/skills | 低 |
| 簡單任務追蹤 | Claude Code 內建 TodoWrite | 低 |
| 複雜專案任務管理 | vibe-kanban | 中 |
| 長期記憶和知識管理 | graphiti | 高 |

**我的建議路徑：**
1. 先設定好 CLAUDE.md + settings.json（本文前半部分）
2. 安裝需要的 official skills
3. 如果專案變複雜，考慮 vibe-kanban
4. 如果需要跨專案知識管理，研究 graphiti

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
