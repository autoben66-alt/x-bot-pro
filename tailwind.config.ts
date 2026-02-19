import type { Config } from "tailwindcss";

/**
 * 💡 Tailwind CSS v4 提醒：
 * 在 v4 中，此檔案為選配。若您使用的是 PostCSS 模式，
 * 請確保在 globals.css 中使用 @config "../../tailwind.config.ts"; 進行連結。
 */
const config: Config = {
  // 🌟 採用最嚴謹且完整的路徑，確保 src 資料夾下的所有內容都被掃描
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 在此處自訂您的主題色彩
    },
  },
  // 🌟 強制讓 Tailwind 的樣式具有最高優先權
  important: true, 
  plugins: [],
};

export default config;