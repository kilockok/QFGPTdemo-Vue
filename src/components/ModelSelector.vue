<template>
  <div class="tw-relative" data-model-selector>
    <button
      @click="$emit('toggle-dropdown')"
      class="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-base tw-rounded-lg tw-bg-transparent tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8] hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#2a2a2a] tw-transition tw-duration-200 tw-min-w-[180px] tw-justify-between tw-font-semibold"
    >
      <div class="tw-flex tw-items-center tw-gap-2">
        <span class="tw-font-medium tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8]">ChatGPT</span>
        <span class="tw-font-normal tw-text-[#6b7280] dark:tw-text-[#9ca3af]">{{ selectedModel?.name }}</span>
      </div>
      <svg class="tw-w-4 tw-h-4 tw-text-[#6b7280] dark:tw-text-[#9ca3af] tw-transition-transform tw-duration-200" :class="{ 'tw-rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <div v-if="dropdownOpen" class="tw-absolute tw-top-full tw-left-0 tw-mt-1 tw-w-full tw-bg-white dark:tw-bg-[#40414f] tw-border tw-border-[#d1d5db] dark:tw-border-[#565869] tw-rounded-lg tw-shadow-lg tw-z-50 tw-py-1 tw-max-h-64 tw-overflow-y-auto">
      <button
        v-for="model in models"
        :key="model.id"
        @click="$emit('select-model', model)"
        class="tw-w-full tw-text-left tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#525364] tw-transition tw-duration-200 tw-flex tw-items-start tw-gap-3"
      >
        <div>
          <div class="tw-font-medium tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8]">{{ model.name }}</div>
          <div class="tw-text-xs tw-text-[#6b7280] dark:tw-text-[#9ca3af] tw-mt-0.5">{{ model.description }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Model {
  id: string
  name: string
  description: string
}

defineProps<{
  models: Model[]
  selectedModel: Model | undefined
  dropdownOpen: boolean
}>()

defineEmits<{
  'toggle-dropdown': []
  'select-model': [model: Model]
}>()
</script>