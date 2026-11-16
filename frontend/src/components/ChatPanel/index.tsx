import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Input, Spin } from 'antd'
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { MOCK_CODE, MOCK_SCHEMA, useAppStore } from '../../store/useAppStore'
import { genId } from '../../utils/id'

export default function ChatPanel() {
  // 从全局 store 中取出状态与 actions
  const messages = useAppStore((s) => s.messages)
  const isLoading = useAppStore((s) => s.isLoading)
  const addMessage = useAppStore((s) => s.addMessage)
  const setLoading = useAppStore((s) => s.setLoading)
  const setCode = useAppStore((s) => s.setCode)
  const setSchema = useAppStore((s) => s.setSchema)

  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // 消息变化时自动滚动到底部
  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleSend = () => {
    const content = input.trim()
    if (!content || isLoading) return

    // 1. 先把用户消息写入对话
    addMessage({ id: genId(), role: 'user', content, createdAt: Date.now() })
    setInput('')
    setLoading(true)

    // 2. TODO(Step 2)：这里替换为调用后端 SSE 接口，根据流式事件逐步 setCode。
    //    目前用 setTimeout 模拟一次生成过程，方便脱离后端测试 UI。
    setTimeout(() => {
      addMessage({
        id: genId(),
        role: 'assistant',
        content: '已根据你的描述生成「按钮」组件代码（当前为 Mock 数据）。',
        createdAt: Date.now(),
      })
      setCode(MOCK_CODE)
      setSchema(MOCK_SCHEMA)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">对话</div>

      <div className="chat-list" ref={listRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <Avatar
              size="small"
              icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
            />
            <div className="chat-bubble">{msg.content}</div>
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
          placeholder="描述你想要的组件，例如：一个蓝色的主按钮…"
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
  )
}
