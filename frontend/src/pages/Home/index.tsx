import { useState } from 'react'
import { Button, Tabs } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import CodeEditor from '../../components/CodeEditor'
import PreviewPanel from '../../components/PreviewPanel'
import PropertyPanel from '../../components/PropertyPanel'

export default function Home() {
  // 属性面板的展开 / 收起状态
  const [showProps, setShowProps] = useState(true)

  const tabItems = [
    { key: 'editor', label: '💻 代码编辑器', children: <CodeEditor /> },
    { key: 'preview', label: '👁️ 实时预览', children: <PreviewPanel /> },
  ]

  return (
    <div className="workspace">
      {/* 主区域：代码编辑器 / 实时预览 的 Tab 切换 */}
      <div className="workspace-main">
        <Tabs
          className="workspace-tabs"
          items={tabItems}
          tabBarExtraContent={
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => setShowProps((v) => !v)}
            >
              {showProps ? '收起属性' : '属性面板'}
            </Button>
          }
        />
      </div>

      {/* 右侧属性面板：根据 Schema 动态渲染，可折叠 */}
      {showProps && (
        <div className="workspace-side">
          <PropertyPanel />
        </div>
      )}
    </div>
  )
}
