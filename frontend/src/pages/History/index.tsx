import { Empty, Typography } from 'antd'

export default function History() {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>历史记录</Typography.Title>
      <Empty description="历史生成记录将在后续接入 SQLite 后展示" />
    </div>
  )
}
