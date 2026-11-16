import axios from 'axios'

/**
 * Axios 实例（Step 1 占位）。
 * 后续 Step 2 会在此基础上封装 SSE 流式请求。
 * baseURL 优先读取环境变量 VITE_API_BASE_URL，默认走 Vite 代理 /api。
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30_000,
})

// 统一响应拦截：直接返回 data 字段
request.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

export default request
