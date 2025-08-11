<template>
  <div class="tw-flex tw-h-screen tw-bg-white dark:tw-bg-[#212121]">
    <!-- 侧边栏组件 -->
    <Sidebar
      :sidebar-open="sidebarOpen"
      :conversations="conversations"
      :active-conversation-id="activeId"
      :editing-conv-id="editingConvId"
      :editing-title="editingTitle"
      :bottom-user-menu-open="bottomUserMenuOpen"
      :user-info="userInfo"
      :is-dark="isDark"
      @new-chat="newChat"
      @select-conversation="activeId = $event"
      @start-edit-title="startEditTitle"
      @save-title="saveTitle"
      @cancel-edit="cancelEdit"
      @delete-conversation="deleteConversation"
      @show-user-menu="showUserMenu"
      @show-settings="showSettings = true"
      @toggle-dark="toggleDark"
      @update:editing-title="editingTitle = $event"
    />

    <!-- 手机端侧边栏遮罩 -->
    <div v-if="sidebarOpen" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-30 md:tw-hidden" @click="sidebarOpen = false"></div>

    <!-- 主内容区域 -->
    <div class="tw-flex-1 tw-flex tw-flex-col tw-ml-0 md:tw-ml-[260px]">
      <!-- 顶部导航栏组件 -->
      <TopNavbar
        :show-model-selector="showModelSelector"
        :models="theme.models"
        :selected-model="selectedModel"
        :model-dropdown-open="modelDropdownOpen"
        :user-info="userInfo"
        :user-menu-open="userMenuOpen"
        :is-dark="isDark"
        :has-messages="activeMessages.length > 0"
        @toggle-model-dropdown="modelDropdownOpen = !modelDropdownOpen"
        @select-model="selectModel"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-user-menu="userMenuOpen = !userMenuOpen"
        @show-settings="showSettings = true"
        @toggle-dark="toggleDark"
       />
      
      <!-- 主聊天区域 -->
      <main class="tw-flex-1 tw-flex tw-flex-col tw-bg-white dark:tw-bg-[#212121] tw-pt-14 tw-overflow-y-auto">
        <!-- 空状态 -->
        <EmptyState 
          v-if="activeMessages.length === 0"
          :header-title="theme.headerTitle"
          :empty-hint="theme.emptyHint"
          :quick-prompts="theme.quickPrompts"
          @quick-prompt="handleQuickPrompt"
        />

        <!-- 消息列表 -->
        <ChatWindow v-else :messages="activeMessages" :loading="loading" :theme-color="themeColor" />

        <!-- 输入区域 -->
        <ChatInput
          v-model:text="text"
          :loading="loading"
          :placeholder="theme.placeholder"
          :disclaimer="theme.disclaimer"
          @submit="onSubmit"
          @stop="handleStop"
          @auto-resize="autoResize"
        />
      </main>
    </div>

    <!-- 设置弹窗 -->
    <SettingsModal
      :show="showSettings"
      :is-dark="isDark"
      :show-model-selector="showModelSelector"
      :theme-color="themeColor"
      @close="showSettings = false"
      @toggle-dark="toggleDark"
      @toggle-model-selector="showModelSelector = !showModelSelector"
      @update-theme-color="updateThemeColor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import ChatWindow from './components/ChatWindow.vue'
import Sidebar from './components/Sidebar.vue'
import TopNavbar from './components/TopNavbar.vue'
import EmptyState from './components/EmptyState.vue'
import ChatInput from './components/ChatInput.vue'
import SettingsModal from './components/SettingsModal.vue'
import { theme } from './theme'

const isDark = ref(false)
const currentModel = ref(theme.defaultModel)
const showModelSelector = ref(true)
const modelDropdownOpen = ref(false)
const userMenuOpen = ref(false)
const bottomUserMenuOpen = ref(false)
const showSettings = ref(false)
const sidebarOpen = ref(false)
const isScrolled = ref(false)
const themeColor = ref('#2563eb')

// 输入框相关
const text = ref('')
const taRef = ref<HTMLTextAreaElement | null>(null)

const selectedModel = computed(() => theme.models.find(m => m.id === (currentModel.value as string)))

