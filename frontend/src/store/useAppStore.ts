import { create } from 'zustand'
import type { ComponentSchema, Message } from '../types'

interface AppState {
  /** 对话历史 */
  messages: Message[]
  /** 当前生成的 Vue 代码 */
  currentCode: string
  /** 当前匹配到的组件 Schema */
  currentSchema: ComponentSchema | null
  /** 是否正在等待大模型响应 */
  isLoading: boolean

  // ---- actions ----
  /** 追加一条消息 */
  addMessage: (msg: Message) => void
  /** 更新当前代码 */
  setCode: (code: string) => void
  /** 更新当前 Schema */
  setSchema: (schema: ComponentSchema | null) => void
  /** 更新加载状态 */
  setLoading: (loading: boolean) => void
  /** 重置为初始状态（清空对话、代码、Schema） */
  resetState: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  // 初始为空：代码编辑器、属性面板、对话历史都从空开始，
  // 只有真正调用后端生成后才会写入内容（响应式）。
  messages: [],
  currentCode: '',
  currentSchema: null,
  isLoading: false,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setCode: (code) => set({ currentCode: code }),
  setSchema: (schema) => set({ currentSchema: schema }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetState: () =>
    set({ messages: [], currentCode: '', currentSchema: null, isLoading: false }),
}))
