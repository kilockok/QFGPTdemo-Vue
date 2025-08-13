<template>
  <ul ref="rootEl" class="tw-space-y-0">
    <li
      v-for="(m, idx) in messages"
      :key="m.id"
      class="tw-py-6"
      :class="m.role === 'assistant' ? '' : 'tw-bg-white dark:tw-bg-gray-900'"
    >
      <div class="tw-max-w-[736px] tw-mx-auto tw-px-4">
        <!-- 用户消息格式 -->
        <div v-if="m.role === 'user'" class="tw-flex tw-w-full tw-flex-col tw-gap-1 empty:tw-hidden tw-items-end rtl:tw-items-start">
          <div 
            class="tw-relative tw-max-w-[70%] tw-rounded-[18px] tw-px-4 tw-py-1.5 tw-text-white"
            :style="{ backgroundColor: props.themeColor || '#2563eb' }"
          >
            <div class="tw-whitespace-pre-wrap">{{ m.content }}</div>
          </div>
        </div>
        
        <!-- GPT回复格式 -->
        <div v-else-if="m.role === 'assistant'" class="tw-flex tw-w-full tw-flex-col tw-gap-1 empty:tw-hidden first:tw-pt-[3px] tw-group/turn-messages">
          <div class="tw-prose dark:tw-prose-invert tw-w-full tw-break-words tw-prose-sm md:tw-prose-base tw-max-w-none">
            <div class="markdown-content" v-html="renderMarkdown(m.content)"></div>
          </div>
          
          <!-- 操作按钮栏 -->
          <div class="action-buttons-container">
            <div class="tw--ms-2.5 tw--me-1 tw-flex tw-flex-wrap tw-items-center tw-gap-y-4 tw-p-1 tw-select-none tw--mt-1 tw-w-[calc(100%+10px)] tw-pointer-events-auto" :style="{ color: $isDark ? '#f3f3f3' : '#5d5d5d' }">
              
              <!-- 复制按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button 
                  class="tw-rounded-lg tw-transition-all tw-duration-300 tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center tw-relative" 
                  :class="{
                    'tw-scale-110': copySuccessStates[m.id],
                    'tw-animate-pulse': copyingStates[m.id]
                  }"
                  style="color: currentColor;"
                  onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" 
                  onmouseout="this.style.backgroundColor='transparent'" 
                  aria-label="复制"
                  @click="copyMessage(m.content, m.id)"
                >
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img v-if="!copySuccessStates[m.id]" src="/icons/copy-icon.svg" alt="复制" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                    <svg v-else class="tw-w-5 tw-h-5 tw-text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  复制
                </div>
              </div>
              
              <!-- 点赞按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button class="tw-rounded-lg tw-transition-colors tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center" style="color: currentColor;" onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" onmouseout="this.style.backgroundColor='transparent'" aria-label="最佳回复">
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img src="/icons/thumbs-up-icon.svg" alt="点赞" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  最佳回复
                </div>
              </div>
              
              <!-- 点踩按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button class="tw-rounded-lg tw-transition-colors tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center" style="color: currentColor;" onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" onmouseout="this.style.backgroundColor='transparent'" aria-label="错误回复">
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img src="/icons/thumbs-down-icon.svg" alt="点踩" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  错误回复
                </div>
              </div>
              
              <!-- 朗读按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button class="tw-rounded-lg tw-transition-colors tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center" style="color: currentColor;" onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" onmouseout="this.style.backgroundColor='transparent'" aria-label="朗读">
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img src="/icons/audio-play-icon.svg" alt="朗读" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  朗读
                </div>
              </div>
              
              <!-- 编辑按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button class="tw-rounded-lg tw-transition-colors tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center" style="color: currentColor;" onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" onmouseout="this.style.backgroundColor='transparent'" aria-label="在画布中编辑">
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img src="/icons/edit-canvas-icon.svg" alt="编辑" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  在画布中编辑
                </div>
              </div>
              
              <!-- 分享按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button class="tw-rounded-lg tw-transition-colors tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center" style="color: currentColor;" onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" onmouseout="this.style.backgroundColor='transparent'" aria-label="共享">
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img src="/icons/share-icon.svg" alt="分享" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  分享
                </div>
              </div>
              
              <!-- 刷新按钮 -->
              <div class="tw-relative tw-group/tooltip">
                <button class="tw-rounded-lg tw-transition-colors tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center" style="color: currentColor;" onmouseover="this.style.backgroundColor='rgba(143, 143, 143, 0.1)'" onmouseout="this.style.backgroundColor='transparent'" aria-label="重新生成">
                  <span class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center" style="color: currentColor;">
                    <img src="/icons/refresh-icon.svg" alt="重新生成" class="tw-w-5 tw-h-5" :style="{ filter: $isDark ? 'brightness(0) saturate(100%) invert(95%) sepia(3%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' : 'brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }" />
                  </span>
                </button>
                <!-- 悬停提示 -->
                <div class="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-mt-1 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap tw-opacity-0 group-hover/tooltip:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-pointer-events-none tw-z-10">
                  重试
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string }

