/**
 * 全局 TypeScript 类型定义
 */

/** 消息角色 */
export type Role = 'user' | 'assistant' | 'system'

/** 一条对话消息 */
export interface Message {
  id: string
  role: Role
  content: string
  /** 创建时间戳（毫秒） */
  createdAt?: number
  /** 该条消息附带的代码（后续 SSE 流式返回时可填充） */
  code?: string
}

/** 组件属性项的类型，决定属性面板渲染什么控件 */
export type SchemaPropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'array'

/** 组件属性（Prop）定义 */
export interface SchemaProp {
  /** 属性名，对应 Vue 组件的 prop 名 */
  name: string
  /** 中文显示名 */
  label: string
  /** 控件类型 */
  type: SchemaPropType
  /** 默认值 */
  default?: unknown
  /** type 为 select 时的可选项 */
  options?: { label: string; value: string | number }[]
  /** 说明 */
  description?: string
}

/** 组件事件（Event）定义 */
export interface SchemaEvent {
  name: string
  label: string
  description?: string
}

/** 组件插槽（Slot）定义 */
export interface SchemaSlot {
  name: string
  label: string
  description?: string
}

/** 一个组件的完整规范（Props / Events / Slots） */
export interface ComponentSchema {
  id: string
  /** 组件名，如 Button、Input、Table */
  name: string
  /** 分类，如 基础组件、表单组件 */
  category: string
  description: string
  props: SchemaProp[]
  events: SchemaEvent[]
  slots: SchemaSlot[]
}

/** 后端 SSE 流式返回的事件类型 */
export type GenerateStatus =
  | 'thinking'
  | 'generating'
  | 'validating'
  | 'done'
  | 'error'

/** 后端 SSE 单条事件负载 */
export interface GenerateEvent {
  type: GenerateStatus
  /** 增量代码片段 */
  content?: string
  /** 提示信息 / 错误信息 */
  message?: string
  /** 匹配到的组件 Schema */
  schema?: ComponentSchema
}

/** 通用 API 响应包装 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}
