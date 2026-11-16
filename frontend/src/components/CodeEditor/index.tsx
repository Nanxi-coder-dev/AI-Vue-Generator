import Editor from '@monaco-editor/react'
import { useAppStore } from '../../store/useAppStore'

export default function CodeEditor() {
  const currentCode = useAppStore((s) => s.currentCode)

  return (
    <Editor
      height="100%"
      // Monaco 没有内置 Vue 语言，Vue SFC 与 HTML 结构最接近
      language="html"
      theme="vs-dark"
      value={currentCode}
      options={{
        readOnly: true, // 只读：代码由 AI 生成，用户不直接编辑
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true, // 容器尺寸变化时自动重排
      }}
    />
  )
}
