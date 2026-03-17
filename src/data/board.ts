export interface TechItem {
  name: string;
  description: string;
  url: string;
  badge?: 'using' | 'recommended' | 'planning';
  usedIn?: string[];
  note?: string;
}

export interface TechLayer {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  textColor: string;
  items: TechItem[];
}

export const techLayers: TechLayer[] = [
  {
    id: 'products',
    name: 'Products',
    subtitle: '我做的產品和工具',
    color: 'bg-teal-600',
    textColor: 'text-teal-700',
    items: [
      {
        name: 'Glean',
        description: '會議記錄與筆記自動收集平台。多平台收集（Discord / Telegram / Web）、AI 自動標籤、語音轉文字 + 說話者辨識、Kanban 追蹤。',
        url: 'https://github.com/ZJkyle/Glean',
        badge: 'using',
        usedIn: ['Next.js', 'Hono', 'PostgreSQL', 'pgvector', 'vLLM', 'Whisper', 'Pyannote'],
        note: 'Beta -- 核心功能完成，持續迭代中',
      },
      {
        name: 'AutoBill',
        description: '基於 LLM 的自動帳單辨識微服務。OCR 擷取帳單文字 + LLM 理解結構並提取欄位 + Vector Search 分類。',
        url: 'https://github.com/ZJkyle/AutoBill',
        badge: 'using',
        usedIn: ['FastAPI', 'vLLM', 'Ollama', 'pgvector', 'dots.ocr'],
        note: 'Active -- 已上線使用',
      },
      {
        name: 'Radar',
        description: '社群驅動的求職工具。整合面試經驗分享、申請追蹤、履歷產生。PWA 支援。',
        url: 'https://github.com/ZJkyle/Radar',
        badge: 'planning',
        usedIn: ['SvelteKit', 'FastAPI', 'PostgreSQL'],
        note: '開發中 -- 功能規劃完成',
      },
      {
        name: 'Manatee',
        description: '你現在看到的這個網站。AI 工具集合站、技術文章、架構分享。',
        url: 'https://github.com/ZJkyle/ZJkyle.github.io',
        badge: 'using',
        usedIn: ['Astro', 'Tailwind CSS'],
        note: 'Active -- 持續更新',
      },
    ],
  },
  {
    id: 'ai-agent',
    name: 'AI Agent & Orchestration',
    subtitle: 'Agent 框架、RAG Pipeline、Prompt 工程',
    color: 'bg-violet-600',
    textColor: 'text-violet-700',
    items: [
      {
        name: 'Claude Code',
        description: 'Anthropic 官方 CLI，用 Claude 做程式開發自動化，支援 hooks、MCP 和自訂 workflow。',
        url: 'https://docs.anthropic.com/en/docs/claude-code',
        badge: 'using',
        note: '日常開發主力工具，搭配 hooks 做自動化流程',
      },
      {
        name: 'LlamaIndex',
        description: 'RAG 框架，文件切割 / Embedding / 檢索 / 回答一條龍。支援多種資料來源。',
        url: 'https://github.com/run-llama/llama_index',
        badge: 'using',
        usedIn: ['Glean', 'myPDA'],
        note: '用在 RAG Engine，搭配 Milvus 做向量檢索',
      },
      {
        name: 'LangGraph',
        description: 'LangChain 生態的 Agent 框架，支援狀態圖、迴圈、人機協作，適合複雜多步驟任務。',
        url: 'https://github.com/langchain-ai/langgraph',
        badge: 'recommended',
      },
      {
        name: 'CrewAI',
        description: '多 Agent 協作框架，角色分工明確，適合複雜任務拆解和團隊模擬。',
        url: 'https://github.com/crewAIInc/crewAI',
      },
      {
        name: 'FlagEmbedding',
        description: '高效文本嵌入 + Reranker。BGE 系列模型，支援多語言，搭配 RAG 使用效果好。',
        url: 'https://github.com/FlagOpen/FlagEmbedding',
        badge: 'using',
        usedIn: ['myPDA'],
        note: '用在 RAG+ 增強版，Reranker 顯著提升檢索品質',
      },
      {
        name: 'MCP (Model Context Protocol)',
        description: 'Anthropic 定義的 Model Context Protocol，讓 AI Agent 可以存取外部工具和資料。',
        url: 'https://modelcontextprotocol.io/',
        badge: 'using',
        note: '用在 Claude Code 和未來的 Agent 調度系統',
      },
    ],
  },
  {
    id: 'ai-models',
    name: 'AI Models & Inference',
    subtitle: 'LLM 推論引擎、語音辨識、OCR',
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    items: [
      {
        name: 'vLLM',
        description: '高效能 LLM 推論引擎，支援 PagedAttention 和連續批次處理，適合生產環境大量併發。',
        url: 'https://github.com/vllm-project/vllm',
        badge: 'using',
        usedIn: ['Glean', 'AutoBill', 'myPDA'],
        note: '生產環境主力，跑 Qwen2.5-14B',
      },
      {
        name: 'Ollama',
        description: '最簡單的本地 LLM 部署方案，一行指令跑起來。適合開發和快速測試。',
        url: 'https://github.com/ollama/ollama',
        badge: 'using',
        usedIn: ['AutoBill'],
        note: '開發環境用，快速切換不同模型',
      },
      {
        name: 'llama.cpp',
        description: 'C++ 實作的 LLM 推論，支援 CPU / Metal / CUDA。資源需求最低，適合邊緣部署。',
        url: 'https://github.com/ggml-org/llama.cpp',
      },
      {
        name: 'Whisper (Large V3)',
        description: 'OpenAI 語音辨識模型，多語言支援，準確度高，開源 STT 首選。',
        url: 'https://github.com/openai/whisper',
        badge: 'using',
        usedIn: ['Glean', 'myPDA'],
        note: '搭配 Pyannote 做說話者辨識',
      },
      {
        name: 'Faster Whisper',
        description: '用 CTranslate2 加速的 Whisper，速度快 4 倍，記憶體更少，品質不變。',
        url: 'https://github.com/SYSTRAN/faster-whisper',
        badge: 'recommended',
      },
      {
        name: 'Pyannote',
        description: '說話者分離（Speaker Diarization）最佳開源方案，搭配 Whisper 使用。',
        url: 'https://github.com/pyannote/pyannote-audio',
        badge: 'using',
        usedIn: ['Glean'],
      },
      {
        name: 'dots.ocr',
        description: '1.7B 參數統一 VLM 架構 OCR，支援表格、手寫辨識，中英日混合效果好。',
        url: 'https://github.com/ppaanngggg/dots.ocr',
        badge: 'using',
        usedIn: ['AutoBill', 'myPDA'],
        note: '取代 PaddleOCR，VLM 架構更通用',
      },
      {
        name: 'PaddleOCR',
        description: '百度開源 OCR，支援中文效果好，輕量易部署。',
        url: 'https://github.com/PaddlePaddle/PaddleOCR',
        badge: 'recommended',
      },
      {
        name: 'Surya',
        description: '多語言 OCR + 版面分析，對複雜文件效果不錯。',
        url: 'https://github.com/VikParuchuri/surya',
        badge: 'recommended',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data & Storage',
    subtitle: '資料庫、向量搜尋、快取',
    color: 'bg-blue-600',
    textColor: 'text-blue-700',
    items: [
      {
        name: 'PostgreSQL + pgvector',
        description: '在既有 PostgreSQL 裡直接做向量搜尋，不用多維護一個服務。關聯查詢 + 向量搜尋一站搞定。',
        url: 'https://github.com/pgvector/pgvector',
        badge: 'using',
        usedIn: ['Glean', 'AutoBill'],
        note: '個人專案首選 -- 簡單、夠用、少一個服務要維護',
      },
      {
        name: 'Milvus',
        description: '專門的向量資料庫，支援大規模向量檢索、混合搜尋、分散式部署。',
        url: 'https://github.com/milvus-io/milvus',
        badge: 'using',
        usedIn: ['myPDA'],
        note: '企業場景用，搭配 LlamaIndex RAG Engine',
      },
      {
        name: 'Qdrant',
        description: '向量資料庫，Rust 寫的，支援過濾、分片、分散式，適合大規模場景。',
        url: 'https://github.com/qdrant/qdrant',
      },
      {
        name: 'ChromaDB',
        description: '輕量級向量資料庫，API 簡單，適合快速原型。',
        url: 'https://github.com/chroma-core/chroma',
      },
      {
        name: 'Redis',
        description: '快取、Pub/Sub、Celery Backend。用在任務佇列和即時通知。',
        url: 'https://github.com/redis/redis',
        badge: 'using',
        usedIn: ['myPDA'],
      },
    ],
  },
  {
    id: 'web',
    name: 'Web & Backend',
    subtitle: '前後端框架、API、Bot',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    items: [
      {
        name: 'Astro',
        description: '靜態網站生成器，內容優先，零 JS by default。這個網站就是用 Astro 做的。',
        url: 'https://github.com/withastro/astro',
        badge: 'using',
        usedIn: ['Manatee'],
      },
      {
        name: 'Next.js',
        description: 'React 全端框架，SSR / SSG / ISR 都支援，生態系成熟。',
        url: 'https://github.com/vercel/next.js',
        badge: 'using',
        usedIn: ['Glean'],
      },
      {
        name: 'SvelteKit',
        description: 'Svelte 全端框架，語法簡潔，bundle 小，開發體驗好。',
        url: 'https://github.com/sveltejs/kit',
        badge: 'using',
        usedIn: ['Radar'],
      },
      {
        name: 'FastAPI',
        description: 'Python 非同步 Web 框架，自動生成 OpenAPI 文件，適合 AI 微服務。',
        url: 'https://github.com/fastapi/fastapi',
        badge: 'using',
        usedIn: ['AutoBill', 'Radar', 'myPDA'],
        note: 'AI 微服務首選 -- 搭配 Pydantic 驗證',
      },
      {
        name: 'Hono',
        description: '超輕量 Web 框架，支援多 runtime（Node, Deno, Bun, Cloudflare Workers）。',
        url: 'https://github.com/honojs/hono',
        badge: 'using',
        usedIn: ['Glean'],
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS 框架，快速出 UI，搭配任何前端框架使用。',
        url: 'https://github.com/tailwindlabs/tailwindcss',
        badge: 'using',
        usedIn: ['Manatee', 'Glean', 'Radar'],
      },
      {
        name: 'Discord.js',
        description: 'Discord Bot 開發框架，用在 Glean 的多平台筆記收集。',
        url: 'https://github.com/discordjs/discord.js',
        badge: 'using',
        usedIn: ['Glean'],
      },
    ],
  },
  {
    id: 'infra',
    name: 'Infrastructure & DevOps',
    subtitle: '容器化、CI/CD、GPU、部署',
    color: 'bg-slate-700',
    textColor: 'text-slate-700',
    items: [
      {
        name: 'Docker / Docker Compose',
        description: '容器化部署標準，所有服務都跑在 Docker 裡，Compose 管理多容器編排。',
        url: 'https://github.com/docker/compose',
        badge: 'using',
        usedIn: ['Glean', 'AutoBill', 'myPDA'],
      },
      {
        name: 'GitHub Actions',
        description: 'CI/CD 管線，自動測試、建置和部署。這個網站就是用 GitHub Actions 部署到 GitHub Pages。',
        url: 'https://github.com/features/actions',
        badge: 'using',
        usedIn: ['Manatee'],
      },
      {
        name: 'NVIDIA GPU (CUDA)',
        description: 'AI 推論加速基礎。vLLM、Whisper、OCR 模型都需要 GPU。',
        url: 'https://developer.nvidia.com/cuda-toolkit',
        badge: 'using',
        usedIn: ['myPDA'],
        note: '生產環境用 Spark Edge AI，開發用 Mac Metal',
      },
      {
        name: 'GitLab CI/CD',
        description: '企業內部 CI/CD，搭配 GitLab Runner 做自動化測試和部署。',
        url: 'https://docs.gitlab.com/ee/ci/',
        badge: 'using',
        usedIn: ['myPDA'],
      },
    ],
  },
];

// Helper: get all unique project names across layers
export function getAllProjects(): string[] {
  const projects = new Set<string>();
  techLayers.forEach(layer => {
    layer.items.forEach(item => {
      item.usedIn?.forEach(p => projects.add(p));
    });
  });
  return Array.from(projects).sort();
}
