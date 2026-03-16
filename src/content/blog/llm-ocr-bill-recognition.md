---
title: 用 LLM + OCR 做帳單自動辨識：AutoBill 的技術拆解
date: 2026-03-05
description: 深入拆解 AutoBill 如何用 OCR + LLM 雙引擎架構實現帳單自動辨識，包含欄位擷取、結構化輸出和錯誤處理。
tags: [LLM, OCR, AutoBill, AI, automation]
---

手動處理帳單是一件極其無聊但又不能出錯的工作。AutoBill 是我做的一個微服務，用 OCR + LLM 自動辨識帳單並擷取關鍵資訊。這篇文章拆解它背後的技術架構。

## 問題定義

帳單處理的痛點很明確：

- 格式五花八門（水電費、電信帳單、發票、收據...）
- 關鍵欄位的位置每張都不一樣
- 手動 key-in 慢又容易出錯
- 量大的時候根本做不完

傳統做法是用 OCR 辨識文字後寫 regex 比對，但帳單格式一變就得重寫規則。LLM 的優勢在於它能「理解」文件結構，不需要針對每種格式寫規則。

## 雙引擎架構

```
帳單圖片 -> OCR Engine -> 原始文字
                              |
                              v
                    LLM (結構化擷取) -> JSON 輸出
                              |
                              v
                    驗證 + 儲存 -> PostgreSQL
```

### 為什麼不直接用 Vision LLM

現在的 multimodal LLM（GPT-4V、Claude Vision）可以直接讀圖片。但在實際使用中，我發現分兩步更可靠：

1. **成本**：OCR 辨識文字的成本遠低於把整張圖片丟給 Vision Model
2. **可控性**：OCR 的輸出是確定性的，LLM 只負責「理解」文字結構，debug 更容易
3. **速度**：文字輸入的 token 數比圖片少很多，推論速度更快

### OCR 選型

測試過幾個方案：

- **Tesseract**：開源免費，中文辨識準確率約 85-90%，夠用但不完美
- **PaddleOCR**：百度出的，中文辨識效果明顯更好，速度也快
- **Cloud OCR API**：Google/AWS 的 OCR 服務，最準但有成本

AutoBill 用 PaddleOCR 作為預設引擎，在帳單場景下的辨識準確率可以到 95% 以上。

## LLM 結構化擷取

這是 AutoBill 的核心。OCR 給出的是一堆文字，LLM 的任務是從中擷取結構化資訊。

### Prompt 設計

```
你是一個帳單資訊擷取助手。請從以下 OCR 辨識結果中，擷取帳單的關鍵資訊。

請以 JSON 格式輸出，包含以下欄位：
- vendor: 帳單來源/公司名稱
- amount: 總金額（數字）
- currency: 幣別
- date: 帳單日期（YYYY-MM-DD）
- due_date: 繳費期限（YYYY-MM-DD，如果有的話）
- items: 明細項目列表 [{name, amount}]
- bill_type: 帳單類型（水費/電費/電信/其他）

如果某個欄位無法從文字中確定，請填 null。

OCR 辨識結果：
{ocr_text}
```

### 關鍵技巧：強制 JSON 輸出

用 vLLM 或 Ollama 部署模型時，可以用 `response_format` 強制輸出 JSON：

```python
response = client.chat.completions.create(
    model="qwen3-8b",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"},
    temperature=0.1,  # 低溫度提高一致性
)
```

`temperature=0.1` 很重要 -- 帳單擷取需要的是精確性，不是創意。

## 驗證層

LLM 的輸出不能直接信任。AutoBill 有一個驗證層來把關：

```python
def validate_bill(data: dict) -> tuple[bool, list[str]]:
    errors = []

    # 金額必須是正數
    if data.get("amount") is not None:
        if not isinstance(data["amount"], (int, float)) or data["amount"] <= 0:
            errors.append("金額格式錯誤")

    # 日期格式驗證
    for field in ["date", "due_date"]:
        if data.get(field):
            try:
                datetime.strptime(data[field], "%Y-%m-%d")
            except ValueError:
                errors.append(f"{field} 日期格式錯誤")

    # 明細金額加總應接近總金額
    if data.get("items") and data.get("amount"):
        items_total = sum(item.get("amount", 0) for item in data["items"])
        if abs(items_total - data["amount"]) / data["amount"] > 0.05:
            errors.append("明細加總與總金額差異超過 5%")

    return len(errors) == 0, errors
```

最後一個檢查特別有用 -- 如果明細加起來跟總額差太多，通常代表 LLM 漏掉了某些項目或解析錯誤。

## Vector Search：相似帳單比對

用 pgvector 儲存帳單的 embedding，可以做到：

- **相似帳單比對**：新帳單進來時，找到格式最接近的歷史帳單，提高擷取準確率
- **異常偵測**：如果某張帳單跟歷史記錄差異太大，自動標記人工審查
- **自動分類**：根據向量相似度自動判斷帳單類型

## API 設計

AutoBill 是一個標準的 RESTful 微服務：

```
POST /api/bills/recognize    # 上傳帳單圖片，回傳結構化結果
GET  /api/bills/:id          # 查詢單張帳單
GET  /api/bills/search       # 語意搜尋帳單
POST /api/bills/:id/confirm  # 確認/修正辨識結果
```

設計成微服務的好處是可以獨立部署、獨立擴展，任何系統只要能打 HTTP 就能串接。

## 效能數據

在我們的測試集上（200 張不同類型的帳單）：

- **欄位擷取準確率**：92%（vendor、amount、date 三個核心欄位）
- **平均處理時間**：2-3 秒/張（OCR + LLM 推論）
- **需要人工修正的比例**：約 8%

不完美，但比純手動快了 10 倍以上。而且那 8% 的修正通常只是微調，不需要重新輸入。

## 總結

LLM + OCR 的組合在文件處理場景非常實用。關鍵要點：

1. **分層架構**（OCR + LLM）比端到端 Vision Model 更可控、更便宜
2. **一定要有驗證層**，不能盲信 LLM 輸出
3. **低 temperature** 是結構化擷取的關鍵
4. **Vector Search** 可以做很多衍伸功能（相似比對、異常偵測）

AutoBill 的原始碼之後會整理開源，有興趣的可以關注。
