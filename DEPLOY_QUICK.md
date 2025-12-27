# 快速部署指南

## 一键部署到不同平台

### 🚀 Netlify（最简单）

1. **构建项目**
   ```bash
   npm run build
   ```

2. **拖拽部署**
   - 访问 https://www.netlify.com/
   - 登录后，直接将 `dist` 文件夹拖拽到部署区域
   - 完成！

3. **配置自定义域名**（可选）
   - 在 Netlify 控制台 → Domain settings
   - 添加自定义域名，按提示配置 DNS

---

### ⚡ Vercel（推荐）

1. **安装 CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署**
   ```bash
   npm run build
   vercel --prod
   ```

3. **或使用 Git 集成**
   - 推送代码到 GitHub
   - 访问 https://vercel.com/，导入项目
   - 自动部署完成

---

### 📦 GitHub Pages

1. **安装依赖**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **添加脚本**（在 `package.json` 中）
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/your-repo"
   }
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

4. **配置 Pages**
   - 仓库 Settings → Pages
   - Source 选择 `gh-pages` 分支

---

### 🖥️ 自己的服务器（Nginx）

1. **上传文件**
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

2. **配置 Nginx**（`/etc/nginx/sites-available/your-site`）
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

3. **启用配置**
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **配置 SSL**（Let's Encrypt）
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## 部署前必须做的

### ✅ 更新域名配置

1. **修改 `src/config/index.ts`**
   ```typescript
   export const SITE_CONFIG = {
     url: 'https://your-actual-domain.com', // 替换这里
     // ...
   };
   ```

2. **重新构建**
   ```bash
   npm run build
   ```

---

## 部署检查清单

- [ ] 更新了域名配置
- [ ] 运行 `npm run build` 成功
- [ ] 运行 `npm run preview` 本地预览正常
- [ ] 上传了 `dist` 目录的所有文件
- [ ] 网站可以正常访问
- [ ] 首页正常显示
- [ ] 博客列表页正常
- [ ] 博客详情页正常（SSG 页面）
- [ ] 路由跳转正常
- [ ] sitemap.xml 可以访问
- [ ] 移动端显示正常

---

## 常见问题

### ❓ SPA 路由返回 404

**解决方案**：
- **Netlify**: 已创建 `public/_redirects` 文件（会自动复制到 dist）
- **Vercel**: 已创建 `vercel.json` 配置文件
- **Nginx**: 配置 `try_files $uri $uri/ /index.html;`

### ❓ 资源文件加载失败

检查资源路径是否正确。博客页面的资源使用相对路径 `../../assets/`，应该没问题。

### ❓ 需要更新域名

1. 修改 `src/config/index.ts` 中的 `SITE_CONFIG.url`
2. 重新运行 `npm run build`
3. 重新部署

---

## 详细文档

更多详细信息请查看 [DEPLOY.md](./DEPLOY.md)

