export interface ToolRecommendation {
  category: string;
  description: string;
  tools: {
    name: string;
    description: string;
    url: string;
    badge?: 'using' | 'recommended';
  }[];
}

export const boardCategories: ToolRecommendation[] = [
  {
    category: 'LLM Inference',
    description: '本地或雲端部署大型語言模型的推論框架',
    tools: [
      {
        name: 'vLLM',
        description: '高效能 LLM 推論引擎，支援 PagedAttention，適合生產環境大量併發請求。',
        url: 'https://github.com/vllm-project/vllm',
        badge: 'using',
      },
      {
        name: 'Ollama',
        description: '最簡單的本地 LLM 部署方案，一行指令就能跑起來，適合開發和測試。',
        url: 'https://github.com/ollama/ollama',
        badge: 'using',
      },
      {
        name: 'llama.cpp',
        description: 'C++ 實作的 LLM 推論，支援 CPU / Metal / CUDA，資源需求最低。',
        url: 'https://github.com/ggml-org/llama.cpp',
      },
    ],
  },
  {
    category: 'Speech-to-Text',
    description: '語音辨識模型和工具',
    tools: [
      {
        name: 'Whisper',
        description: 'OpenAI 的語音辨識模型，多語言支援，準確度高，是目前開源 STT 的首選。',
        url: 'https://github.com/openai/whisper',
        badge: 'using',
      },
      {
        name: 'Faster Whisper',
        description: '用 CTranslate2 加速的 Whisper，速度快 4 倍，記憶體用量更少。',
        url: 'https://github.com/SYSTRAN/faster-whisper',
        badge: 'recommended',
      },
      {
        name: 'Pyannote',
        description: '說話者分離（Speaker Diarization）的最佳開源方案，搭配 Whisper 使用效果很好。',
        url: 'https://github.com/pyannote/pyannote-audio',
        badge: 'using',
      },
    ],
  },
  {
    category: 'Vector Database',
    description: '向量搜尋和 Embedding 儲存方案',
    tools: [
      {
        name: 'pgvector',
        description: 'PostgreSQL 擴充，直接在既有資料庫裡做向量搜尋，不用多維護一個服務。',
        url: 'https://github.com/pgvector/pgvector',
        badge: 'using',
      },
      {
        name: 'Qdrant',
        description: '專門的向量資料庫，支援過濾、分片、分散式部署，適合大規模場景。',
        url: 'https://github.com/qdrant/qdrant',
      },
      {
        name: 'ChromaDB',
        description: '輕量級向量資料庫，API 簡單，適合快速原型開發。',
        url: 'https://github.com/chroma-core/chroma',
      },
    ],
  },
  {
    category: 'AI Agent Framework',
    description: 'Multi-Agent 和 AI Agent 開發框架',
    tools: [
      {
        name: 'LangGraph',
        description: 'LangChain 生態的 Agent 框架，支援狀態圖、迴圈、人機協作。',
        url: 'https://github.com/langchain-ai/langgraph',
      },
      {
        name: 'CrewAI',
        description: '多 Agent 協作框架，角色分工明確，適合複雜任務拆解。',
        url: 'https://github.com/crewAIInc/crewAI',
      },
      {
        name: 'Claude Code',
        description: 'Anthropic 官方 CLI，用 Claude 做程式開發自動化，支援 hooks 和自訂 workflow。',
        url: 'https://docs.anthropic.com/en/docs/claude-code',
        badge: 'using',
      },
    ],
  },
  {
    category: 'OCR',
    description: '文字辨識工具',
    tools: [
      {
        name: 'PaddleOCR',
        description: '百度開源的 OCR 工具，支援中文效果很好，輕量且易部署。',
        url: 'https://github.com/PaddlePaddle/PaddleOCR',
        badge: 'using',
      },
      {
        name: 'Surya',
        description: '多語言 OCR + 版面分析，對於複雜文件的效果不錯。',
        url: 'https://github.com/VikParuchuri/surya',
        badge: 'recommended',
      },
    ],
  },
  {
    category: 'Frontend Framework',
    description: '前端框架和工具',
    tools: [
      {
        name: 'Astro',
        description: '靜態網站生成器，內容優先，零 JS by default，這個網站就是用 Astro 做的。',
        url: 'https://github.com/withastro/astro',
        badge: 'using',
      },
      {
        name: 'Next.js',
        description: 'React 全端框架，SSR/SSG/ISR 都支援，生態系成熟。',
        url: 'https://github.com/vercel/next.js',
        badge: 'using',
      },
      {
        name: 'SvelteKit',
        description: 'Svelte 全端框架，語法簡潔，bundle 小，開發體驗很好。',
        url: 'https://github.com/sveltejs/kit',
        badge: 'using',
      },
    ],
  },
];
