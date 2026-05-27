# self-vue3-demo

党员组织关系介绍信预览和导出系统 —— 一个基于 Vue 3 + Vite 的练手项目，集成 AI 聊天、文档预览、数据仪表盘等功能。

---

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | ^3.5.18 | 前端核心框架 |
| Vue Router | ^4.5.1 | 前端路由管理 |
| Vue I18n | ^10.0.4 | 国际化支持 |
| Element Plus | ^2.13.0 | UI 组件库 |
| Vite | ^4.3.0 | 构建工具 / 开发服务器 |
| docxtemplater | ^3.67.5 | Word 文档模板填充 |
| docx-preview | ^0.3.7 | Word 文档在线预览 |
| jszip / pizzip | ~3.2.0 | ZIP 压缩处理（配合 docx 操作） |
| html2canvas | ^1.4.1 | HTML 转 Canvas（用于导出图片/PDF） |
| jspdf | ^2.5.1 | PDF 生成 |
| file-saver | ^2.0.5 | 文件保存下载 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Express | ^5.2.1 | Node.js Web 服务器框架 |
| node-fetch | ^3.3.2 | HTTP 请求库（调用 DeepSeek API） |
| cors | ^2.8.6 | 跨域资源共享 |
| dotenv | ^17.4.2 | 环境变量管理 |

---

## 页面 / 功能列表

| 路由路径 | 页面名称 | 组件文件 | 说明 |
|----------|----------|----------|------|
| `/` | 首页 | [HomeView.vue](src/views/pages/HomeView.vue) | 系统入口主页 |
| `/letter` | 介绍信 | [LetterView.vue](src/views/pages/LetterView.vue) | 党员组织关系介绍信核心功能页 |
| `/settings` | 设置 | [settings.vue](src/views/pages/settings.vue) | 系统配置页面 |
| `/copy-test` | 复制 | [CopyTestView.vue](src/views/pages/CopyTestView.vue) | 复制功能测试页 |
| `/ai-chat` | AI 聊天 | [AiChatView.vue](src/views/ai-pages/AiChatView.vue) | 集成 DeepSeek AI 对话功能 |
| `/doc-preview` | 文档预览 | [DocPreviewView.vue](src/views/pages/DocPreviewView.vue) | Word 文档在线预览功能 |
| `/gauge` | 仪表盘 | [ybp.vue](src/views/pages/ybp.vue) | 数据仪表盘/可视化页面 |

---

## 项目特点

1. **前后端分离架构**
   - 前端使用 Vue 3 + Vite 构建现代 SPA
   - 后端使用 Express 提供 AI 代理服务，保护 API Key 不暴露给前端

2. **AI 聊天集成**
   - 后端代理 DeepSeek API
   - 支持普通问答接口和流式 SSE 接口，可实现打字机效果

3. **文档处理能力丰富**
   - 支持 Word 模板填充（`docxtemplater`）
   - 支持 Word 文档在线预览（`docx-preview`）
   - 支持 HTML 转 PDF 导出（`html2canvas` + `jspdf`）

4. **国际化支持**
   - 已集成 `vue-i18n`，具备多语言扩展能力

5. **UI 设计**
   - 使用 Element Plus 组件库
   - 整体采用渐变背景 + 卡片式布局，风格简洁现代

---

## 项目启动

### 环境要求
- Node.js 16+（推荐 18+）

### 安装依赖
```bash
npm install
cd ai-server && npm install
```

### 启动命令

| 命令 | 作用 | 说明 |
|------|------|------|
| `npm run dev` | 同时启动前端 + AI 后端 | 使用 `concurrently` 并行运行前后端服务 |
| `npm run dev:client` | 仅启动前端 | 运行 Vite 开发服务器 |
| `npm run build` | 生产构建 | 使用 Vite 打包前端代码 |
| `npm run preview` | 预览构建产物 | 在本地预览生产构建后的效果 |

### 后端独立启动
如需单独启动 AI 代理服务：
```bash
cd ai-server
node index.js
```
后端默认监听端口为 `3005`。

### 环境变量
AI 服务依赖 `ai-server/.env` 文件配置：
- `API_KEY`：DeepSeek API 密钥
- `PORT`：（可选）后端服务端口

---

## 项目结构

```
├── package.json                  # 前端项目配置
├── src/
│   ├── App.vue                   # 应用根组件
│   ├── router/
│   │   └── index.js              # Vue Router 路由配置
│   ├── components/
│   │   └── NavigationMenu.vue    # 顶部导航菜单
│   └── views/
│       ├── ai-pages/
│       │   └── AiChatView.vue    # AI 聊天页面
│       └── pages/
│           ├── HomeView.vue      # 首页
│           ├── LetterView.vue    # 介绍信核心页
│           ├── settings.vue      # 设置页
│           ├── CopyTestView.vue  # 复制测试页
│           ├── DocPreviewView.vue# 文档预览页
│           └── ybp.vue           # 仪表盘页
└── ai-server/
    ├── package.json              # 后端项目配置
    └── index.js                  # Express AI 代理服务入口
```
