# 耶温博客

一个基于 React + TypeScript + Vite 构建的现代化个人博客网站，采用极简设计风格，支持 Markdown 编写和自动分类管理。

## ✨ 特性

- 📝 **Markdown 支持** - 使用 Markdown 编写博客，自动解析 Frontmatter
- 🎨 **极简设计** - 水墨风格背景动画，简洁优雅的界面
- 📚 **智能分类** - 自动根据文件路径生成分类树结构
- 🔍 **全文搜索** - 支持标题和简介搜索
- 💻 **代码高亮** - 使用 Highlight.js 提供代码高亮支持
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **快速构建** - 基于 Vite 的极速开发体验
- 🔎 **SEO 优化** - 完整的 Meta 标签、结构化数据和 Sitemap

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Markdown-it** - Markdown 解析
- **Highlight.js** - 代码高亮
- **React Helmet Async** - SEO 管理

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录，可以直接部署到静态服务器。

### 预览构建结果

```bash
npm run preview
```

## 📁 项目结构

```
.
├── src/
│   ├── components/          # 组件
│   │   ├── BlogTreeContent/ # 文章内容组件
│   │   ├── BlogTreeSidebar/ # 文章列表侧边栏
│   │   ├── BlogSearchModal/ # 搜索弹窗
│   │   ├── InkBackground/   # 水墨背景动画
│   │   ├── LoadingLines/    # 加载动画
│   │   ├── MarkdownRenderer/# Markdown 渲染器
│   │   ├── SEO/             # SEO 组件
│   │   └── Footer/          # 页脚组件
│   ├── pages/               # 页面
│   │   ├── Home.tsx         # 首页
│   │   └── BlogTree.tsx     # 博客列表/详情页
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useBlogTree.ts   # 博客树逻辑
│   │   └── useSiteUrl.ts    # 站点 URL
│   ├── utils/               # 工具函数
│   │   ├── blog.service.ts  # 博客数据服务
│   │   ├── blog.utils.ts    # 博客工具函数
│   │   ├── dom.utils.ts     # DOM 工具函数
│   │   ├── frontmatter.ts   # Frontmatter 解析
│   │   ├── markdown.utils.ts# Markdown 处理
│   │   ├── ripple.config.ts # 涟漪效果配置
│   │   └── logger.ts        # 日志工具
│   ├── config/              # 配置文件
│   ├── constants/           # 常量定义
│   ├── types/               # 类型定义
│   ├── styles/             # 样式变量
│   ├── App.tsx             # 主应用
│   └── main.tsx            # 入口文件
├── blogs/                  # Markdown 博客文件目录
├── scripts/                # 构建脚本
│   ├── generate-sitemap.js # 生成网站地图
│   ├── generate-ssg-pages.js# 生成静态页面
│   └── utils/              # 脚本工具
├── public/                 # 静态资源
└── dist/                   # 构建输出目录
```

## 📝 添加新博客

1. 在 `blogs/` 目录下创建 Markdown 文件，支持嵌套目录结构
2. 在文件开头添加 Frontmatter：

```markdown
---
title: 文章标题
date: 2024-01-01
category: 技术/前端/React
description: 文章简介
id: unique-id
---

文章内容...
```

3. 分类会自动根据文件路径生成，也可以在 Frontmatter 中指定
4. 如果没有指定 `id`，系统会自动生成唯一 ID

## 🎨 自定义配置

### 修改站点信息

编辑 `src/config/index.ts`：

```typescript
export const SITE_CONFIG = {
  name: '你的博客名称',
  description: '博客描述',
  url: 'https://your-domain.com',
  locale: 'zh_CN',
};
```

### 修改主题样式

编辑 `src/styles/variables.css` 中的 CSS 变量：

```css
:root {
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --color-bg-page: #fafafa;
  /* ... */
}
```

### 修改背景动画

编辑 `src/utils/ripple.config.ts` 中的配置参数。

## 📦 部署

### 部署前准备

1. **更新域名配置**
   - 修改 `src/config/index.ts` 中的 `SITE_CONFIG.url`
   - 重新运行 `npm run build`

2. **验证构建结果**
   ```bash
   npm run build
   npm run preview
   ```

### 部署方式

#### Netlify（推荐）

1. 运行 `npm run build`
2. 访问 [Netlify](https://www.netlify.com/)，将 `dist` 目录拖拽到部署区域
3. 配置自定义域名（可选）

已包含 `netlify.toml` 配置文件，支持 Git 集成自动部署。

#### Vercel

```bash
npm i -g vercel
npm run build
vercel --prod
```

或通过 Git 集成自动部署。已包含 `vercel.json` 配置文件。

#### GitHub Pages

1. 安装依赖：`npm install --save-dev gh-pages`
2. 在 `package.json` 中添加：
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/your-repo"
   }
   ```
3. 运行 `npm run deploy`

#### 自己的服务器（Nginx）

1. 上传文件：
   ```bash
   scp -r dist/* user@server:/var/www/html/
   ```

2. 配置 Nginx：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. 配置 SSL（Let's Encrypt）：
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 🔍 SEO 优化

项目已实现完整的 SEO 优化：

- ✅ Meta 标签优化（Title, Description, Keywords）
- ✅ Open Graph 和 Twitter Card 标签
- ✅ 结构化数据（Schema.org JSON-LD）
- ✅ 自动生成 sitemap.xml
- ✅ robots.txt 配置
- ✅ 语义化 HTML
- ✅ 移动端优化

部署后，在 Google Search Console 提交 sitemap: `https://your-domain.com/sitemap.xml`

## 📄 License

MIT
