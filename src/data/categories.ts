export const categories = {
  tech:       { label: '技術文章',   color: 'teal',   description: '架構拆解、技術決策與實作筆記' },
  discovery:  { label: '新知分享',   color: 'amber',  description: '值得關注的工具、專案與資源推薦' },
  reflection: { label: '開發者日記', color: 'violet', description: '開發日常、職涯觀點與產業觀察' },
} as const;

export type Category = keyof typeof categories;