const props = defineProps<{ messages: Message[]; loading?: boolean; themeColor?: string }>()

// 复制状态管理
const copyingStates = ref<Record<string, boolean>>({})
const copySuccessStates = ref<Record<string, boolean>>({}) 

// 暗色模式检测
const $isDark = computed(() => {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark')
  }
  return false
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(code, lang) {
    const language = (lang && hljs.getLanguage(lang)) ? lang : ''
    const highlighted: string = language
      ? hljs.highlight(code, { language }).value
      : md.utils.escapeHtml(code)
    return highlighted
  }
})

// 自定义代码块渲染器
// 在你的 Markdown 渲染器自定义部分直接改掉

// 自定义代码块渲染器
md.renderer.rules.code_block = function (tokens, idx) {
  const token = tokens[idx]
  const code = token.content
  const highlighted = md.utils.escapeHtml(code)
  const label = 'CODE'
  return `<div class="code-block tw-rounded-xl tw-overflow-hidden">
  <div class="tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-gray-600 tw-bg-gray-100 dark:tw-text-gray-400 dark:tw-bg-gray-800 tw-px-3 tw-py-2">
    <span class="tw-font-medium tw-tracking-wide">${label}</span>
    <button class="copy-btn tw-inline-flex tw-items-center tw-gap-1 tw-rounded tw-px-2 tw-py-1 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700" type="button" aria-label="Copy code">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="tw-w-4 tw-h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      <span>Copy code</span>
    </button>
  </div>
  <pre class="code-pre tw-m-0 tw-p-4 tw-overflow-auto hljs">${highlighted}</pre>
</div>`
}


// 自定义围栏代码块渲染器
md.renderer.rules.fence = function (tokens, idx) {
  const token = tokens[idx]
  const code = token.content
  const lang = token.info.trim()
  const language = (lang && hljs.getLanguage(lang)) ? lang : ''
  const highlighted = language
    ? hljs.highlight(code, { language }).value
    : md.utils.escapeHtml(code)
  const label = language || 'CODE'
  return `<div class="code-block tw-rounded-xl tw-overflow-hidden">
  <div class="tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-gray-600 tw-bg-gray-100 dark:tw-text-gray-400 dark:tw-bg-gray-800 tw-px-3 tw-py-2">
    <span class="tw-font-medium tw-tracking-wide">${label}</span>
    <button class="copy-btn tw-inline-flex tw-items-center tw-gap-1 tw-rounded tw-px-2 tw-py-1 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700" type="button" aria-label="Copy code">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="tw-w-4 tw-h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      <span>Copy code</span>
    </button>
  </div>
  <pre class="code-pre tw-m-0 tw-p-4 tw-overflow-auto hljs ${language ? `language-${language}` : ''}">${highlighted}</pre>
</div>`
}


