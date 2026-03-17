export interface Product {
  name: string;
  tagline: string;
  problem: string;
  features: string[];
  stack: string[];
  summary: string;
  github?: string;
  status: 'active' | 'beta' | 'planning';
  access: string;
}

export const products: Product[] = [
  {
    name: 'Glean',
    tagline: '自動收集、整理散落在各通訊平台的筆記與會議記錄，用 AI 分類並追蹤待辦事項。',
    problem:
      '團隊的想法和會議紀錄散落在 Discord、Telegram、筆記本各處，事後很難找到也容易遺漏。Glean 自動彙整這些碎片資訊，透過 AI 標籤分類，讓資訊可搜尋、可追蹤。',
    features: [
      '多平台收集：Discord Bot / Telegram Bot / Web 快速輸入',
      'AI 自動標籤：基於 LLM 自動分類與語意搜尋（pgvector）',
      '會議模式：三欄介面整合個人同步、團隊討論與 Action Items',
      '語音轉文字：Whisper 語音辨識 + 說話者辨識（Pyannote）',
      '行動追蹤：Kanban / List / Timeline 三種檢視模式',
      'Google Calendar 整合',
    ],
    stack: ['Next.js 14', 'Hono', 'PostgreSQL', 'pgvector', 'vLLM (Qwen3)', 'Whisper', 'Discord.js', 'Tailwind CSS'],
    summary: '把散落各處的筆記和會議記錄自動收集整理好',
    github: 'https://github.com/ZJkyle/Glean',
    status: 'beta',
    access: '開源自架',
  },
  {
    name: 'Radar',
    tagline: '社群驅動的求職工具，整合面試經驗分享、申請追蹤與履歷產生功能。',
    problem:
      '求職過程中資訊零散：面試經驗在 PTT、Dcard 各處，投遞紀錄用 Excel 追蹤容易漏掉，準備資料散落一地。Radar 把這些流程整合在一個平台上。',
    features: [
      '求職申請追蹤：一站管理所有投遞進度',
      '面試經驗分享：社群共享面試問題與準備策略',
      '履歷 / Portfolio 產生器',
      'PWA 支援，手機也能使用',
    ],
    stack: ['SvelteKit', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Tailwind CSS', 'DaisyUI', 'Docker'],
    summary: '求職流程一站搞定，從投遞追蹤到面試經驗共享',
    github: 'https://github.com/ZJkyle/Radar',
    status: 'planning',
    access: '開發中',
  },
  {
    name: 'AutoBill',
    tagline: '基於 LLM 的自動帳單辨識與處理微服務，為 myPDA 生態系打造。',
    problem:
      '手動處理帳單耗時且容易出錯。AutoBill 透過 OCR + LLM 自動辨識帳單內容，擷取關鍵資訊並結構化儲存，大幅降低人工處理成本。',
    features: [
      'OCR 帳單辨識：整合 OCR Engine 自動擷取帳單文字',
      'LLM 資訊擷取：利用大型語言模型理解帳單結構並提取欄位',
      'Vector Search：相似帳單比對與分類',
      'RESTful API：標準化介面，輕鬆整合進既有系統',
    ],
    stack: ['FastAPI', 'OpenAI-compatible API', 'vLLM/Ollama', 'pgvector', 'asyncpg', 'structlog'],
    summary: '拍張照片就能自動辨識帳單，擷取金額和明細',
    github: 'https://github.com/ZJkyle/AutoBill',
    status: 'active',
    access: '開源自架',
  },
];
