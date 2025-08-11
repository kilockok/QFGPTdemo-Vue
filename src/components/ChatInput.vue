<template>
  <div class="tw-p-4">
    <!-- 输入框容器 -->
    <form @submit.prevent="$emit('submit')" class="tw-max-w-3xl tw-mx-auto">
      <div class="tw-relative tw-border tw-border-[#d1d5db] dark:tw-border-[#565869] tw-rounded-2xl tw-bg-white dark:tw-bg-[#40414f] tw-shadow-sm focus-within:tw-shadow-md tw-transition-shadow">
        <!-- 输入框 -->
        <div class="tw-flex tw-items-end tw-gap-3 tw-p-4">
          <div class="tw-flex-1">
            <textarea
              ref="taRef"
              :value="text"
              @input="handleInput"
              :placeholder="placeholder"
              class="tw-w-full tw-min-h-[24px] tw-max-h-48 tw-bg-transparent tw-resize-none tw-text-base tw-leading-6 tw-text-[#0d0d0d] dark:tw-text-[#ececf1] tw-placeholder-[#8e8ea0] dark:tw-placeholder-[#8e8ea0] focus:tw-outline-none"
              @keydown.enter.exact.prevent="$emit('submit')"
              @keydown.shift.enter.stop
            ></textarea>
          </div>
          <button
            v-if="!loading"
            type="submit"
            :disabled="loading || !text.trim()"
            class="tw-inline-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-bg-[#0d0d0d] dark:tw-bg-[#ececf1] tw-text-white dark:tw-text-[#0d0d0d] hover:tw-bg-[#2d2d2d] dark:hover:tw-bg-[#d1d1d1] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition tw-flex-shrink-0"
            :title="text.trim() ? '发送' : '输入点什么吧'"
          >
            <svg class="tw-w-4 tw-h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
          <button
            v-else
            type="button"
            class="tw-inline-flex tw-items-center tw-justify-center tw-h-8 tw-rounded-full tw-bg-[#f4f4f4] dark:tw-bg-[#2a2a2a] tw-text-[#0d0d0d] dark:tw-text-[#ececf1] hover:tw-bg-[#e5e5e5] dark:hover:tw-bg-[#333] tw-transition tw-px-3 tw-text-sm tw-flex-shrink-0"
            @click="$emit('stop')"
          >
            停止生成
          </button>
        </div>
      </div>
    </form>

    <!-- 免责声明 -->
    <div class="tw-text-center tw-text-xs tw-text-[#9ca3af] dark:tw-text-[#6b7280] tw-py-3 tw-max-w-3xl tw-mx-auto">{{ disclaimer }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const taRef = ref<HTMLTextAreaElement | null>(null)

defineProps<{
  text: string
  loading: boolean
  placeholder: string
  disclaimer: string
}>()

const emit = defineEmits<{
  'update:text': [value: string]
  'submit': []
  'stop': []
  'auto-resize': []
}>()

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:text', target.value)
  autoResize()
}

function autoResize() {
  const ta = taRef.value
  if (!ta) return
  ta.style.height = 'auto'
  ta.style.height = Math.min(ta.scrollHeight, 240) + 'px'
  emit('auto-resize')
}

defineExpose({
  autoResize
})
</script>