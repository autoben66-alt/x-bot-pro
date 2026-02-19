import type { Config } from "tailwindcss";

const config: Config = {
  // 🌟 採用更寬鬆的掃描路徑，確保不論檔案在哪個層級都能被抓到
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 這裡保持空白，讓 page.tsx 中的任意顏色和樣式能直接生效
    },
  },
  // 增加這行可以確保即使有其他樣式衝突，Tailwind 也能優先套用
  important: true, 
  plugins: [],
};

export default config;