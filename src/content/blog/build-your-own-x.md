---
title: "Build Your Own X：從零造輪子的終極學習資源"
date: 2026-03-17
description: "深度拆解 GitHub 上 330k+ stars 的 build-your-own-x 專案，分析為什麼「造輪子」是最有效的學習方式，以及這份清單如何幫助你系統性地提升技術深度。"
tags: ["開源", "學習資源", "系統設計"]
category: discovery
repoUrl: "https://github.com/codecrafters-io/build-your-own-x"
---

## 這是什麼

[build-your-own-x](https://github.com/codecrafters-io/build-your-own-x) 是一份由社群維護的教學資源集合，收錄了數百篇「從零實作某項技術」的教學文章和專案。從資料庫、作業系統、編譯器到遊戲引擎，幾乎涵蓋了軟體工程中所有你能想到的基礎建設。

這個 repo 在 GitHub 上累積了超過 330,000 顆星，是整個平台上星數最高的專案之一。它的核心理念很簡單：**理解一個東西最好的方式，就是自己做一個。**

## 核心特色拆解

### 1. 覆蓋範圍極廣

目前收錄的分類超過 30 個，包括但不限於：

- **3D Renderer** -- 從光線追蹤到 OpenGL 渲染管線
- **Database** -- 從 B-Tree 到完整的 SQL 引擎
- **Docker** -- 用幾百行程式碼理解容器化的本質
- **Git** -- 實作版本控制系統，理解 object model
- **Neural Network** -- 不靠框架，純手寫反向傳播
- **Operating System** -- 從 bootloader 開始的硬核之旅
- **Programming Language** -- 從 tokenizer 到 interpreter

每個分類下都有多篇不同語言、不同深度的教學，你可以根據自己的技術棧和學習目標挑選。

### 2. 多語言支援

同一個主題往往有 Python、Go、Rust、C、JavaScript 等多種實作版本。這讓你可以用最熟悉的語言開始，或者用這些專案作為學習新語言的實戰練習。

### 3. 從簡單到硬核的梯度

資源的難度範圍很大。你可以從「用 Python 寫一個簡單的 Web Server」開始，逐步挑戰到「用 C 寫一個作業系統」。這種梯度設計讓不同程度的開發者都能找到適合自己的起點。

### 4. 社群驅動的品質篩選

作為一個開源專案，新的教學資源需要經過 PR review 才能被收錄。雖然品質仍有參差，但整體水準遠高於隨機搜尋到的教學文章。高星數的條目通常都經過大量開發者的驗證。

### 5. 不只是教學，更是路線圖

對於想要深入理解某個技術領域的開發者來說，這份清單本身就是一份學習路線圖。例如，如果你想成為資料庫專家，可以依序實作 B-Tree、WAL、Query Parser、Query Optimizer，逐步建立完整的知識體系。

## 實際試用

我自己從這份清單中挑了幾個專案來實作：

**Build Your Own Git** 是我最推薦的入門專案。大多數開發者每天都在用 Git，但很少人真正理解它的內部運作。當你自己實作了 blob、tree、commit 這些 object，再實作 `git init`、`git add`、`git commit` 這些指令後，你會發現 Git 的設計其實非常優雅簡潔。之後遇到 rebase conflict 或 detached HEAD 時，你不再是死記指令，而是真正理解發生了什麼事。

**Build Your Own Docker** 也非常值得一試。你會發現容器化的核心概念（namespace、cgroup、chroot）其實沒有想像中那麼神祕。幾百行 Go 程式碼就能讓你理解 Docker 做了什麼。

上手難度取決於你選擇的專案。像 Web Server 或 JSON Parser 這類專案，有基礎程式能力就能開始。但 OS 或 Compiler 類的專案，通常需要一些計算機科學的基礎知識。

## 與類似工具比較

| 資源 | 特色 | 適合 |
|------|------|------|
| **build-your-own-x** | 廣度最大，多語言，社群維護 | 想探索多個領域的開發者 |
| **Coding Challenges (John Crickett)** | 每週一個挑戰，有測試案例 | 想要結構化練習的人 |
| **Project Based Learning** | 類似但更偏向完整專案 | 想做完整 side project 的人 |
| **Nand2Tetris** | 從邏輯閘到作業系統的完整課程 | 想要系統性學習計算機架構的人 |

build-your-own-x 的最大優勢是**廣度和靈活度**。你不需要按照固定順序學習，可以根據當下的興趣和需求自由跳轉。

## 適合誰

- **中階開發者**：已經會寫程式，但想更深入理解使用的工具背後的原理
- **準備面試的人**：系統設計面試中，有過「從零實作」經驗的人明顯更有優勢
- **想學新語言的人**：用實作專案來學新語言，比做 LeetCode 題目有趣得多
- **技術寫作者/教學者**：這份清單是很好的教學靈感來源

不太適合完全的程式初學者。如果你還在學習基礎語法，建議先打好基礎再來挑戰這些專案。

## 我的評價

build-your-own-x 是我最常推薦給其他開發者的學習資源之一。在這個 AI 工具快速發展的時代，「理解底層原理」反而變得更重要了。當你理解一個東西是怎麼運作的，你才能在 AI 生成的程式碼中判斷什麼是對的、什麼是有問題的。

這份清單最大的價值不在於你要把每個專案都做完，而是它提供了一個**系統化的學習框架**。當你對某個技術感到好奇時，你知道可以從這裡找到一個「從零開始」的切入點。

**推薦程度：強烈推薦。** 每個認真的開發者都應該至少從中挑 2-3 個專案來實作。

## 相關資源

- [GitHub Repo](https://github.com/codecrafters-io/build-your-own-x)
- [CodeCrafters](https://codecrafters.io/) -- 同團隊推出的互動式練習平台（付費）
- [Challenging Projects Every Programmer Should Try](https://austinhenley.com/blog/challengingprojects.html) -- Austin Henley 的推薦清單
- [Project Based Learning](https://github.com/practical-tutorials/project-based-learning) -- 另一份類似的學習資源集合
