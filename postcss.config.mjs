/**
 * 🌟 修復 Vercel 編譯錯誤的關鍵
 * Tailwind v4 需要使用新的 @tailwindcss/postcss 插件
 */
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // 更換為 v4 專用插件
    "autoprefixer": {},
  },
};