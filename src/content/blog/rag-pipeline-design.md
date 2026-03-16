---
title: 實戰 RAG Pipeline：從文件到精準回答的完整架構
date: 2026-03-10
description: 分享我在 Glean 和 AutoBill 中實作 RAG Pipeline 的經驗，包含 Chunking 策略、Embedding 選型、pgvector 搜尋優化。
tags: [RAG, LLM, pgvector, embedding, AI]
---

RAG（Retrieval-Augmented Generation）是目前讓 LLM 回答領域知識問題最實用的方法。這篇文章分享我在實際產品中建置 RAG Pipeline 的技術決策和踩過的坑。

## 為什麼需要 RAG

LLM 很強，但它有兩個根本限制：

1. **知識截止日期**：它不知道你昨天的會議記錄寫了什麼
2. **幻覺問題**：問它不知道的事，它會很有自信地胡說

RAG 的解法很直覺：先搜尋相關文件，再把文件內容塞給 LLM 當參考資料，讓它「有根據地」回答。

## Pipeline 架構

```
文件輸入 -> Chunking -> Embedding -> Vector Store (pgvector)
                                          |
使用者提問 -> Query Embedding -> 向量搜尋 -> Top-K 結果 -> LLM 生成回答
```

看起來簡單，但每一步都有坑。

## Chunking：怎麼切文件

這是整個 Pipeline 影響最大的一步。切太大，搜尋不精準；切太小，失去上下文。

### 我的策略

- **基本單位**：以段落為主，不硬性用固定字數切割
- **Overlap**：每個 chunk 保留前後 10-15% 的重疊，避免斷句問題
- **Metadata 保留**：每個 chunk 都附帶來源文件、時間戳、講者（如果是會議記錄）

### 踩過的坑

在 Glean 中，會議記錄的語句往往很破碎（口語化、中英夾雜），用固定 token 數切割會把一個完整的論點切成兩半。後來改成先用 LLM 做「語意段落切割」，效果好很多，但成本也高了不少。最後的折衷方案是：先用規則切（段落分隔 + 時間間隔），再用 embedding 相似度合併過度碎片化的 chunk。

## Embedding 選型

測試過幾個模型：

| 模型 | 維度 | 中文效果 | 速度 |
|------|------|----------|------|
| OpenAI text-embedding-3-small | 1536 | 好 | 快（API） |
| BGE-M3 | 1024 | 很好 | 中（自部署） |
| Multilingual-E5-large | 1024 | 好 | 中 |

中文場景下 BGE-M3 的表現最好，尤其是混合中英文的文本。但如果不想自己部署模型，OpenAI 的 embedding API 也夠用了。

### 關鍵經驗

Embedding 模型的選擇沒有絕對答案。重點是：

1. **Query 和 Document 用同一個模型**（聽起來廢話，但真的有人搞混）
2. **測試要用你自己的資料**，別只看 benchmark
3. **維度不是越大越好**，1024 和 1536 在實際使用中差異很小，但儲存成本差很多

## pgvector：為什麼不用 Pinecone

很多教學推薦用 Pinecone、Weaviate 這些專門的 Vector DB。我選擇 pgvector 的理由：

1. **已經在用 PostgreSQL** -- 不需要多維護一個服務
2. **混合查詢** -- 可以同時做向量搜尋 + 傳統 SQL 過濾（例如：搜尋「最近一週的會議記錄中關於 A 專案的內容」）
3. **成熟度** -- PostgreSQL 的生態系、備份、監控都是現成的

### 效能優化

```sql
-- 建立 HNSW 索引，搜尋速度大幅提升
CREATE INDEX ON documents
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 搜尋時設定 ef_search 控制精度/速度平衡
SET hnsw.ef_search = 40;
```

在 10 萬筆文件的規模下，搜尋延遲穩定在 20-50ms，完全夠用。

## Prompt 設計

最後一步是把搜尋結果組裝成 prompt。這裡的關鍵是讓 LLM 知道「什麼時候該說不知道」。

```
你是一個知識助手。請根據以下參考資料回答使用者的問題。

規則：
- 只根據參考資料回答，不要自行推測
- 如果參考資料中沒有相關資訊，請明確告知「目前沒有找到相關資訊」
- 引用資料時請標註來源

參考資料：
{top_k_chunks}

使用者問題：{query}
```

看起來很基本，但「請明確告知沒有找到相關資訊」這句話省了我很多處理幻覺的功夫。

## 總結

RAG 不難，但要做好需要在每一步都做正確的取捨。我的建議是：

1. **先簡單跑起來**，不要一開始就追求完美的 chunking 策略
2. **用真實資料測試**，synthetic benchmark 的結果參考就好
3. **pgvector 夠用就好**，不需要為了「看起來專業」引入一堆新服務
4. **Prompt 設計很重要**，但不要過度工程化

如果你也在做類似的東西，歡迎交流。
