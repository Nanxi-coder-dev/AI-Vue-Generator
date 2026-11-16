import { Empty } from 'antd'
import { useAppStore } from '../../store/useAppStore'

export default function PreviewPanel() {
  const currentCode = useAppStore((s) => s.currentCode)

  if (!currentCode) {
    return (
      <div className="preview-empty">
        <Empty description="暂无代码，先在左侧描述需求生成组件" />
      </div>
    )
  }

  return (
    <iframe
      title="实时预览"
      className="preview-frame"
      // TODO(Step 5)：改为通过 vue3-sfc-loader 在浏览器端编译并渲染 currentCode。
      // 目前先用占位内容展示 iframe 区域。
      srcDoc="<html><body style='margin:0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;color:#999'>实时预览将在 Step 5 集成 vue3-sfc-loader</body></html>"
    />
  )
}