watch(currentModel, (m) => {
  theme.defaultModel = m as any
})

const selectModel = (model: { id: string, name: string }) => {
  currentModel.value = model.id
  modelDropdownOpen.value = false
}

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('dark-mode', isDark.value ? 'true' : 'false')
}

const updateThemeColor = (color: string) => {
  themeColor.value = color
  localStorage.setItem('theme-color', color)
}

interface Conversation { id: string; title: string; messages: Message[] }
interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string }

// 用户信息
const userInfo = ref({
  name: 'Eros',
  email: 'user@example.com',
  plan: 'Plus',
  avatar: 'E'
})

const conversations = ref<Conversation[]>([
  { id: '1', title: '新对话', messages: [] },
])
const activeId = ref(conversations.value[0].id)

const activeMessages = computed(() => conversations.value.find(c => c.id === activeId.value)?.messages ?? [])
const loading = ref(false)
const abortCtl = ref<AbortController | null>(null)
const editingConvId = ref<string | null>(null)
const editingTitle = ref('')

function selectConversation(convId: string) {
  activeId.value = convId
}

function newChat() {
  // 只是切换到一个新的空对话状态，不立即创建对话记录
  // 如果当前对话为空，直接使用；否则创建新的空对话
  const currentConv = conversations.value.find(c => c.id === activeId.value)
  if (currentConv && currentConv.messages.length === 0) {
    // 当前对话已经是空的，不需要创建新的
    return
  }
  
  // 创建新的空对话
  const id = Date.now().toString()
  conversations.value.unshift({ id, title: '新对话', messages: [] })
  activeId.value = id
  // 注意：不清空用户输入的内容 (text.value)
}

function deleteConversation(convId: string) {
  const index = conversations.value.findIndex(c => c.id === convId)
  if (index === -1) return
  
  conversations.value.splice(index, 1)
  
  // 如果删除的是当前对话，切换到其他对话或创建新对话
  if (convId === activeId.value) {
    if (conversations.value.length > 0) {
      activeId.value = conversations.value[0].id
    } else {
      // 没有对话了，创建一个新的
      const id = Date.now().toString()
      conversations.value.push({ id, title: '新对话', messages: [] })
      activeId.value = id
    }
  }
}

function startEditTitle(convId: string) {
  const conv = conversations.value.find(c => c.id === convId)
  if (!conv) return
  
  editingConvId.value = convId
  editingTitle.value = conv.title
  
  // 下一帧聚焦到输入框
  nextTick(() => {
    const input = document.querySelector('input[data-editing]') as HTMLInputElement
    if (input) {
      input.focus()
      input.select()
    }
  })
}

function saveTitle() {
  if (!editingConvId.value || !editingTitle.value.trim()) {
    cancelEdit()
    return
  }
  
  const conv = conversations.value.find(c => c.id === editingConvId.value)
  if (conv) {
    conv.title = editingTitle.value.trim()
  }
  
  cancelEdit()
}

function cancelEdit() {
  editingConvId.value = null
  editingTitle.value = ''
}

function showUserMenu() {
  // 底部用户区域点击事件
  bottomUserMenuOpen.value = !bottomUserMenuOpen.value
}

function handleQuickPrompt(prompt: string) {
  handleSend(prompt)
}

function autoResize() {
  const ta = taRef.value
  if (!ta) return
  ta.style.height = 'auto'
  ta.style.height = Math.min(ta.scrollHeight, 240) + 'px'
}

function onSubmit() {
  if (!text.value.trim() || loading.value) return
  handleSend(text.value)
  text.value = ''
  autoResize()
}

