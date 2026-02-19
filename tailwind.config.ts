import type { Config } from "tailwindcss";

const config: Config = {
  // 🌟 採用最嚴謹且完整的路徑，確保 src 資料夾下的所有內容都被掃描
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // 額外增加這行作為雙重保險
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 保持乾淨，讓 page.tsx 裡的類別直接控制顏色
    },
  },
  // 🌟 強制讓 Tailwind 的樣式具有最高優先權，解決樣式被 Next.js 預設樣式覆蓋的問題
  important: true, 
  plugins: [],
};

export default config;