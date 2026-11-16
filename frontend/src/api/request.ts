import axios from 'axios'

/**
 * Axios 实例封装。
 * baseURL 优先读取环境变量 VITE_API_BASE_URL，默认走 Vite 代理 /api（见 vite.config.js）。
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  // 大模型（deepseek-v4-pro 推理模型）生成代码实测约 80 秒以上，
  // 超时设为 5 分钟，避免前端比后端先超时。
  timeout: 300_000,
})

// 统一错误处理：这里只打印日志，后续可扩展为全局错误提示
request.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[request] 请求失败:', error?.message ?? error)
    return Promise.reject(error)
  },
)

export default request
