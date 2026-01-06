/**
 * 应用入口
 * - 初始化 React 根节点
 * - 提供 HelmetProvider（SEO）
 * - 生产环境注册 Service Worker
 */

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Root } from './Root';
import './index.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => console.log('Service Worker 注册成功:', registration.scope),
      (error) => console.error('Service Worker 注册失败:', error)
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Root />
    </HelmetProvider>
  </StrictMode>
);
