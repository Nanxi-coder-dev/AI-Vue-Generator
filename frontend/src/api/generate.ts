import request from './request'
import type { ComponentSchema, Message } from '../types'

/** 后端 /api/generate 的响应结构 */
export interface GenerateResult {
  code: string
  schema: ComponentSchema | null
}

/**
 * 调用后端生成代码接口（POST /api/generate）。
 * 自动把 Message 精简为后端所需的 { role, content } 字段。
 * @param messages 完整对话历史
 */
export async function generateCode(messages: Message[]): Promise<GenerateResult> {
  const payload = {
    messages: messages.map(({ role, content }) => ({ role, content })),
  }
  const res = await request.post<GenerateResult>('/generate', payload)
  return res.data
}
