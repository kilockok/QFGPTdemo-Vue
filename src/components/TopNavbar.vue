<template>
  <header class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-h-14 tw-bg-white dark:tw-bg-[#212121] tw-fixed tw-top-0 tw-right-0 tw-z-30 tw-left-0 md:tw-left-[260px]" :class="{ 'tw-border-b tw-border-gray-200 dark:tw-border-[#4d4d4f]': hasMessages }">
    <!-- 模型选择器 -->
    <div class="tw-flex tw-items-center tw-gap-2">
      <ModelSelector
        v-if="showModelSelector"
        :models="models"
        :selected-model="selectedModel"
        :dropdown-open="modelDropdownOpen"
        @toggle-dropdown="$emit('toggle-model-dropdown')"
        @select-model="$emit('select-model', $event)"
      />
    </div>

    <!-- 右侧控件 -->
    <div class="tw-flex tw-items-center tw-gap-1">
      <!-- 侧边栏切换按钮（手机端） -->
      <button 
        class="tw-inline-flex md:tw-hidden tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-lg tw-text-[#6b7280] dark:tw-text-[#9ca3af] hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#40414f] tw-transition tw-duration-200" 
        @click="$emit('toggle-sidebar')"
        title="切换侧边栏"
      >
        <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- 用户菜单 -->
      <UserMenu
        :user-info="userInfo"
        :menu-open="userMenuOpen"
        :is-dark="isDark"
        @toggle-menu="$emit('toggle-user-menu')"
        @show-settings="$emit('show-settings')"
        @toggle-dark="$emit('toggle-dark')"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import ModelSelector from './ModelSelector.vue'
import UserMenu from './UserMenu.vue'

interface Model {
  id: string
  name: string
  description: string
}

interface UserInfo {
  name: string
  email: string
  plan: string
  avatar: string
}

defineProps<{
  showModelSelector: boolean
  models: Model[]
  selectedModel: Model | undefined
  modelDropdownOpen: boolean
  userInfo: UserInfo
  userMenuOpen: boolean
  isDark: boolean
  hasMessages: boolean
}>()

defineEmits<{
  'toggle-model-dropdown': []
  'select-model': [model: Model]
  'toggle-sidebar': []
  'toggle-user-menu': []
  'show-settings': []
  'toggle-dark': []
}>()
</script>