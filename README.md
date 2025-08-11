# QF GPT Demo - Vue 3 + Vite + Tailwind 模板

一个开箱即用、支持 SSR、可与 VitePress 兼容的前端模板。UI 参考 ChatGPT，支持本地 LM Studio（OpenAI 兼容）API 调用。

## 功能特性

- 🎨 **现代化 UI** - 参考 ChatGPT 设计，简洁美观
- 🌙 **暗色模式** - 完整的深色主题支持，状态持久化
- 📱 **响应式设计** - 适配桌面端和移动端
- 🔧 **模块化组件** - 高度可复用的 Vue 3 组件架构
- ⚡ **高性能** - Vite 构建，支持 HMR 热更新
- 🎯 **TypeScript** - 完整的类型支持
- 🔌 **API 兼容** - 支持 OpenAI 兼容的 API（如 LM Studio）
- 📦 **开箱即用** - 零配置启动，快速开发

## 技术栈
- Vue 3 + Composition API
- Vite
- Tailwind CSS（tw- 前缀避免样式冲突）
- TypeScript
- SSR 入口（entry-client.ts / entry-server.ts）
- Markdown 渲染 + 代码高亮

## 快速开始

### 1. 安装依赖
- 推荐 Node.js >= 18
- 使用 pnpm

```bash
pnpm install
```

### 2. 本地开发
```bash
pnpm dev
```
浏览器将自动打开 http://localhost:5173/

### 3. 构建静态站点
```bash
pnpm build
pnpm preview
```
将生成 dist 目录，适合部署到 GitHub Pages / Vercel 等静态托管。确保 vite.config.ts 中 base 为 './'（已配置）。

### 4. SSR 构建（可选）
模板内提供 SSR 入口以便将来集成至 VitePress / 子应用：
```bash
pnpm build:ssr
```
这会对 src/entry-server.ts 进行 SSR 构建。

## 主题配置（src/theme.ts）
你可以在 src/theme.ts 中集中管理所有可定制参数：
- 页面标题 appTitle
- 顶部标题名称 headerTitle
- ICP 备案号 icp（页脚展示）
- 字体 fontFamily
- API 地址 apiBase
- 默认模型 defaultModel
- 请求超时 timeoutMs
- 深色/浅色模式开关 enableDarkMode
- 主配色 colors（primary/hover/ring 等）
- 交互文案 placeholder/emptyHint

修改后无需重启即可生效（部分需要刷新）。

### 修改 API 地址
编辑 src/theme.ts：
```ts
export const theme = {
  // ...
  apiBase: 'http://localhost:1234/v1',
  defaultModel: 'gpt-3.5-turbo',
}
```
LM Studio 默认兼容 OpenAI Chat API，发送至 `${apiBase}/chat/completions` 即可。

## 组件架构

项目采用模块化组件设计，主要组件包括：

### 核心组件
- **Sidebar.vue** - 侧边栏组件，包含聊天历史和用户菜单
- **TopNavbar.vue** - 顶部导航栏，包含模型选择器和用户菜单
- **ChatInput.vue** - 聊天输入组件，支持多行输入和快捷操作
- **EmptyState.vue** - 空状态展示组件，显示欢迎信息和快捷提示
- **SettingsModal.vue** - 设置弹窗组件

### 辅助组件
- **ChatWindow.vue** - 聊天窗口容器
- **MessageList.vue** - 消息列表展示
- **MessageInput.vue** - 消息输入（备用）
- **ModelSelector.vue** - 模型选择下拉菜单
- **UserMenu.vue** - 用户菜单下拉组件

### 组件特性
- 完整的 Props 和 Events 定义
- 支持暗色模式切换
- 响应式设计，适配移动端
- TypeScript 类型支持

## 目录结构
```
.
├─ public/
│  ├─ favicon.svg
│  └─ gpt-logo.svg
├─ src/
│  ├─ components/
│  │  ├─ ChatInput.vue
│  │  ├─ ChatWindow.vue
│  │  ├─ EmptyState.vue
│  │  ├─ MessageInput.vue
│  │  ├─ MessageList.vue
│  │  ├─ ModelSelector.vue
│  │  ├─ SettingsModal.vue
│  │  ├─ Sidebar.vue
│  │  ├─ TopNavbar.vue
│  │  └─ UserMenu.vue
│  ├─ config/
│  ├─ styles/
│  │  └─ tailwind.css
│  ├─ types/
│  ├─ utils/
│  ├─ App.vue
│  ├─ entry-client.ts
│  ├─ entry-server.ts
│  └─ theme.ts
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 与 VitePress 兼容
- tailwind.config.js 中设置了 prefix: 'tw-'，避免与 vitepress-theme-curve 冲突。
- 组件类名均使用 tw- 前缀。

## 暗色模式

项目完整支持暗色模式，具体特性：

### 切换方式
1. **用户头像菜单** - 点击右上角用户头像，选择"切换深色模式"
2. **侧边栏用户菜单** - 在侧边栏底部用户菜单中切换

### 技术实现
- 使用 Tailwind CSS 的 `dark:` 前缀实现样式切换
- 通过 `document.documentElement.classList.toggle('dark')` 控制全局暗色模式
- 状态自动保存到 localStorage，刷新页面后保持用户选择
- 支持系统主题偏好检测（首次访问时）

### 影响范围
暗色模式覆盖所有 UI 组件：
- **主背景** - 从白色 (#ffffff) 切换到深灰色 (#212121)
- **侧边栏** - 背景、文字、按钮、分割线等
- **顶部导航栏** - 背景、按钮、下拉菜单等
- **聊天区域** - 消息气泡、输入框、按钮等
- **弹窗组件** - 设置弹窗、用户菜单等
- **滚动条样式** - 适配暗色主题

## 设计说明
- 布局与配色参考 ChatGPT：白底、灰背景、品牌绿按钮、圆角输入框
- 暗色模式采用深灰色主题，保持良好的对比度和可读性
- 响应式设计，支持桌面端和移动端
- 使用 Tailwind CSS 的 `tw-` 前缀避免样式冲突

## 注意
- 如果你计划部署到子路径（如 /repo/），保持 vite.config.ts 中 base: './'。
- 如需流式输出，可在调用 API 时将 stream 设置为 true，并按 SSE 解析处理（本模板默认关闭流式以简化演示）。