function renderMarkdown(text: string) {
  // 保护HTML标签及其内容，避免标签内的反引号被误解析为markdown
  let processedText = text
  
  // 保护完整的HTML标签（包括内容）
  const htmlElementRegex = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*>.*?<\/\1>|<[a-zA-Z][a-zA-Z0-9]*[^>]*\/?>|<\/[a-zA-Z][a-zA-Z0-9]*>/g
  const protectedElements: string[] = []
  let elementIndex = 0
  
  processedText = processedText.replace(htmlElementRegex, (match) => {
    const placeholder = `<!--HTML_ELEMENT_${elementIndex}-->`
    protectedElements[elementIndex] = match
    elementIndex++
    return placeholder
  })
  
  // 渲染markdown
  let result = md.render(processedText)
  
  // 恢复HTML元素
  protectedElements.forEach((element, index) => {
    const placeholder = `<!--HTML_ELEMENT_${index}-->`
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), element)
  })
  
  return result
}

const rootEl = ref<HTMLElement | null>(null)
function onClick(e: Event) {
  const target = e.target as HTMLElement
  const btn = target.closest('.copy-btn') as HTMLElement | null
  if (!btn) return
  const block = btn.closest('.code-block') as HTMLElement | null
  if (!block) return
  const code = block.querySelector('pre') as HTMLElement | null
  const text = code?.textContent || ''
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    const label = btn.querySelector('span')
    if (!label) return
    const prev = label.textContent
    label.textContent = 'Copied'
    setTimeout(() => { label.textContent = prev || 'Copy code' }, 1200)
  }).catch(() => {})
}

onMounted(() => {
  rootEl.value?.addEventListener('click', onClick)
})

onBeforeUnmount(() => {
  rootEl.value?.removeEventListener('click', onClick)
})

function copyMessage(content: string, messageId?: string) {
  const id = messageId || 'default'
  copyingStates.value[id] = true
  
  navigator.clipboard.writeText(content).then(() => {
    copyingStates.value[id] = false
    copySuccessStates.value[id] = true
    
    // 2秒后重置成功状态
    setTimeout(() => {
      copySuccessStates.value[id] = false
    }, 2000)
    
    console.log('消息已复制到剪贴板')
  }).catch(err => {
    copyingStates.value[id] = false
    console.error('复制失败:', err)
  })
}


</script>

<style scoped>
/* 复制成功动画 */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

.tw-animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
/* 去掉 Tailwind Typography 行内代码两侧的反引号 */
.tw-prose .markdown-content :deep(code:not(pre code))::before,
.tw-prose .markdown-content :deep(code:not(pre code))::after {
  content: none !important;
}

/* 用户消息气泡样式 */
:root {
  --user-chat-width: 70%;
}

/* 嵌入式Markdown样式 */
.markdown-content {
  @apply tw-text-inherit tw-leading-relaxed;
}

.markdown-content h1, .markdown-content h2, .markdown-content h3, 
.markdown-content h4, .markdown-content h5, .markdown-content h6 {
  @apply tw-font-semibold tw-text-inherit tw-mt-4 tw-mb-2;
  @apply first:tw-mt-0;
}

.markdown-content h1 { @apply tw-text-xl; }
.markdown-content h2 { @apply tw-text-lg; }
.markdown-content h3 { @apply tw-text-base tw-font-medium; }
.markdown-content h4, .markdown-content h5, .markdown-content h6 { @apply tw-text-sm tw-font-medium; }

.markdown-content p {
  @apply tw-mb-3 tw-text-inherit;
  @apply first:tw-mt-0 last:tw-mb-0;
}

.markdown-content ul, .markdown-content ol {
  @apply tw-mb-3 tw-pl-4;
  @apply first:tw-mt-0 last:tw-mb-0;
}

.markdown-content li {
  @apply tw-mb-1 tw-text-inherit;
}

