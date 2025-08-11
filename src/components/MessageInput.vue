<template>
  <div class="tw-border-t tw-border-gray-200 dark:tw-border-gray-800 tw-p-4">
    <form @submit.prevent="onSubmit" class="tw-max-w-[820px] tw-mx-auto tw-space-y-2">
      <div class="tw-flex tw-items-end tw-gap-2">
        <div class="tw-flex-1 tw-relative">
          <textarea
            ref="taRef"
            v-model="text"
            :placeholder="placeholder"
            class="tw-w-full tw-min-h-[48px] tw-max-h-60 tw-rounded-xl tw-border tw-border-gray-300 dark:tw-border-gray-700 tw-bg-white dark:tw-bg-gray-800 tw-px-4 tw-py-3 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[var(--ring-color)] focus:tw-border-transparent tw-resize-none tw-text-[15px] tw-leading-6"
            @input="autoResize"
            @keydown.enter.exact.prevent="onSubmit"
            @keydown.shift.enter.stop
          ></textarea>
        </div>
        <button
          v-if="!loading"
          type="submit"
          :disabled="disabled || !text.trim()"
          class="tw-inline-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-rounded-xl tw-bg-brand tw-text-white hover:tw-bg-brand-dark disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition"
          :title="text.trim() ? '发送' : '输入点什么吧'"
        >
          <svg class="tw-w-5 tw-h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
        <button
          v-else
          type="button"
          class="tw-inline-flex tw-items-center tw-justify-center tw-h-11 tw-rounded-xl tw-bg-gray-200 dark:tw-bg-gray-700 tw-text-gray-800 dark:tw-text-gray-100 hover:tw-bg-gray-300 dark:hover:tw-bg-gray-600 tw-transition tw-px-3"
          @click="$emit('stop')"
        >
          停止生成
        </button>
      </div>
      <p class="tw-text-[12px] tw-text-center tw-text-gray-500 dark:tw-text-gray-400">AI 可能会生成不准确的内容，请自行判断与核实。</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { theme } from '../theme'

const props = defineProps<{ placeholder?: string; disabled?: boolean; loading?: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void; (e: 'stop'): void }>()

const text = ref('')
const taRef = ref<HTMLTextAreaElement | null>(null)

const ringColor = computed(() => theme.colors.primaryRing)

function autoResize() {
  const ta = taRef.value
  if (!ta) return
  ta.style.height = 'auto'
  ta.style.height = Math.min(ta.scrollHeight, 240) + 'px'
}

function onSubmit() {
  if (!text.value.trim() || props.disabled) return
  emit('send', text.value)
  text.value = ''
  autoResize()
}

onMounted(() => {
  document.documentElement.style.setProperty('--ring-color', ringColor.value)
  autoResize()
})

watch(() => props.loading, (v) => {
  // 当开始加载时，保持输入框高度固定；结束后重置
  if (!v) requestAnimationFrame(autoResize)
})
</script>