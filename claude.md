# CLAUDE CODE 配置說明

> 目的：協助 Claude 高效理解與維護 Kyle 的個人 Portfolio 網站。

---

## 專案概述
- 使用 **Astro 5.x + Tailwind CSS v4** 建立的專業開發者 Portfolio
- 部署方式：GitHub Pages via GitHub Actions
- 網址：https://ZJkyle.github.io

## 常用指令
- `npm run dev`      # 本地開發伺服器
- `npm run build`    # 建置靜態網站（輸出到 ./dist）
- `npm run preview`  # 預覽建置結果

## 目錄結構
```
src/
├── components/    # Astro 元件（Header, Footer, Hero, Cards...）
├── content/blog/  # Blog 文章（Markdown, Content Collection）
├── data/          # 結構化資料（products.ts, services.ts）
├── layouts/       # 頁面版型（BaseLayout, BlogPost）
├── pages/         # 路由頁面（index, products, services, about, blog/）
└── styles/        # 全域樣式（global.css with Tailwind）
```

## 當前進度

### 已完成
- [x] Hexo 轉 Astro 5.x + Tailwind CSS v4
- [x] 建立首頁、作品集、服務、關於我、Blog 頁面
- [x] 遷移 2 篇 Blog 文章（Content Collection）
- [x] 設定 GitHub Actions 自動部署

### 待完成
- [ ] 加入更多 Blog 文章
- [ ] 加入 RWD 行動版 hamburger menu
- [ ] SEO 優化（Open Graph, sitemap）

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
