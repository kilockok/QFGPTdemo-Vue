/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-', // 防止与 VitePress/第三方主题样式冲突
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx,js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10a37f', // ChatGPT 主绿色
          dark: '#0e8f70',
          light: '#11b58d'
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1f2937',
          soft: '#f7f7f8'
        }
      },
      borderRadius: {
        xl: '14px'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}