<template>
  <div class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-p-6">
    <div class="tw-max-w-2xl tw-text-center">
      <div class="tw-mb-8">
        <h2 class="tw-text-3xl tw-font-semibold tw-text-[#343541] dark:tw-text-[#ececf1] tw-mb-2">{{ headerTitle }}</h2>
        <p class="tw-text-[#6b7280] dark:tw-text-[#9ca3af] tw-text-base">{{ emptyHint }}</p>
      </div>
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-max-w-3xl">
        <button
          v-for="prompt in quickPrompts"
          :key="prompt"
          class="tw-p-4 tw-text-sm tw-text-left tw-border tw-border-[#d1d5db] dark:tw-border-[#565869] tw-rounded-xl tw-bg-white dark:tw-bg-[#40414f] tw-text-[#374151] dark:tw-text-[#d1d5db] hover:tw-bg-[#f9fafb] dark:hover:tw-bg-[#525364] tw-transition tw-duration-200"
          @click="$emit('quick-prompt', prompt)"
        >
          {{ prompt }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headerTitle: string
  emptyHint: string
  quickPrompts: string[]
}>()

defineEmits<{
  'quick-prompt': [prompt: string]
}>()
</script>