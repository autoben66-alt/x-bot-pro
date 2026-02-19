import type { Config } from "tailwindcss";

const config: Config = {
  // 🌟 調整路徑，確保 Next.js 在編譯時能 100% 抓取到所有層級的組件
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 保持乾淨，讓 page.tsx 裡的 Tailwind 類別直接控制顏色
    },
  },
  plugins: [],
};

export default config;