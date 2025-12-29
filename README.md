# 耶温博客

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

一个基于 React + TypeScript + Vite 构建的现代化个人博客网站

[特性](#-特性) • [快速开始](#-快速开始) • [部署](#-部署)

</div>

---

## ✨ 特性

- 📝 **Markdown 支持** - 自动解析 Frontmatter，支持代码高亮
- 🎨 **极简设计** - 水墨风格背景动画，响应式布局
- 📚 **智能分类** - 根据文件路径自动生成分类树
- 🔍 **全文搜索** - 支持标题和简介搜索
- ⚡ **快速构建** - 基于 Vite，支持 SSG 静态生成
- 🔎 **SEO 优化** - 完整的 Meta 标签、结构化数据和 Sitemap

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/yevin-yu/SimpleBlog.git
cd SimpleBlog
npm install
```

### 开发

```bash
npm run dev
# 访问 http://localhost:5173
```

### 构建

```bash
npm run build
npm run preview
```

## 📝 使用指南

### 添加新博客

在 `blogs/` 目录下创建 Markdown 文件，支持嵌套目录：

```markdown
---
title: 文章标题
date: 2024-01-01
category: 技术/前端/React
description: 文章简介
---

文章内容...
```

分类会自动根据文件路径生成，也可在 Frontmatter 中指定。

### 自定义配置

编辑 `src/config/index.ts` 修改站点信息：

```typescript
export const SITE_CONFIG = {
  name: '你的博客名称',
  url: 'https://your-domain.com',
  // ...
};

export const BASE_PATH = '/b'; // 基础路径
```

编辑 `src/styles/variables.css` 修改主题样式。

## 📦 部署

1. 更新 `src/config/index.ts` 中的域名配置
2. 运行 `npm run build`
3. 将 `dist` 目录复制到 Web 服务器

## 🛠️ 技术栈

- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.8
- React Router 6.20.0
- Markdown-it 13.0.2
- Highlight.js 11.9.0

## 📄 许可证

MIT

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by Yevin-Yu

</div>
