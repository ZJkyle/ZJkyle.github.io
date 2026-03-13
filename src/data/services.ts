export interface Service {
  title: string;
  description: string;
  forYou: string[];
  capabilities: string[];
}

export const services: Service[] = [
  {
    title: 'AI 應用開發',
    description: '將 LLM、RAG、Embedding 等技術整合進你的產品或內部工具。',
    forYou: [
      '想在產品中加入 AI 功能（智慧搜尋、自動分類、對話機器人等）',
      '需要建立企業內部的知識庫或文件問答系統',
      '想自動化處理非結構化資料（帳單、合約、報告等）',
    ],
    capabilities: [
      'LLM API 整合與 Prompt Engineering',
      'RAG Pipeline 設計（文件切割、Embedding、Vector Search）',
      'Multi-Agent 系統架構設計',
      'Speech-to-Text / OCR 整合',
    ],
  },
  {
    title: '全端產品開發',
    description: '從零到一打造完整的 Web 應用，包含前端、後端、資料庫與部署。',
    forYou: [
      '有產品想法但缺少技術執行力',
      '需要 MVP 快速上線驗證市場',
      '現有系統需要重構或功能擴充',
    ],
    capabilities: [
      '前端：Next.js / SvelteKit + Tailwind CSS',
      '後端：FastAPI / Hono + PostgreSQL',
      'Bot 開發：Discord / Telegram / LINE',
      'CI/CD 與 Docker 容器化部署',
    ],
  },
  {
    title: '技術顧問',
    description: '針對 AI 導入策略、技術選型、架構設計提供諮詢。',
    forYou: [
      '想導入 AI 但不確定從哪裡開始',
      '需要評估不同 AI 框架與模型的優劣',
      '團隊需要技術方向的指引',
    ],
    capabilities: [],
  },
];
