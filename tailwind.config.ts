import type { Config } from "tailwindcss";

const config: Config = {
  // 🌟 擴大掃描範圍，確保 src 底下所有資料夾的樣式都能被捕捉
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 🌟 移除原本的 background/foreground 變數定義，避免與 globals.css 衝突
    },
  },
  plugins: [],
};

export default config;