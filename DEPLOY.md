# 部署指南

本文档介绍如何将打包后的博客网站部署到各种平台。

## 部署前准备

### 1. 更新域名配置

在部署前，需要将代码中的占位符域名替换为实际域名：

1. **更新 `src/config/index.ts`**：
   ```typescript
   export const SITE_CONFIG = {
     url: 'https://your-actual-domain.com', // 替换为你的实际域名
     // ...
   };
   ```

2. **更新 `scripts/generate-sitemap.js`**：
   ```javascript
   const baseUrl = process.env.SITE_URL || 'https://your-actual-domain.com';
   ```

3. **重新构建**：
   ```bash
   npm run build
   ```

### 2. 验证构建结果

构建完成后，检查 `dist` 目录：

```bash
npm run build
npm run preview  # 本地预览构建结果
```

确保以下文件存在：
- `dist/index.html`
- `dist/assets/` (CSS 和 JS 文件)
- `dist/blog/` (所有博客的 SSG 页面)
- `dist/sitemap.xml`
- `dist/robots.txt`

## 部署方式

### 方式一：GitHub Pages

#### 步骤

1. **创建 GitHub 仓库**（如果还没有）
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **安装 GitHub Pages 部署工具**（可选）
   ```bash
   npm install --save-dev gh-pages
   ```

3. **添加部署脚本**到 `package.json`：
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
     "homepage": "https://yourusername.github.io/your-repo"
   }
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **配置 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 `gh-pages` 分支
   - 访问 `https://yourusername.github.io/your-repo`

#### 注意事项

- GitHub Pages 默认不支持 SPA 路由，需要使用 `404.html` 重定向（见下方解决方案）
- 免费版 GitHub Pages 不支持自定义域名 SSL（需要使用 Cloudflare 等）

### 方式二：Netlify

#### 步骤

1. **创建 `public/_redirects` 文件**（用于 SPA 路由）：
   ```
   /*    /index.html   200
   ```

2. **部署方式 A：拖拽部署**
   - 访问 [Netlify](https://www.netlify.com/)
   - 登录账号
   - 直接将 `dist` 目录拖拽到 Netlify 的部署区域

3. **部署方式 B：Git 集成**
   - 将代码推送到 GitHub
   - 在 Netlify 中连接 GitHub 仓库
   - 构建设置：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 环境变量（可选）：
     - `SITE_URL`: `https://your-domain.netlify.app`

4. **自定义域名**（可选）
   - 在 Netlify 的 Domain settings 中添加自定义域名
   - 按照提示配置 DNS

#### 创建 Netlify 配置文件（可选）

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  SITE_URL = "https://your-domain.netlify.app"
```

### 方式三：Vercel

#### 步骤

1. **安装 Vercel CLI**（可选）
   ```bash
   npm i -g vercel
   ```

2. **部署方式 A：命令行部署**
   ```bash
   npm run build
   vercel --prod
   ```

3. **部署方式 B：Git 集成**
   - 将代码推送到 GitHub/GitLab/Bitbucket
   - 访问 [Vercel](https://vercel.com/)
   - 导入项目
   - 构建设置：
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **配置自动部署**
   - Vercel 会自动检测 Git 推送
   - 每次推送到主分支会自动部署

#### 创建 Vercel 配置文件（可选）

创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 方式四：自己的服务器（Nginx）

#### 步骤

1. **上传文件**
   ```bash
   # 使用 scp 上传
   scp -r dist/* user@your-server:/var/www/html/
   
   # 或使用 rsync
   rsync -avz --delete dist/ user@your-server:/var/www/html/
   ```

2. **配置 Nginx**

   创建或编辑 `/etc/nginx/sites-available/your-site`：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       # SPA 路由支持
       location / {
           try_files $uri $uri/ /index.html;
       }

       # 静态资源缓存
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # 博客 SSG 页面
       location /blog/ {
           try_files $uri $uri/ /index.html;
       }

       # Gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       gzip_min_length 1000;
   }
   ```

3. **启用站点**
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **配置 SSL（Let's Encrypt）**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### 方式五：Cloudflare Pages

#### 步骤

1. **将代码推送到 Git 仓库**

2. **在 Cloudflare 中连接仓库**
   - 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
   - 连接 Git 仓库

3. **构建配置**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`（默认）

4. **环境变量**（可选）
   - `SITE_URL`: `https://your-domain.pages.dev`

5. **自定义域名**
   - 在 Pages 项目中添加自定义域名
   - 按照提示配置 DNS

### 方式六：其他静态托管服务

- **Surge.sh**: `surge dist/ your-domain.surge.sh`
- **Firebase Hosting**: 使用 Firebase CLI
- **AWS S3 + CloudFront**: 使用 AWS CLI 上传到 S3
- **阿里云 OSS**: 使用 OSS CLI 上传

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 首页显示正常
- [ ] 博客列表页面正常
- [ ] 博客详情页面正常（SSG 页面）
- [ ] 路由跳转正常（SPA 路由）
- [ ] 静态资源加载正常（CSS、JS、图片）
- [ ] SEO meta 标签正确
- [ ] sitemap.xml 可以访问
- [ ] robots.txt 可以访问
- [ ] 移动端显示正常
- [ ] HTTPS 配置正确（如果有自定义域名）

## 常见问题

### SPA 路由 404 问题

如果直接访问 `/blog/xxx` 返回 404，说明服务器没有配置 SPA 路由重定向。

**解决方案**：

1. **Netlify**: 创建 `public/_redirects` 文件
2. **Vercel**: 在 `vercel.json` 中配置 rewrites
3. **Nginx**: 配置 `try_files $uri $uri/ /index.html;`
4. **GitHub Pages**: 使用 `404.html` 重定向（见下方）

### GitHub Pages 404 问题

创建 `public/404.html`：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    const segment = 1 + window.location.pathname.split('/').length - 2;
    const path = window.location.pathname.split('/').slice(0, 1 + segment).join('/');
    sessionStorage.redirect = path;
  </script>
  <script>
    window.location.replace(sessionStorage.redirect || '/');
  </script>
</head>
<body></body>
</html>
```

### 资源路径错误

如果 CSS/JS 文件加载失败，检查：

1. 资源路径是否正确（相对路径 vs 绝对路径）
2. base 标签配置（如果有子目录部署）

### 环境变量

如果需要使用环境变量：

1. **Netlify**: 在 Site settings → Environment variables 中配置
2. **Vercel**: 在 Project settings → Environment Variables 中配置
3. **本地构建**: 使用 `.env` 文件

## 持续部署（CI/CD）

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
```

## 性能优化建议

1. **启用 CDN**：使用 Cloudflare、CloudFront 等 CDN 加速
2. **启用 Gzip/Brotli 压缩**：在服务器或 CDN 中配置
3. **缓存策略**：
   - HTML: 不缓存或短时间缓存
   - CSS/JS: 长期缓存（使用 hash 文件名）
   - 图片: 长期缓存
4. **HTTP/2 或 HTTP/3**：启用最新协议
5. **图片优化**：使用 WebP 格式，懒加载

## 监控和维护

1. **设置监控**：使用 Google Analytics、百度统计等
2. **错误监控**：使用 Sentry、LogRocket 等
3. **性能监控**：使用 Google PageSpeed Insights、WebPageTest
4. **定期更新**：更新依赖包，修复安全漏洞
5. **备份**：定期备份网站文件和数据库（如果有）

