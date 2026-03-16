---
title: Whisper + Pyannote 實作：自動產出帶講者標記的會議逐字稿
date: 2026-02-25
description: 分享在 Glean 中整合 Whisper STT 和 Pyannote Speaker Diarization 的實作經驗，包含架構設計、效能優化和踩坑記錄。
tags: [Whisper, Pyannote, STT, speaker-diarization, AI]
---

會議記錄是 Glean 的核心功能之一。要做到「自動產出帶講者標記的逐字稿」，需要兩個技術：語音辨識（STT）和說話者分離（Speaker Diarization）。這篇文章分享實作過程。

## 問題：單純的 STT 不夠

Whisper 可以把語音轉成文字，但它只會給你一整段文字，不會告訴你是誰說的。

```
# Whisper 的輸出
"好 那我們今天先討論 A 專案的進度 上週的 bug 修好了嗎 修好了 已經部署到 staging"
```

但使用者需要的是：

```
[Kyle] 好，那我們今天先討論 A 專案的進度。上週的 bug 修好了嗎？
[Alice] 修好了，已經部署到 staging。
```

## 架構設計

```
音訊輸入
    |
    +---> Whisper (STT) ---> 時間戳文字段落
    |
    +---> Pyannote (Diarization) ---> 講者時間區間
    |
    v
合併對齊 ---> 帶講者標記的逐字稿
```

兩條管線平行處理，最後根據時間戳合併。

### 為什麼分開跑

也有一些模型試圖同時做 STT + Diarization（例如 whisper-diarize），但我選擇分開的原因：

1. **各自可替換**：未來 STT 有更好的模型可以單獨升級
2. **Debug 更容易**：知道問題出在辨識還是分離
3. **Whisper large-v3 的辨識品質**明顯比 all-in-one 方案好

## Whisper 部分

### 模型選擇

| 模型 | 參數量 | 中文品質 | 速度 (1hr 音訊) |
|------|--------|----------|-----------------|
| whisper-small | 244M | 普通 | ~2 分鐘 |
| whisper-medium | 769M | 好 | ~5 分鐘 |
| whisper-large-v3 | 1550M | 很好 | ~10 分鐘 |

Glean 用 large-v3，因為會議記錄的準確度比速度更重要。跑在 GPU 上（RTX 3090）一小時的音訊大約 10 分鐘轉完。

### 關鍵設定

```python
import whisper

model = whisper.load_model("large-v3")
result = model.transcribe(
    audio_path,
    language="zh",
    word_timestamps=True,      # 必須開，合併對齊要用
    condition_on_previous_text=True,
    temperature=0.0,
)
```

`word_timestamps=True` 是關鍵 -- 沒有 word-level 時間戳，後面就無法精確對齊講者。

## Pyannote 部分

Pyannote 是目前最成熟的開源 Speaker Diarization 框架。

### 基本使用

```python
from pyannote.audio import Pipeline

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="YOUR_HF_TOKEN",
)

diarization = pipeline(audio_path)

for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"[{turn.start:.1f}s -> {turn.end:.1f}s] {speaker}")
```

輸出類似：

```
[0.0s -> 3.5s] SPEAKER_00
[3.7s -> 8.2s] SPEAKER_01
[8.5s -> 15.1s] SPEAKER_00
```

### 踩坑：講者數量

Pyannote 預設會自動偵測講者數量，但在以下情況容易出錯：

- **背景噪音**被辨識成一個「講者」
- **講話風格相似**的人被合併成同一個講者
- **短暫插話**被忽略

解法是在已知參與人數的情況下，手動指定：

```python
diarization = pipeline(audio_path, num_speakers=3)
```

Glean 會從 Google Calendar 事件中抓取與會人數，作為 hint 傳給 Pyannote。

## 合併對齊

這是最 tricky 的部分。Whisper 給的是「文字 + 時間戳」，Pyannote 給的是「講者 + 時間區間」，要把它們對在一起。

### 演算法

```python
def align_transcript(whisper_segments, diarization):
    aligned = []

    for segment in whisper_segments:
        seg_start = segment["start"]
        seg_end = segment["end"]
        seg_mid = (seg_start + seg_end) / 2

        # 找到該時間點最可能的講者
        best_speaker = None
        best_overlap = 0

        for turn, _, speaker in diarization.itertracks(yield_label=True):
            overlap_start = max(seg_start, turn.start)
            overlap_end = min(seg_end, turn.end)
            overlap = max(0, overlap_end - overlap_start)

            if overlap > best_overlap:
                best_overlap = overlap
                best_speaker = speaker

        aligned.append({
            "speaker": best_speaker or "UNKNOWN",
            "start": seg_start,
            "end": seg_end,
            "text": segment["text"],
        })

    return merge_consecutive(aligned)
```

核心邏輯是用時間重疊（overlap）來判斷每段文字屬於哪個講者。最後 `merge_consecutive` 把連續同一講者的段落合併。

### 邊界案例

- **同時說話**：取 overlap 最大的那個人
- **靜默段**：Whisper 有時會在靜默段產出幻覺文字，需要過濾
- **時間偏移**：Whisper 和 Pyannote 的時間戳可能有 0.1-0.5 秒的偏差，合併時要加容忍度

## 部署架構

Glean 把 Whisper 和 Pyannote 包成獨立的微服務：

```
[Web App] --上傳音訊--> [API Server]
                            |
                    +-------+-------+
                    |               |
              [Whisper Service] [Pyannote Service]
                    |               |
                    +-------+-------+
                            |
                      [合併 + 儲存]
```

兩個 service 可以平行處理同一個音訊，總處理時間約等於較慢的那個（通常是 Whisper）。

### GPU 資源分配

一張 RTX 3090（24GB VRAM）可以同時跑 Whisper large-v3 + Pyannote，但要注意 VRAM 分配。我的做法是用 Docker + NVIDIA Container Toolkit，每個 service 限制 VRAM 使用量。

## 效果

在 Glean 的實際使用中：

- **語音辨識準確率**：中文 ~93%，中英夾雜 ~88%
- **講者辨識準確率**：2-4 人會議 ~90%，5 人以上 ~80%
- **處理速度**：1 小時音訊約 10-12 分鐘
- **使用者滿意度**：大多數情況不需要手動修正講者標記

## 總結

1. **分開處理 STT 和 Diarization** 比 all-in-one 方案更靈活、品質更好
2. **word_timestamps 是合併對齊的前提**，一定要開
3. **講者數量 hint** 能顯著提升分離品質
4. **邊界案例**（同時說話、靜默幻覺）需要特別處理
5. **微服務架構** 讓兩個模型可以平行處理，縮短總時間

下一步計劃是加入 real-time streaming 支援，讓使用者在會議進行中就能看到即時逐字稿。
