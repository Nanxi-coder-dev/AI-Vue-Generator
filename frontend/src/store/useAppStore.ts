import { create } from 'zustand'
import type { ComponentSchema, Message } from '../types'

/* ==================== Mock 数据（脱离后端即可测试） ==================== */

/** 一段 Vue3 单文件组件示例代码，用于填充 Monaco 编辑器 */
export const MOCK_CODE = `<template>
  <div class="demo">
    <button class="btn" :type="type" :disabled="disabled" @click="handleClick">
      <slot>点击按钮</slot>
    </button>
  </div>
</template>

<script setup lang="ts">
// 组件对外暴露的属性（Props）
defineProps({
  type: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false },
})

// 组件对外暴露的事件（Events）
const emit = defineEmits(['click'])
function handleClick() {
  emit('click')
}
</script>

<style scoped>
.demo {
  padding: 24px;
}
.btn {
  padding: 8px 20px;
  border: 1px solid #1677ff;
  border-radius: 6px;
  background: #1677ff;
  color: #fff;
  cursor: pointer;
}
</style>`

/** 一个「按钮」组件的 Schema 示例，用于填充属性面板 */
export const MOCK_SCHEMA: ComponentSchema = {
  id: 'button',
  name: 'Button',
  category: '基础组件',
  description: '按钮用于触发一个操作，如提交表单、打开弹窗等。',
  props: [
    {
      name: 'type',
      label: '按钮类型',
      type: 'select',
      default: 'primary',
      options: [
        { label: '主按钮', value: 'primary' },
        { label: '次按钮', value: 'default' },
        { label: '虚线按钮', value: 'dashed' },
        { label: '危险按钮', value: 'danger' },
      ],
    },
    {
      name: 'size',
      label: '尺寸',
      type: 'select',
      default: 'middle',
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'middle' },
        { label: '小', value: 'small' },
      ],
    },
    { name: 'disabled', label: '是否禁用', type: 'boolean', default: false },
    { name: 'color', label: '颜色', type: 'color', default: '#1677ff' },
  ],
  events: [{ name: 'click', label: '点击事件', description: '点击按钮时触发' }],
  slots: [{ name: 'default', label: '默认插槽', description: '按钮内容' }],
}

/** 初始对话历史 */
const MOCK_MESSAGES: Message[] = [
  { id: 'm1', role: 'user', content: '帮我生成一个蓝色的主按钮', createdAt: 0 },
  {
    id: 'm2',
    role: 'assistant',
    content: '好的，已匹配到「按钮」组件规范，并生成如下代码：',
    createdAt: 0,
  },
]

/* ==================== Store 定义 ==================== */

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
  /** 重置为初始状态 */
  resetState: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  messages: MOCK_MESSAGES,
  currentCode: MOCK_CODE,
  currentSchema: MOCK_SCHEMA,
  isLoading: false,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setCode: (code) => set({ currentCode: code }),
  setSchema: (schema) => set({ currentSchema: schema }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetState: () =>
    set({ messages: [], currentCode: '', currentSchema: null, isLoading: false }),
}))
