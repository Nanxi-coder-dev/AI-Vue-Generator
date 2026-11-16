/**
 * 生成接口路由：处理 POST /api/generate 请求。
 * 链路：接收需求 -> 匹配 Schema -> 调用大模型生成代码。
 */

const express = require('express')
const schemaService = require('../services/schemaService')
const qwenApi = require('../services/qwenApi')

const router = express.Router()

/**
 * POST /api/generate
 * 请求体：{ messages: [{ role: 'user', content: '生成一个按钮' }] }
 * 响应：  { code: '生成的 Vue 代码', schema: 匹配到的组件 Schema }
 */
router.post('/generate', async (req, res) => {
  try {
    const { messages } = req.body || {}

    // 1. 参数校验
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ code: '', message: '请求体缺少有效的 messages 数组' })
    }

    // 2. 取最后一条用户消息作为意图，匹配组件 Schema
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    const userInput = lastUserMsg?.content ?? ''
    const schema = schemaService.matchSchema(userInput)
    console.log(`[generate] 匹配到的组件: ${schema?.name ?? '无（未命中）'}`)

    // 3. 调用大模型生成代码（传入 messages 与匹配到的 Schema）
    const code = await qwenApi.generateCode(messages, schema)

    // 4. 返回代码（额外带上 schema，供前端属性面板在后续步骤使用）
    res.json({ code, schema })
  } catch (err) {
    console.error('[generate] 生成失败:', err.response?.data ?? err.message)
    res.status(500).json({
      code: '',
      message: err.response?.data?.message || err.message || '调用大模型失败',
    })
  }
})

module.exports = router
