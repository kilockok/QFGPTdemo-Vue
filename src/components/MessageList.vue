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
        <div v-else-if="m.role === 'assistant'" class="tw-flex tw-w-full tw-flex-col tw-gap-1 empty:tw-hidden first:tw-pt-[3px]">
          <div class="tw-prose dark:tw-prose-invert tw-w-full tw-break-words">
            <div v-html="renderMarkdown(m.content)"></div>
            <span v-if="shouldShowCursor(idx, m.role)" class="blink-caret"></span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string }

const props = defineProps<{ messages: Message[]; loading?: boolean; themeColor?: string }>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, lang) {
    const language = (lang && hljs.getLanguage(lang)) ? lang : ''
    const highlighted: string = language
      ? hljs.highlight(code, { language }).value
      : md.utils.escapeHtml(code)
    const label = language ? language.toUpperCase() : 'CODE'
    return `
<div class=\"code-block tw-rounded-xl tw-overflow-hidden\">
  <div class=\"tw-flex tw-items-center tw-justify-between tw-text-[12px] tw-text-gray-600 tw-bg-[#f3f3f3] dark:tw-text-gray-400 dark:tw-bg-[#1f1f1f] tw-px-3 tw-py-2\">
    <span class=\"tw-font-medium tw-tracking-wide\">${label}</span>
    <button class=\"copy-btn tw-inline-flex tw-items-center tw-gap-1 tw-rounded tw-px-2 tw-py-1 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-800\" type=\"button\" aria-label=\"Copy code\">
      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" class=\"tw-w-4 tw-h-4\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 9h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5l5 5v10a2 2 0 0 1-2 2z\"/></svg>
      <span>Copy code</span>
    </button>
  </div>
  <pre class=\"code-pre tw-p-4 tw-overflow-auto\"><code class=\"hljs ${language ? `language-${language}` : ''}\">${highlighted}</code></pre>
</div>`
  }
})

function renderMarkdown(text: string) { return md.render(text) }

const lastIndex = computed(() => props.messages.length - 1)
function shouldShowCursor(idx: number, role: Message['role']) {
  return props.loading && idx === lastIndex.value && role === 'assistant'
}

const rootEl = ref<HTMLElement | null>(null)
function onClick(e: Event) {
  const target = e.target as HTMLElement
  const btn = target.closest('.copy-btn') as HTMLElement | null
  if (!btn) return
  const block = btn.closest('.code-block') as HTMLElement | null
  if (!block) return
  const code = block.querySelector('pre code') as HTMLElement | null
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

onMounted(() => { rootEl.value?.addEventListener('click', onClick) })
onBeforeUnmount(() => { rootEl.value?.removeEventListener('click', onClick) })
watch(() => props.messages, () => { /* delegation covers new blocks */ }, { deep: true })
</script>

<style scoped>
/* 用户消息气泡样式 */
:root {
  --user-chat-width: 70%;
}

/* Flashing caret for streaming */
@keyframes caretBlink { 50% { opacity: 0; } }
.blink-caret {
  display: inline-block;
  width: 8px;
  height: 1.1em;
  margin-left: 2px;
  background-color: currentColor;
  vertical-align: -0.15em;
  opacity: 0.6;
  animation: caretBlink 1s steps(1, start) infinite;
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