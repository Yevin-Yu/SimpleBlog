# 耶温博客 (SimpleBlog)

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Stars](https://img.shields.io/github/stars/yevin-yu/SimpleBlog?style=social)

**一个轻量级、高性能的现代化个人博客解决方案**

[在线预览](#) • [快速开始](#-快速开始) • [功能特性](#-核心特性) • [文档](#-使用指南)

[English](./README_EN.md) | 简体中文

</div>

---

## 项目简介

SimpleBlog 是一个基于 **React + TypeScript + Vite** 构建的现代化静态博客系统。它专注于简洁、性能和开发体验，为你提供快速搭建个人博客的完整解决方案。

### 为什么选择 SimpleBlog?

- **极速构建** - 基于 Vite 的冷启动速度和 HMR，开发体验丝滑
- **开箱即用** - 完整的博客功能，无需复杂配置
- **SEO 优化** - 内置 SSG、Sitemap、结构化数据，搜索引擎友好
- **极致性能** - 代码分割、懒加载、优化的打包体积
- **现代化技术栈** - React 18 + TypeScript，类型安全

---

## 核心特性

### 📝 内容管理
- **Markdown 支持** - 原生 Markdown 解析，支持 Frontmatter 元数据
- **语法高亮** - 基于 Highlight.js 的代码高亮，支持 180+ 种语言
- **智能分类** - 根据文件路径自动生成层级分类树
- **标签系统** - 灵活的标签组织，支持多标签关联
- **全文搜索** - 实时搜索标题和文章简介

### 🎨 用户体验
- **水墨风格** - 独特的动态背景效果，极简主义设计
- **响应式设计** - 完美适配桌面、平板、手机
- **暗色模式** - 支持明暗主题切换（可扩展）
- **流畅动画** - 精心设计的过渡效果和交互反馈

### ⚡ 性能优化
- **静态生成 (SSG)** - 预渲染页面，首屏秒开
- **代码分割** - 路由级别的懒加载
- **资源优化** - 自动压缩、Tree-shaking
- **CDN 友好** - 纯静态文件，易于部署

### 🔍 SEO & 可访问性
- **完整 Meta 标签** - 标题、描述、Open Graph、Twitter Cards
- **结构化数据** - Schema.org 标记，富媒体搜索结果
- **自动 Sitemap** - 自动生成并更新站点地图
- **语义化 HTML** - 良好的可访问性基础

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 (或 pnpm/yarn)

### 安装

```bash
# 克隆项目
git clone https://github.com/yevin-yu/SimpleBlog.git
cd SimpleBlog

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 其他命令

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
tsc --noEmit
```

---

## 使用指南

### 目录结构

```
SimpleBlog/
├── blogs/              # 博客文章目录
│   ├── tech/           # 技术文章
│   │   └── react/      # React 相关
│   └── life/           # 生活随笔
├── src/
│   ├── components/     # React 组件
│   ├── pages/          # 页面组件
│   ├── styles/         # 样式文件
│   ├── utils/          # 工具函数
│   └── config/         # 配置文件
└── scripts/            # 构建脚本
```

### 添加文章

在 `blogs/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2024-01-01
category: 技术/前端/React
tags: [React, TypeScript, Vite]
description: 文章简介，会显示在列表页和 SEO 描述中
---

# 你的文章内容

这里是正文内容，支持完整的 Markdown 语法。

\`\`\`typescript
// 支持代码高亮
const greeting = "Hello, SimpleBlog!";
\`\`\`
```

### 自定义配置

编辑 `src/config/index.ts` 修改站点信息：

```typescript
export const SITE_CONFIG = {
  name: '你的博客名称',
  url: 'https://your-domain.com',
  author: '你的名字',
  description: '博客描述',
  // ...
};

export const BASE_PATH = '/'; // 部署路径
```

编辑 `src/styles/variables.css` 自定义主题样式：

```css
:root {
  --primary-color: #your-color;
  --background: #your-bg;
  /* ... */
}
```

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | [React 18](https://react.dev/) | UI 框架 |
| 语言 | [TypeScript 5.3](https://www.typescriptlang.org/) | 类型安全 |
| 构建 | [Vite 5](https://vitejs.dev/) | 构建工具 |
| 路由 | [React Router 6](https://reactrouter.com/) | 客户端路由 |
| Markdown | [markdown-it](https://github.com/markdown-it/markdown-it) | Markdown 解析 |
| 代码高亮 | [Highlight.js](https://highlightjs.org/) | 语法高亮 |
| SEO | [react-helmet-async](https://github.com/staylor/react-helmet-async) | Meta 标签管理 |
| 安全 | [DOMPurify](https://github.com/cure53/DOMPurify) | XSS 防护 |

---

## 许可证

[MIT](LICENSE) © Yevin-Yu

---

## 致谢

- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [React](https://react.dev/) - 用于构建用户界面的 JavaScript 库
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [Yevin-Yu](https://github.com/yevin-yu)

</div>
