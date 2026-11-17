# 🎨 对话式 Vue 组件智能生成工具

基于大语言模型（LLM）的 AI 辅助前端开发工具。用户通过自然语言描述 UI 需求，系统匹配预定义的组件规范（Schema）约束大模型，生成符合 Vue3 规范的代码，并渲染到前端的 Monaco Editor 中。

> 📌 **当前进度**：前后端基础通信已跑通，大模型可生成代码并渲染到前端编辑区。

## ✨ 核心功能

- 💬 **对话式交互**：通过自然语言描述组件需求，支持多轮对话迭代调整
- 🧩 **组件规范约束**：预定义组件 Schema（Props / Events / Slots）约束大模型输出
- 🤖 **智能代码生成**：调用通义千问（DashScope）生成符合 Vue3 规范的组件代码
- 📝 **代码实时渲染**：生成代码自动渲染到前端代码编辑区
- 🎛️ **属性面板**：根据匹配到的 Schema 动态渲染属性表单控件
- 🔄 **响应式状态管理**：Zustand 统一管理对话历史、当前代码与加载状态

## 🛠️ 技术栈

| 层次 | 技术选型 |
| --- | --- |
| 前端 | React 18 · TypeScript · Vite · Ant Design 5 · Monaco Editor · Axios |
| 状态管理 | Zustand |
| 后端 | Node.js · Express · TypeScript（BFF 架构） |
| 大模型 | 阿里云通义千问 DashScope API（`deepseek-v4-pro` 模型） |

> ⚠️ **说明**：当前使用的 `deepseek-v4-pro` 为推理模型，代码产出速度较慢（单次生成约 1~2 分钟）。后续接入 SSE 流式响应后可显著改善等待体验。

## 📂 目录结构

```
ai-vue-generator/
├── frontend/                    # 前端工程（React + Vite）
│   ├── src/
│   │   ├── api/                 # Axios 封装与请求接口
│   │   ├── components/          # 通用组件（ChatPanel / CodeEditor / PreviewPanel / PropertyPanel）
│   │   ├── layouts/             # 布局组件（Header + Sider + Content）
│   │   ├── pages/               # 路由页面（Home / History）
│   │   ├── store/               # Zustand 状态管理
│   │   ├── types/               # TypeScript 类型定义
│   │   ├── utils/               # 工具函数
│   │   ├── App.tsx              # 路由配置
│   │   └── main.tsx             # 应用入口
│   ├── vite.config.js           # Vite 配置（含 /api 代理）
│   └── package.json
│
└── backend/                     # 后端工程（Express BFF）
    ├── routes/                  # 路由（generate.js）
    ├── services/                # 核心业务（qwenApi.js / schemaService.js）
    ├── data/                    # 组件 Schema 规范（schemas.json）
    ├── server.js                # Express 服务入口
    └── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm

### 1. 配置后端环境变量

在 `backend/` 目录下创建 `.env` 文件，配置阿里云 DashScope API Key：

```bash
QWEN_API_KEY=你的_DashScope_API_Key
```

> 可选：如需覆盖默认模型，可添加 `MODEL_NAME=xxx`。

### 2. 启动后端

```bash
cd backend
npm install
npm start          # 或 npm run dev（文件变更自动重启）
```

后端默认运行于 **http://localhost:3000**，健康检查：`GET /health`。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端默认运行于 **http://localhost:5173**，并已配置 `/api` 代理转发到后端 3000 端口。

### 4. 体验

打开浏览器访问 http://localhost:5173，在左侧对话面板输入如「生成一个按钮」，点击发送，即可在右侧看到大模型生成的 Vue3 组件代码。

## 🗺️ 开发进度

- [x] 前端基础骨架（三栏布局 + Zustand + 路由）
- [x] 后端 Express 分层架构（routes / services / data）
- [x] 前后端通信打通（`POST /api/generate`）
- [x] 基础 Schema 匹配（关键词匹配，已内置 Button / Input / Table 示例）
- [x] 大模型代码生成并渲染到前端
- [ ] Schema 语义化匹配（由关键词匹配升级为向量 / 语义匹配）
- [ ] ESLint 静态校验闭环（校验失败回传大模型二次修复）
- [ ] SSE 流式响应（边生成边展示）
- [ ] 实时预览（iframe + vue3-sfc-loader 编译渲染）
- [ ] 属性面板联动（修改属性触发重新生成）
- [ ] SQLite 数据库接入（存储 Schema 模板与历史记录）
- [ ] 历史记录页面

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。
