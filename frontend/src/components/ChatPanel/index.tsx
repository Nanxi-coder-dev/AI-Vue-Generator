import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Input, Spin, message } from 'antd'
import { ReloadOutlined, RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useAppStore } from '../../store/useAppStore'
import { genId } from '../../utils/id'
import { generateCode } from '../../api/generate'
import type { Message } from '../../types'

/** 从错误对象中提取可读的错误信息（优先取后端返回的 message） */
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message ?? err.message
  }
  if (err instanceof Error) return err.message
  return ''
}

export default function ChatPanel() {
  // 从全局 store 中取出状态与 actions
  const messages = useAppStore((s) => s.messages)
  const isLoading = useAppStore((s) => s.isLoading)
  const addMessage = useAppStore((s) => s.addMessage)
  const setLoading = useAppStore((s) => s.setLoading)
  const setCode = useAppStore((s) => s.setCode)
  const setSchema = useAppStore((s) => s.setSchema)
  const resetState = useAppStore((s) => s.resetState)

  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const [messageApi, contextHolder] = message.useMessage() // 顶部弹窗提示

  // 消息变化时自动滚动到底部
  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // 刷新记录：清空对话、代码编辑器、属性面板
  const handleReset = () => {
    resetState()
    setInput('')
  }

  const handleSend = async () => {
    const content = input.trim()
    if (!content || isLoading) return

    // 1. 先把用户消息写入对话
    const userMsg: Message = { id: genId(), role: 'user', content, createdAt: Date.now() }
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    try {
      // 2. 组装完整对话历史，调用后端生成接口
      const history: Message[] = [...messages, userMsg]
      const { code, schema } = await generateCode(history)

      // 3. 更新当前代码与匹配到的 Schema（右侧编辑区 / 属性面板）
      setCode(code)
      setSchema(schema)

      // 4. 追加助手回复，并把生成的代码附带在消息里，供气泡内展示
      addMessage({
        id: genId(),
        role: 'assistant',
        content: schema
          ? `已匹配到「${schema.name}」组件规范，并生成代码如下：`
          : '已生成代码（未匹配到特定组件规范）：',
        code,
        createdAt: Date.now(),
      })
    } catch (err) {
      // 5. 出错时给出提示（透出后端返回的真实原因）
      console.error('[ChatPanel] 生成失败:', err)
      const detail = getErrorMessage(err)
      addMessage({
        id: genId(),
        role: 'assistant',
        content: `生成失败：${detail || '请检查后端日志'}`,
        createdAt: Date.now(),
      })
      messageApi.error(detail || '生成失败，请查看后端日志')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="chat-panel">
        <div className="chat-header">
          <span>对话</span>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={isLoading}
          >
            刷新记录
          </Button>
        </div>

        <div className="chat-list" ref={listRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              <Avatar
                size="small"
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
              />
              <div className="chat-bubble">
                {msg.content}
                {/* 若消息附带代码，则在气泡内展示代码块 */}
                {msg.code && <pre className="chat-code">{msg.code}</pre>}
              </div>
            </div>
          ))}

          {/* 加载中提示气泡 */}
          {isLoading && (
            <div className="chat-msg assistant">
              <Avatar size="small" icon={<RobotOutlined />} />
              <div className="chat-bubble">
                <Spin size="small" /> 正在生成…
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="描述你想要的组件，例如：生成一个蓝色的按钮…"
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              // Enter 发送，Shift + Enter 换行
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={!input.trim()}
          >
            发送
          </Button>
        </div>
      </div>
    </>
  )
}
