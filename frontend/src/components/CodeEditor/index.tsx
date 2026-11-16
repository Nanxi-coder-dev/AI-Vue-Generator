import { useAppStore } from '../../store/useAppStore'

/**
 * 代码展示区（当前为可靠的可视化实现）。
 *
 * 说明：原设计使用 Monaco 编辑器，但它默认从 CDN 加载资源，
 * 网络不通或 CDN 被墙时会白屏，导致看不到代码。
 * 因此这里先改用 <pre> 代码块直接渲染 store 里的 currentCode，
 * 保证「生成代码 -> 编辑器显示代码」这条链路视觉上一定有效果。
 * 后续需要真正的代码编辑能力时，再接入本地打包的 Monaco。
 */
export default function CodeEditor() {
  const currentCode = useAppStore((s) => s.currentCode)

  if (!currentCode) {
    return <div className="code-viewer-empty">暂无代码，请在左侧输入需求生成组件</div>
  }

  return (
    <div className="code-viewer">
      <pre className="code-viewer-pre">{currentCode}</pre>
    </div>
  )
}
