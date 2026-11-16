/**
 * 大模型调用服务：封装调用阿里云 DashScope（通义千问）生成代码的逻辑。
 * 使用 axios 发起 HTTP 请求，模型名通过环境变量 MODEL_NAME 配置。
 */

const axios = require('axios')

// 从环境变量读取配置（dotenv 已在 server.js 中加载）
const API_KEY = process.env.QWEN_API_KEY

// DashScope 原生文本生成接口（与之前跑通的 Demo 保持一致）
const DASHSCOPE_URL =
  process.env.DASHSCOPE_URL ||
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

// 模型名：实测 deepseek-v4 不存在（返回 "Model not exist"），deepseek-v4-pro 可用
const MODEL = process.env.MODEL_NAME || 'deepseek-v4-pro'

/**
 * 根据匹配到的组件 Schema 拼装严格的 System Prompt。
 * 让大模型只生成符合规范（Props / Events / Slots）的 Vue3 代码。
 * @param {object|null} schema 组件 Schema
 * @returns {string} System Prompt
 */
function buildSystemPrompt(schema) {
  const schemaText = schema ? JSON.stringify(schema, null, 2) : '无特定组件规范'

  return [
    '你是一名资深的前端工程师，负责根据用户需求生成符合规范的 Vue3 单文件组件（SFC）代码。',
    '',
    '## 必须遵守的组件规范（JSON Schema）',
    schemaText,
    '',
    '## 生成要求',
    '1. 只输出一个完整的 Vue3 单文件组件，使用 <template>、<script setup>、<style scoped> 三段式结构。',
    '2. 组件对外暴露的 props / emits / slots 必须与上面 Schema 保持一致（名称、类型、默认值）。',
    '3. 使用原生 HTML + CSS 实现样式，不依赖任何第三方 UI 库。',
    '4. 代码可直接在浏览器中运行，不要包含任何解释性文字。',
    '5. 将生成的代码包裹在 markdown 代码块中，语言标记为 vue，方便程序提取。',
  ].join('\n')
}

/**
 * 从模型返回内容中提取代码字符串。
 * 兼容带 markdown 代码块（```vue ... ```）和纯代码两种返回形式。
 * @param {string} content 模型原始返回内容
 * @returns {string} 提取后的代码
 */
function extractCode(content) {
  if (!content) return ''
  // 匹配第一个 markdown 代码块（vue / html / js 等语言标记均可）
  const match = content.match(/```(?:vue|html|javascript|js)?\s*\n?([\s\S]*?)```/i)
  if (match) return match[1].trim()
  return content.trim()
}

/**
 * 调用大模型生成 Vue 代码。
 * @param {Array<{role: string, content: string}>} messages 对话历史
 * @param {object|null} schema 匹配到的组件 Schema
 * @returns {Promise<string>} 生成并提取后的代码字符串
 */
async function generateCode(messages, schema) {
  if (!API_KEY) {
    throw new Error('缺少环境变量 QWEN_API_KEY，请在 backend/.env 中配置')
  }

  const payload = {
    model: MODEL,
    input: {
      messages: [
        { role: 'system', content: buildSystemPrompt(schema) },
        ...(Array.isArray(messages) ? messages : []),
      ],
    },
    parameters: {
      result_format: 'message', // 返回标准的 message 结构
    },
  }

  const { data } = await axios.post(DASHSCOPE_URL, payload, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 300000, // 推理模型生成代码实测约 80 秒，超时设为 5 分钟
  })

  // DashScope 原生接口的返回层级：data.output.choices[0].message.content
  const content = data?.output?.choices?.[0]?.message?.content ?? ''
  return extractCode(content)
}

module.exports = { generateCode, buildSystemPrompt, extractCode }
