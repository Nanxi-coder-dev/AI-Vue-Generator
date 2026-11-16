/**
 * Schema 匹配服务：根据用户输入的自然语言，匹配最合适的组件规范。
 * 当前采用「关键词打分」的简单匹配策略，后续可升级为向量/语义匹配。
 */

const fs = require('fs')
const path = require('path')

// 组件规范文件路径（模块加载一次，读入内存缓存）
const SCHEMA_FILE = path.join(__dirname, '..', 'data', 'schemas.json')
const { components } = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf-8'))

/**
 * 根据用户输入匹配最合适的组件 Schema。
 * @param {string} userInput 用户输入的自然语言描述
 * @returns {object|null} 匹配到的组件 Schema；未命中时返回 null
 */
function matchSchema(userInput) {
  if (!userInput || typeof userInput !== 'string') return null

  const input = userInput.toLowerCase()
  let best = null
  let bestScore = 0

  for (const comp of components) {
    const keywords = comp.keywords || []
    let score = 0

    // 命中关键词越多、关键词越长，得分越高
    for (const keyword of keywords) {
      if (input.includes(String(keyword).toLowerCase())) {
        score += keyword.length
      }
    }

    if (score > bestScore) {
      bestScore = score
      best = comp
    }
  }

  return best
}

/** 返回所有组件 Schema（供后续属性面板 / 下拉框使用） */
function listSchemas() {
  return components
}

module.exports = { matchSchema, listSchemas }
