import {
  ColorPicker,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tag,
  Typography,
} from 'antd'
import { useAppStore } from '../../store/useAppStore'
import type { SchemaProp } from '../../types'

/** 根据 Schema 中 prop 的 type 渲染对应控件 */
function renderControl(prop: SchemaProp) {
  switch (prop.type) {
    case 'select':
      return (
        <Select
          defaultValue={prop.default as string | number}
          options={prop.options}
          style={{ width: '100%' }}
        />
      )
    case 'boolean':
      return <Switch defaultChecked={Boolean(prop.default)} />
    case 'number':
      return <InputNumber defaultValue={prop.default as number} style={{ width: '100%' }} />
    case 'color':
      return <ColorPicker defaultValue={prop.default as string} />
    default:
      return <Input defaultValue={String(prop.default ?? '')} />
  }
}

export default function PropertyPanel() {
  const currentSchema = useAppStore((s) => s.currentSchema)

  if (!currentSchema) {
    return (
      <div className="property-panel">
        <Empty description="暂无匹配的组件规范" />
      </div>
    )
  }

  return (
    <div className="property-panel">
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {currentSchema.name} 属性
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
        {currentSchema.description}
      </Typography.Paragraph>

      <Divider style={{ margin: '12px 0' }} />

      {/* 属性（Props）：根据 Schema 动态渲染表单控件 */}
      <Form layout="vertical" size="small">
        {currentSchema.props.map((prop) => (
          <Form.Item key={prop.name} label={prop.label}>
            {renderControl(prop)}
          </Form.Item>
        ))}
      </Form>

      <Divider style={{ margin: '12px 0' }} />

      {/* 事件（Events） */}
      <div>
        <Typography.Text type="secondary">事件：</Typography.Text>
        {currentSchema.events.map((event) => (
          <Tag key={event.name}>{event.label}</Tag>
        ))}
      </div>

      {/* 插槽（Slots） */}
      <div style={{ marginTop: 8 }}>
        <Typography.Text type="secondary">插槽：</Typography.Text>
        {currentSchema.slots.map((slot) => (
          <Tag key={slot.name}>{slot.label}</Tag>
        ))}
      </div>

      {/* TODO(Step 5)：属性修改后触发重新生成 / 局部更新 */}
    </div>
  )
}
