<template>
  <div v-if="show" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50" @click="$emit('close')">
    <div class="tw-bg-white dark:tw-bg-[#40414f] tw-rounded-lg tw-p-6 tw-w-96 tw-max-w-[90vw]" @click.stop>
      <h3 class="tw-text-lg tw-font-semibold tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8] tw-mb-4">设置</h3>
      <div class="tw-space-y-4">
        <div class="tw-flex tw-items-center tw-justify-between">
          <span class="tw-text-sm tw-text-[#374151] dark:tw-text-[#d1d5db]">暗色模式</span>
          <button
            @click="$emit('toggle-dark')"
            class="tw-relative tw-inline-flex tw-w-11 tw-h-6 tw-bg-gray-200 dark:tw-bg-gray-600 tw-rounded-full tw-transition tw-duration-200"
            :class="{ 'tw-bg-[#10a37f]': isDark }"
          >
            <span 
              class="tw-inline-block tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-transition tw-duration-200 tw-transform tw-translate-x-0.5 tw-translate-y-0.5"
              :class="{ 'tw-translate-x-5': isDark }"
            ></span>
          </button>
        </div>
        
        <div class="tw-flex tw-items-center tw-justify-between">
          <span class="tw-text-sm tw-text-[#374151] dark:tw-text-[#d1d5db]">显示模型选择器</span>
          <button
            @click="$emit('toggle-model-selector')"
            class="tw-relative tw-inline-flex tw-w-11 tw-h-6 tw-bg-gray-200 dark:tw-bg-gray-600 tw-rounded-full tw-transition tw-duration-200"
            :class="{ 'tw-bg-[#10a37f]': showModelSelector }"
          >
            <span 
              class="tw-inline-block tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-transition tw-duration-200 tw-transform tw-translate-x-0.5 tw-translate-y-0.5"
              :class="{ 'tw-translate-x-5': showModelSelector }"
            ></span>
          </button>
        </div>
        
        <div class="tw-flex tw-items-center tw-justify-between">
          <span class="tw-text-sm tw-text-[#374151] dark:tw-text-[#d1d5db]">主题色</span>
          <div class="tw-relative">
            <select 
              :value="themeColor"
              @change="updateColor"
              class="tw-appearance-none tw-bg-white dark:tw-bg-[#40414f] tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-px-3 tw-py-2 tw-pr-8 tw-text-sm tw-text-[#374151] dark:tw-text-[#d1d5db] tw-cursor-pointer focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#10a37f]"
            >
              <option v-for="color in colorOptions" :key="color.value" :value="color.value">
                {{ color.name }}
              </option>
            </select>
            <div class="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2 tw-pointer-events-none">
              <svg class="tw-w-4 tw-h-4 tw-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tw-mt-6 tw-flex tw-justify-end">
        <button 
          @click="$emit('close')"
          class="tw-px-4 tw-py-2 tw-bg-[#10a37f] tw-text-white tw-rounded-lg tw-text-sm tw-font-medium hover:tw-bg-[#0f9071] tw-transition tw-duration-200"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  show: boolean
  isDark: boolean
  showModelSelector: boolean
  themeColor: string
}>()

const emit = defineEmits<{
  'close': []
  'toggle-dark': []
  'toggle-model-selector': []
  'update-theme-color': [color: string]
}>()

const colorOptions = [
  { name: '蓝色', value: '#2563eb' },
  { name: '红色', value: '#dc2626' },
  { name: '绿色', value: '#16a34a' },
  { name: '黄色', value: '#ca8a04' },
  { name: '紫色', value: '#9333ea' },
  { name: '橙色', value: '#c2410c' },
  { name: '青色', value: '#0891b2' },
  { name: '粉色', value: '#be185d' },
  { name: '灰色', value: '#374151' },
  { name: '翠绿色', value: '#059669' },
  { name: '靛蓝色', value: '#7c3aed' },
  { name: '玫瑰色', value: '#db2777' },
]

function updateColor(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update-theme-color', target.value)
}
</script>