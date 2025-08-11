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
      fontFamily: {
        sans: [
          // Windows: Segoe UI for English/Numbers, Microsoft YaHei UI for Chinese
          'Segoe UI',
          'Microsoft YaHei UI',
          // macOS: San Francisco for English/Numbers, PingFang SC for Chinese
          '-apple-system',
          'PingFang SC',
          // Linux: System default with Noto Sans CJK for Chinese
          'system-ui',
          'Noto Sans CJK SC',
          'Noto Sans CJK',
          // Universal fallbacks
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
          // Emoji support
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
      },
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
        },
        'token-text-primary': '#0d0d0d',
        'token-surface-hover': '#f5f5f5'
      },
      borderRadius: {
        xl: '14px'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}