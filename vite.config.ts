import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: '耶温博客',
        short_name: '耶温博客',
        description: '一个简约的个人博客网站，分享技术思考、生活感悟和知识总结',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['education', 'technology', 'blog'],
        lang: 'zh-CN',
        dir: 'ltr',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,xml,txt}'],
        runtimeCaching: [
          {
            urlPattern: /^\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'runtime-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 3600 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 设置 chunk 大小警告限制（KB）
    chunkSizeWarningLimit: 500,
    // 代码分割优化
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Markdown 相关
          'markdown-vendor': ['markdown-it', 'dompurify', 'shiki'],
          // 其他第三方库
          vendor: ['react-helmet-async'],
        },
      },
    },
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // CSS 代码分割
    cssCodeSplit: true,
    // 设置构建目标
    target: 'es2015',
    // 启用源码映射（生产环境建议关闭，这里设为 false）
    sourcemap: false,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  publicDir: 'public',
});
