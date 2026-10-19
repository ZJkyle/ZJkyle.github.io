# CLAUDE CODE 配置說明

> 目的：協助 Claude 高效理解與維護 Kyle 的個人網站 Manatee（AI 工具集合站）。

---

## 專案概述
- 使用 **Astro 5.x + Tailwind CSS v4** 建立，品牌名稱 Manatee
- 部署方式：push 到 `main` 後由 GitHub Actions 建置並部署到 GitHub Pages
- 網址：https://ZJkyle.github.io

## 常用指令
- `npm run dev`      # 本地開發伺服器
- `npm run build`    # 建置靜態網站（輸出到 ./dist）
- `npm run preview`  # 預覽建置結果

## 目錄結構
```
public/
├── og-default.png     # 全站預設分享縮圖（1200x630）
└── og/                # 個別文章的分享縮圖
src/
├── components/        # BaseHead, Header, Footer, Hero, ProductCard, BlogPostCard, TechTag
├── content/blog/      # Blog 文章（Markdown, Content Collection）
├── content/templates/ # 三種分類的文章範本（tech / discovery / reflection）
├── data/              # products.ts（工具）、board.ts（技術棧）、categories.ts（文章分類）
├── layouts/           # BaseLayout, BlogPost
├── pages/             # index, products, board, blog/, about, 404
└── styles/            # global.css（Tailwind 與 hero 動畫）
```

## 新增文章
1. 從 `src/content/templates/` 複製對應分類的範本到 `src/content/blog/<slug>.md`
2. frontmatter 欄位定義在 `src/content.config.ts`：
   - 必填：`title`、`date`、`description`
   - 選填：`tags`、`category`（tech / discovery / reflection，預設 tech）、`externalUrl`、`repoUrl`、`image`
3. `image` 是分享縮圖路徑，例如 `/og/<slug>.png`（1200x630）；沒填就用 `/og-default.png`
4. `description` 會成為頁面 meta description 與 Threads/社群分享的摘要

## 路由備註
- `/services/` 已移除，在 `astro.config.mjs` 用 redirect 導到 `/products/`

## 當前進度

### 已完成
- [x] Hexo 轉 Astro 5.x + Tailwind CSS v4
- [x] 首頁、工具、技術棧、文章、關於我頁面
- [x] Blog 分類系統與範本
- [x] 行動版 hamburger menu
- [x] SEO：sitemap、Open Graph 與分享縮圖
- [x] GitHub Actions 自動部署

### 待研究：EdgeSwarm Inference System
- [ ] 研究 vLLM / Ollama 透過 model preloading 消除 cold-start latency 的機制
- [ ] 探討同時 preload 多個小模型的可行性
- [ ] 設計：簡單任務用單一模型，複雜任務用多模型協作的調度策略
- [ ] 比較不同 inference framework 的優缺點（vLLM vs Ollama vs others）

---

## 注意事項
- 不要使用 emoji
- 建立新檔案前先詢問使用者
- 大範圍修改前先說明計劃
