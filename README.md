还未完成


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


## 与 VitePress 兼容
- tailwind.config.js 中设置了 prefix: 'tw-'，避免与 vitepress-theme-curve 冲突。
- 组件类名均使用 tw- 前缀。
