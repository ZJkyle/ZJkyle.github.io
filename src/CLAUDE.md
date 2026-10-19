# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

專案整體說明、指令與新增文章流程見根目錄的 `claude.md`。

## 目錄結構（Directory Structure）

```
.
├── components
│   ├── BaseHead.astro       # meta、Open Graph、分享縮圖（image prop，預設 /og-default.png）
│   ├── BlogPostCard.astro
│   ├── Footer.astro
│   ├── Header.astro         # 含行動版選單
│   ├── Hero.astro
│   ├── ProductCard.astro
│   └── TechTag.astro
├── content
│   ├── blog                 # 文章
│   └── templates            # 文章範本
├── data
│   ├── board.ts             # 技術棧頁資料
│   ├── categories.ts        # 文章分類
│   └── products.ts          # 工具頁資料
├── layouts
│   ├── BaseLayout.astro
│   └── BlogPost.astro       # 會把 description、image 傳給 BaseHead
├── pages
│   ├── blog
│   ├── 404.astro
│   ├── about.astro
│   ├── board.astro
│   ├── index.astro
│   └── products.astro
├── styles
│   └── global.css
└── content.config.ts        # blog frontmatter schema
```

## 注意事項
- 不要使用 emoji
- 建立新檔案前先詢問使用者
- 大範圍修改前先說明計劃

---

最後更新：2026-10-19