.markdown-content blockquote {
  @apply tw-border-l-4 tw-border-gray-400 dark:tw-border-gray-500 tw-pl-3 tw-italic tw-my-3;
  @apply tw-text-gray-700 dark:tw-text-gray-300;
}

.markdown-content table {
  @apply tw-w-full tw-border-collapse tw-my-3 tw-text-sm;
  @apply tw-border tw-border-gray-200 dark:tw-border-gray-600;
}

.markdown-content th, .markdown-content td {
  @apply tw-border tw-border-gray-200 dark:tw-border-gray-600 tw-px-3 tw-py-1.5;
  @apply tw-text-inherit;
}

.markdown-content th {
  @apply tw-bg-gray-50 dark:tw-bg-gray-700 tw-font-medium;
}

.markdown-content strong {
  @apply tw-font-semibold tw-text-inherit;
}

.markdown-content em {
  @apply tw-italic tw-text-inherit;
}

.markdown-content a {
  @apply tw-text-blue-600 dark:tw-text-blue-400 tw-underline;
  @apply hover:tw-text-blue-800 dark:hover:tw-text-blue-300;
}

/* 代码块样式 - 确保不被覆盖 */
.markdown-content .code-block {
  @apply tw-my-3;
  background: transparent !important;
}

.markdown-content .code-block .code-pre {
  background: #0b0b0c !important;
  color: #e6edf3 !important;
}

/* 使用 :deep() 确保样式能应用到动态生成的内容 */
.markdown-content :deep(:not(pre) > code) {
  @apply tw-bg-gray-200 dark:tw-bg-gray-700 tw-px-1.5 tw-py-1 tw-rounded tw-text-sm;
  @apply tw-text-gray-900 dark:tw-text-gray-100 tw-font-mono;
  @apply tw-border tw-border-gray-300 dark:tw-border-gray-600;
}

/* 增加优先级确保行内代码样式生效 */
.tw-prose .markdown-content :deep(code:not(pre code)) {
  @apply tw-bg-gray-200 dark:tw-bg-gray-700 tw-px-1.5 tw-py-1 tw-rounded tw-text-sm !important;
  @apply tw-text-gray-900 dark:tw-text-gray-100 tw-font-mono !important;
  @apply tw-border tw-border-gray-300 dark:tw-border-gray-600 !important;
}

/* Markdown prose 基础样式 */
.tw-prose {
  max-width: none;
}

/* GPT-like code block styling */
.code-block { background: transparent; }
.code-block .code-pre {
  background: #0b0b0c !important; /* ChatGPT-like dark code surface even in light theme */
  color: #e6edf3;
}
.dark .code-block .code-pre {
  background: #0f0f10 !important; /* slightly lighter in dark mode to match contrast */
  color: #e6edf3;
}

/* Scroll aesthetics similar to ChatGPT */
.code-block .code-pre::-webkit-scrollbar { height: 12px; }
.code-block .code-pre::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 999px; }
.code-block .code-pre::-webkit-scrollbar-track { background: transparent; }

/* Syntax highlighting (One Dark-like, close to ChatGPT) */
.hljs { color: #e6edf3; }
.hljs-keyword,
.hljs-selector-tag,
.hljs-literal { color: #c678dd; }

.hljs-string,
.hljs-doctag,
.hljs-template-variable,
.hljs-attr,
.hljs-addition { color: #98c379; }

.hljs-number,
.hljs-built_in,
.hljs-builtin-name,
.hljs-class .hljs-title,
.hljs-attr,
.hljs-selector-attr,
.hljs-selector-pseudo { color: #d19a66; }

.hljs-title,
.hljs-section,
.hljs-type,
.hljs-name { color: #61afef; }

.hljs-attribute,
.hljs-variable,
.hljs-symbol { color: #e5c07b; }

.hljs-comment,
.hljs-quote { color: #7f848e; font-style: italic; }

.hljs-meta,
.hljs-meta .hljs-keyword { color: #abb2bf; }

.hljs-emphasis { font-style: italic }
.hljs-strong { font-weight: 600 }
</style>