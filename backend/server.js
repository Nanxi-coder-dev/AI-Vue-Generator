/**
 * Express 启动入口：只负责加载环境变量、挂载中间件、引入路由、监听端口。
 * 具体业务逻辑分别放在 routes/ 与 services/ 中。
 */

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const generateRouter = require('./routes/generate')

const app = express()
const PORT = process.env.PORT || 3000

// 全局中间件
app.use(cors())          // 允许跨域（供 Vite 前端调用）
app.use(express.json())  // 解析 JSON 请求体

// 路由挂载：所有 /api 开头的请求交给 generateRouter 处理
app.use('/api', generateRouter)

// 健康检查接口（用于快速确认服务是否存活）
app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log('=================================')
  console.log(`🚀 后端服务已启动: http://localhost:${PORT}`)
  console.log('=================================')
})
