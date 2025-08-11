<template>
  <aside class="tw-hidden md:tw-flex tw-w-[260px] tw-flex-col tw-bg-[#f9f9f9] dark:tw-bg-[#171717] tw-fixed tw-inset-y-0 tw-left-0 tw-z-40 tw-border-r tw-border-[#e5e7eb] dark:tw-border-[#4d4d4f]" :class="{ 'tw-flex': sidebarOpen }">
    <!-- Logo区域 -->
    <div class="tw-p-3">
      <div class="tw-flex tw-items-center tw-justify-start">
        <img src="/gpt-logo.svg" alt="GPT Logo" class="tw-w-6 tw-h-6" />
      </div>
    </div>

    <!-- 功能菜单分区 -->
    <div class="tw-px-3 tw-pb-4">
      <!-- 新对话按钮 -->
      <button
        class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#ececf1] hover:tw-bg-[#ececf1] dark:hover:tw-bg-[#2a2a2a] tw-rounded-lg tw-transition tw-duration-200 tw-mb-1"
        @click="$emit('new-chat')"
      >
        <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        新对话
      </button>
      
      <!-- 功能菜单 -->
      <div class="tw-space-y-1">
        <button class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#ececf1] hover:tw-bg-[#ececf1] dark:hover:tw-bg-[#2a2a2a] tw-rounded-lg tw-transition tw-duration-200">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          搜索聊天
        </button>
        <button class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#ececf1] hover:tw-bg-[#ececf1] dark:hover:tw-bg-[#2a2a2a] tw-rounded-lg tw-transition tw-duration-200">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          库
        </button>
      </div>
    </div>
    
    <!-- Codex分区 -->
    <div class="tw-px-3 tw-pb-4">
      <button class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#ececf1] hover:tw-bg-[#ececf1] dark:hover:tw-bg-[#2a2a2a] tw-rounded-lg tw-transition tw-duration-200">
        <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        Codex
      </button>
    </div>
    
    <!-- 聊天历史分区 -->
    <div class="tw-flex-1 tw-overflow-y-auto tw-px-3">
      <!-- 聊天分区标题 -->
      <div class="tw-px-2 tw-py-1 tw-mb-2">
        <span class="tw-text-xs tw-font-medium tw-text-[#6b7280] dark:tw-text-[#9ca3af] tw-uppercase tw-tracking-wide">聊天</span>
      </div>
      
      <!-- 对话历史列表 -->
      <div class="tw-space-y-0.5">
        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="tw-group tw-relative tw-rounded-lg tw-transition tw-duration-200"
          :class="conv.id === activeId ? 'tw-bg-[#ececf1] dark:tw-bg-[#2a2a2a]' : 'hover:tw-bg-[#ececf1] dark:hover:tw-bg-[#2a2a2a]'"
        >
          <button
            class="tw-w-full tw-text-left tw-px-3 tw-py-3 tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#ececf1] tw-flex tw-items-center tw-gap-3"
            @click="$emit('select-conversation', conv.id)"
          >
            <svg class="tw-w-4 tw-h-4 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span class="tw-truncate tw-flex-1" v-if="editingConvId !== conv.id">{{ conv.title }}</span>
            <input v-else
                    :value="editingTitle"
                    @input="$emit('update:editing-title', ($event.target as HTMLInputElement)?.value ?? '')"
                    @keyup.enter="$emit('save-title')"
                    @keyup.escape="$emit('cancel-edit')"
                    @blur="$emit('save-title')"
                    @click.stop
                    data-editing
                    class="tw-flex-1 tw-bg-transparent tw-border-none tw-outline-none tw-text-sm tw-text-[#0d0d0d] dark:tw-text-[#ececf1]">
          </button>
          
          <!-- 操作按钮（悬停显示） -->
          <div class="tw-absolute tw-right-1 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-opacity-0 group-hover:tw-opacity-100 tw-transition tw-duration-200 tw-flex tw-gap-1" v-if="conv.id === activeId">
            <button @click.stop="$emit('start-edit-title', conv.id)" class="tw-p-1.5 tw-rounded tw-text-[#6b7280] dark:tw-text-[#9ca3af] hover:tw-bg-[#d1d5db] dark:hover:tw-bg-[#40414f] tw-transition tw-duration-200" title="编辑">
              <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button @click.stop="$emit('delete-conversation', conv.id)" class="tw-p-1.5 tw-rounded tw-text-[#6b7280] dark:tw-text-[#9ca3af] hover:tw-bg-[#d1d5db] dark:hover:tw-bg-[#40414f] tw-transition tw-duration-200" title="删除">
              <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部用户区域 -->
    <div class="tw-p-2 tw-border-t tw-border-[#e5e7eb] dark:tw-border-[#4d4d4f]" data-bottom-user-menu>
      <div class="tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2 tw-rounded-lg hover:tw-bg-[#ececf1] dark:hover:tw-bg-[#2a2a2a] tw-transition tw-duration-200 tw-cursor-pointer" @click="$emit('show-user-menu')">
        <div class="tw-w-8 tw-h-8 tw-rounded-full tw-bg-[#10a37f] tw-flex tw-items-center tw-justify-center tw-text-white tw-text-sm tw-font-medium tw-flex-shrink-0">
          {{ userInfo.avatar }}
        </div>
        <div class="tw-flex-1 tw-min-w-0">
          <div class="tw-text-sm tw-font-medium tw-text-[#0d0d0d] dark:tw-text-[#ececf1] tw-truncate">{{ userInfo.name }}</div>
          <div class="tw-text-xs tw-text-[#6b7280] dark:tw-text-[#9ca3af] tw-truncate">{{ userInfo.plan }}</div>
        </div>
        <button @click.stop="$emit('show-user-menu')" class="tw-p-1 tw-rounded tw-text-[#6b7280] dark:tw-text-[#9ca3af] hover:tw-bg-[#d1d5db] dark:hover:tw-bg-[#40414f] tw-transition tw-duration-200">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </button>
      </div>
      
      <!-- 底部用户菜单下拉 -->
      <div v-if="bottomUserMenuOpen" class="tw-absolute tw-bottom-16 tw-left-2 tw-right-2 tw-bg-white dark:tw-bg-[#40414f] tw-border tw-border-[#d1d5db] dark:tw-border-[#565869] tw-rounded-lg tw-shadow-lg tw-z-50 tw-py-1">
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
  </aside>
</template>

<script setup lang="ts">
interface Conversation {
  id: string
  title: string
  messages: any[]
}

interface UserInfo {
  name: string
  email: string
  plan: string
  avatar: string
}

defineProps<{
  sidebarOpen: boolean
  conversations: Conversation[]
  activeId: string
  editingConvId: string | null
  editingTitle: string
  bottomUserMenuOpen: boolean
  userInfo: UserInfo
  isDark: boolean
}>()

defineEmits<{
  'new-chat': []
  'select-conversation': [id: string]
  'start-edit-title': [id: string]
  'save-title': []
  'cancel-edit': []
  'delete-conversation': [id: string]
  'show-user-menu': []
  'show-settings': []
  'toggle-dark': []
  'update:editing-title': [value: string]
}>()
</script>