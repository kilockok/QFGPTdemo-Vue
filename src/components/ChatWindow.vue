<template>
  <div ref="container" class="tw-flex-1 tw-overflow-y-auto tw-p-6 tw-space-y-6 tw-scrollbar">
    <MessageList :messages="messages" :loading="loading" :theme-color="themeColor" />
    <div v-if="loading" class="tw-text-sm tw-text-gray-500 tw-text-center">{{ loadingText }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MessageList from './MessageList.vue'
import { theme } from '../theme'

interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string }

const props = defineProps<{ messages: Message[]; loading: boolean; themeColor?: string }>()

const container = ref<HTMLElement | null>(null)
const loadingText = theme.loadingText || '正在生成...'

function scrollToBottom() {
  if (!container.value) return
  container.value.scrollTop = container.value.scrollHeight
}

onMounted(scrollToBottom)
watch(() => props.messages.length, scrollToBottom)
watch(() => props.loading, (v) => v && setTimeout(scrollToBottom, 50))
</script>