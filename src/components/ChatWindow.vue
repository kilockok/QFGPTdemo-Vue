<template>
  <div ref="container" class="tw-flex-1 tw-overflow-y-auto tw-p-6 tw-space-y-6 tw-scrollbar">
    <MessageList :messages="messages" :loading="loading" :theme-color="themeColor" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MessageList from './MessageList.vue'

interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string }

const props = defineProps<{ messages: Message[]; loading: boolean; themeColor?: string }>()

const container = ref<HTMLElement | null>(null)

function scrollToBottom() {
  if (!container.value) return
  container.value.scrollTop = container.value.scrollHeight
}

onMounted(scrollToBottom)
watch(() => props.messages.length, scrollToBottom)
watch(() => props.loading, (v) => v && setTimeout(scrollToBottom, 50))
</script>