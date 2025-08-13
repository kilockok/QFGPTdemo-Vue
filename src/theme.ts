// 集中主题配置 - ChatGPT 完全复刻版本
export const theme = {
  // 应用基础信息
  appTitle: 'ChatGPT',
  headerTitle: 'ChatGPT',
  icp: '京ICP备123456789号',

  // 字体配置（ChatGPT 风格）
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  // API 配置
  apiBase: 'http://192.168.2.2:12381/v1', // LM Studio / OpenAI 兼容
  defaultModel: 'gpt-3.5-turbo',
  timeoutMs: 60000,

  // 模型选项（模拟 ChatGPT 下拉选择）
  models: [
    { id: 'gpt-4o', name: '4o', description: '我们最强的模型' },
    { id: 'gpt-4o-mini', name: 'GPT-4o mini', description: '更快、更实惠的智能模型' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速、经济的模型' },
    { id: 'llama-3-8b', name: 'Llama 3 8B', description: '本地开源模型' },
    { id: 'qwen-3-8b', name: '笨蛋清凤', description: '笨蛋清凤' }
  ],

  // 深色模式
  enableDarkMode: false,

  // ChatGPT 精确配色
  colors: {
    // 主色调
    primary: '#10a37f',
    primaryHover: '#0f9071',
    primaryRing: '#10a37f',
    
    // 背景色
    bgPrimary: '#ffffff',
    bgPrimaryDark: '#212121',
    bgSecondary: '#f7f7f8',
    bgSecondaryDark: '#2f2f2f',
    
    // 消息气泡背景
    userBg: 'transparent',
    userBgDark: 'transparent',
    assistantBg: '#f7f7f8',
    assistantBgDark: '#2f2f2f',
    
    // 文本色
    textPrimary: '#343541',
    textPrimaryDark: '#ececf1',
    textSecondary: '#6b7280',
    textSecondaryDark: '#9ca3af',
    
    // 边框色
    border: '#e5e7eb',
    borderDark: '#4d4d4f',
    borderLight: '#d1d5db',
    borderLightDark: '#565869',
    
    // 悬停态
    hoverBg: '#f5f5f5',
    hoverBgDark: '#40414f',
  },

  // UI 交互配置
  ui: {
    streamByDefault: true,
    showTimestamps: false,
    enableSounds: false,
    compactMode: false,
    showWordCount: false,
    autoScroll: true,
    maxTokens: 4096,
  },

  // 文案配置
  placeholder: '给 ChatGPT 发消息',
  emptyHint: '您好！有什么我可以帮助您的吗？',
  quickPrompts: [
    '为一个新产品制定营销计划',
    '编写一段Python代码来分析数据',
    '为我的简历提供改进建议',
    '解释量子计算的基本概念'
  ],
  
  // 状态提示
  errorPrefix: '抱歉，出现了一个错误：',
  retryText: '重新生成回答',
  stopText: '停止生成',
  
  // 底部免责声明
  disclaimer: 'ChatGPT 可能会生成不准确的信息，请核实重要信息。'
}

export type Theme = typeof theme