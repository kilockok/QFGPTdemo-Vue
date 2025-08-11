<template>
  <div class="tw-relative" data-user-menu>
    <button 
      @click="$emit('toggle-menu')"
      class="tw-inline-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-rounded-full tw-bg-[#ab68ff] tw-text-white tw-text-sm tw-font-medium hover:tw-bg-[#9f4fff] tw-transition tw-duration-200" 
      title="用户菜单"
    >
      {{ userInfo.avatar }}
    </button>

    <!-- 用户下拉菜单 -->
    <div v-if="menuOpen" class="tw-absolute tw-top-full tw-right-0 tw-mt-1 tw-w-64 tw-bg-white dark:tw-bg-[#40414f] tw-border tw-border-[#d1d5db] dark:tw-border-[#565869] tw-rounded-lg tw-shadow-lg tw-z-50 tw-py-1">
      <div class="tw-px-3 tw-py-2 tw-border-b tw-border-[#e5e7eb] dark:tw-border-[#4d4d4f]">
        <div class="tw-text-sm tw-font-medium tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8]">{{ userInfo.email }}</div>
        <div class="tw-text-xs tw-text-[#6b7280] dark:tw-text-[#9ca3af]">{{ userInfo.plan }}</div>
      </div>
      
      <button class="tw-w-full tw-text-left tw-px-3 tw-py-2 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8] hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#525364] tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-3">
        <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        我的计划
      </button>
      
      <button class="tw-w-full tw-text-left tw-px-3 tw-py-2 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8] hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#525364] tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-3" @click="$emit('show-settings')">
        <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        设置
      </button>

      <div class="tw-border-t tw-border-[#e5e7eb] dark:tw-border-[#4d4d4f] tw-mt-1"></div>
      
      <button 
        class="tw-w-full tw-text-left tw-px-3 tw-py-2 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8] hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#525364] tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-3" 
        @click="$emit('toggle-dark')"
      >
        <svg v-if="isDark" class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <svg v-else class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
        {{ isDark ? '浅色模式' : '深色模式' }}
      </button>
      
      <button class="tw-w-full tw-text-left tw-px-3 tw-py-2 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#f7f7f8] hover:tw-bg-[#f5f5f5] dark:hover:tw-bg-[#525364] tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-3">
        <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        注销
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserInfo {
  name: string
  email: string
  plan: string
  avatar: string
}

defineProps<{
  userInfo: UserInfo
  menuOpen: boolean
  isDark: boolean
}>()

defineEmits<{
  'toggle-menu': []
  'show-settings': []
  'toggle-dark': []
}>()
</script>