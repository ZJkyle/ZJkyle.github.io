# CLAUDE CODE 配置說明

> 目的：協助 Claude 高效理解、探索與分析 EdgeSwarm 專案的完整程式架構。

---

## 當前進度
- 使用 GitHub Pages + Hexo 建立個人網站

### 待完成任務
- [ ] 充實 Projects 頁面內容 - 加入實際專案作品
- [ ] 充實 Ideas 頁面內容 - 加入想法與筆記
- [ ] 選擇並設定 Hexo 主題（目前使用預設 landscape）

### 待研究：EdgeSwarm Inference System
- [ ] 研究 vLLM / Ollama 透過 model preloading 消除 cold-start latency 的機制
- [ ] 探討同時 preload 多個小模型的可行性
- [ ] 設計：簡單任務用單一模型，複雜任務用多模型協作的調度策略
- [ ] 比較不同 inference framework 的優缺點（vLLM vs Ollama vs others）

### 已完成
- [x] 初步建立 index.html 靜態頁面
- [x] 設置 Hexo 專案結構（_config.yml, source/, themes/）
- [x] 建立 Projects 頁面框架（source/projects/index.md）
- [x] 建立 Ideas 頁面框架（source/ideas/index.md）
- [x] 建立 About 頁面（source/about/index.md）
- [x] 設定 GitHub Actions 自動部署（.github/workflows/deploy.yml）
---

## 標準開發流程（Standard Development Workflow）

**重要：每次開啟新對話時，Claude 都必須遵循以下流程：**

### 1. 理解專案架構（Understand Repository）

- 先閱讀 `claude.md` 和 `README.md`
- 參考 `docs/indexes/` 中的索引檔案快速掌握整體結構
- 根據任務需求，探索相關的程式碼模組
- 理解模組間的依賴關係和資料流

### 2. 分析需求並回覆（Analyze & Respond）

- 根據使用者的指令，分析具體需求
- 說明理解的需求內容
- 如果是大範圍修改，先提出修改計劃並等待確認
- 說明將要修改的檔案和影響範圍

### 3. 執行修改（Implement Changes）

- 使用現有腳本和工具，不要隨意建立新檔案
- 遵循專案的程式碼風格和架構設計
- 保持向後相容性
- 修改時注意模組間的依賴關係

### 4. 測試與驗證（Test & Verify）

- 檢查 linter 錯誤（如有）
- 執行相關測試（`tests/` 目錄）
- 驗證修改是否符合需求
- 確認沒有破壞現有功能

### 5. 更新文件與索引（Update Documentation）

- 如有修改程式碼結構，更新 `docs/indexes/general_index.md` 和 `docs/indexes/detailed_index.md`
- 更新相關文件（如 API 文件、架構文件等）
- 更新 `README.md` 中的使用說明（如需要）

### 6. 提交變更（Commit & Push）

- 撰寫 commit message，說明大致的修改內容
- 執行 `git commit` 和 `git push`

**注意事項：**
- 不要使用 emoji
- 建立新檔案前先詢問使用者
- 大範圍修改前先說明計劃
- 不要創建一次性的檔案 如有需要直接使用 terminal 命令

---

## 專案總覽（Project Overview）
---

---

## 程式碼索引

為了讓 Claude 快速掌握整體架構，提供了以下索引檔案：

1. **[docs/indexes/general_index.md](docs/indexes/general_index.md)**
   - 列出所有 Python 檔案
   - 每個檔案附有簡短說明

2. **[docs/indexes/detailed_index.md](docs/indexes/detailed_index.md)**
   - 列出所有 class 與 function
   - 包含 docstring 或功能說明

> 注意：索引檔案可能不是最新版本，請作為參考使用。若發現資訊過時，可直接探索程式碼。
---
