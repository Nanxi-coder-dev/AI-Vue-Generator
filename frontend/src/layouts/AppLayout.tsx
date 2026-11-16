import { Avatar, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { CodeOutlined, GithubOutlined, UserOutlined } from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import ChatPanel from '../components/ChatPanel'

const { Header, Sider, Content } = Layout

const MENU_ITEMS: MenuProps['items'] = [
  { key: 'home', label: '工作台' },
  { key: 'history', label: '历史记录' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路径高亮对应菜单
  const selectedKey = location.pathname === '/history' ? 'history' : 'home'

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 顶部 Header：深色主题 */}
      <Header className="app-header">
        <div className="header-brand">
          <CodeOutlined className="header-logo" />
          <span className="header-title">AI 前端代码生成系统</span>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key === 'history' ? '/history' : '/')}
          style={{ flex: 1, minWidth: 0, background: 'transparent' }}
        />

        <div className="header-right">
          <a
            className="header-github"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
          >
            <GithubOutlined />
          </a>
          <Avatar size="small" icon={<UserOutlined />} />
        </div>
      </Header>

      {/* 主体：左侧 Sider + 右侧 Content（hasSider 保证横向排列） */}
      <Layout hasSider>
        {/* 左侧栏：占宽 25%，放置对话面板 */}
        <Sider width="25%" theme="light" className="app-sider">
          <ChatPanel />
        </Sider>

        {/* 右侧主工作区：占宽 75%，由子路由页面填充 */}
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