onMounted(() => {
  document.title = theme.appTitle
  if (theme.enableDarkMode) {
    const savedDarkMode = localStorage.getItem('dark-mode')
    if (savedDarkMode !== null) {
      isDark.value = savedDarkMode === 'true'
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    document.documentElement.classList.toggle('dark', isDark.value)
  }
  
  // 初始化主题色
  const savedThemeColor = localStorage.getItem('theme-color')
  if (savedThemeColor) {
    themeColor.value = savedThemeColor
  }

  // 点击外部关闭下拉与菜单
  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    
    // 检查是否点击了模型选择器或其子元素
    const modelSelector = target.closest('[data-model-selector]')
    if (!modelSelector && modelDropdownOpen.value) {
      modelDropdownOpen.value = false
    }
    
    // 检查是否点击了顶部用户菜单或其子元素
    const topUserMenu = target.closest('[data-user-menu]')
    if (!topUserMenu && userMenuOpen.value) {
      userMenuOpen.value = false
    }
    
    // 检查是否点击了底部用户菜单或其子元素
    const bottomUserMenu = target.closest('[data-bottom-user-menu]')
    if (!bottomUserMenu && bottomUserMenuOpen.value) {
      bottomUserMenuOpen.value = false
    }
  }
  window.addEventListener('click', onClickOutside)
  
  // 监听主聊天区域滚动
  const handleScroll = () => {
    const mainElement = document.querySelector('main')
    if (mainElement) {
      isScrolled.value = mainElement.scrollTop > 0
    }
  }
  
  // 添加滚动监听器
  const mainElement = document.querySelector('main')
  if (mainElement) {
    mainElement.addEventListener('scroll', handleScroll)
  }
  
  // 初始化输入框高度
  autoResize()
})

watch(() => loading.value, (v) => {
  // 当开始加载时，保持输入框高度固定；结束后重置
  if (!v) requestAnimationFrame(autoResize)
})

function handleStop() {
  if (abortCtl.value) {
    abortCtl.value.abort()
  }
}

async function handleSend(text: string) {
  if (!text.trim()) return
  let conv = conversations.value.find(c => c.id === activeId.value)
  
  // 如果没有找到当前对话，创建一个新的
  if (!conv) {
    const id = Date.now().toString()
    conv = { id, title: '新对话', messages: [] }
    conversations.value.unshift(conv)
    activeId.value = id
  }

  const userMsg: Message = { id: 'u' + Date.now(), role: 'user', content: text }
  conv.messages.push(userMsg)

  // 更新对话标题（使用用户输入的前20个字符）
  if (conv.title === '新对话' && text.length > 0) {
    conv.title = text.slice(0, 20) + (text.length > 20 ? '...' : '')
  }

  loading.value = true
  const controller = new AbortController()
  abortCtl.value = controller

  try {
    const useStream = !!(theme.ui && theme.ui.streamByDefault)

    const body = {
      model: theme.defaultModel,
      messages: conv.messages.map(m => ({ role: m.role, content: m.content })),
      stream: useStream,
    }

    const resp = await fetch(`${theme.apiBase}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!resp.ok) throw new Error(`API 错误: ${resp.status}`)

    if (useStream && resp.body) {
      const assistantMsg: Message = { id: 'a' + Date.now(), role: 'assistant', content: '' }
      conv.messages.push(assistantMsg)

      const reader = resp.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') {
            continue
          }
          
          try {
            const json = JSON.parse(data)
            const delta = json?.choices?.[0]?.delta?.content
            if (typeof delta === 'string' && delta.length > 0) {
              assistantMsg.content += delta
              
              // 强制触发Vue响应式更新
              const msgIndex = conv.messages.findIndex(m => m.id === assistantMsg.id)
              if (msgIndex !== -1) {
                conv.messages.splice(msgIndex, 1, { ...assistantMsg })
              }
              
              await nextTick()
              conversations.value = [...conversations.value]
            }
          } catch {
            // 忽略JSON解析错误
          }
        }
      }
    } else {
      const data = await resp.json()
      const content = data?.choices?.[0]?.message?.content ?? '抱歉，无法获取回复。'
      const assistantMsg: Message = { id: 'a' + Date.now(), role: 'assistant', content }
      conv.messages.push(assistantMsg)
    }
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      const abortMsg: Message = { id: 'x' + Date.now(), role: 'assistant', content: '已停止生成' }
      conv.messages.push(abortMsg)
    } else {
      const errorMsg: Message = { 
        id: 'e' + Date.now(), 
        role: 'assistant', 
        content: `连接失败：${e?.message || e}\n\n请确保 LM Studio 已启动并监听 ${theme.apiBase}` 
      }
      conv.messages.push(errorMsg)
    }
  } finally {
    loading.value = false
    abortCtl.value = null
  }
}
</script>
