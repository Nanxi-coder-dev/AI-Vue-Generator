import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import History from './pages/History'

function App() {
  return (
    <Routes>
      {/* 父路由：AppLayout 提供 Header + 左侧 Chat + 右侧内容区外壳 */}
      <Route path="/" element={<AppLayout />}>
        {/* index 子路由：访问 "/" 时默认渲染 Home */}
        <Route index element={<Home />} />
        {/* 历史记录页 */}
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  )
}

export default App
