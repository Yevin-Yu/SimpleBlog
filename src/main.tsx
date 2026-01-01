import { StrictMode, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { PageLoader } from './components/PageLoader/PageLoader';
import './index.css';

function Root() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // 当应用准备就绪时
    if (isAppReady) {
      // 添加 app-ready 类，让根元素淡入
      document.getElementById('root')?.classList.add('app-ready');

      // 移除 HTML 中的初始加载遮罩
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.classList.add('fade-out');
        // 等待淡出动画完成后从 DOM 中移除
        setTimeout(() => {
          initialLoader.remove();
        }, 500);
      }
    }
  }, [isAppReady]);

  return (
    <>
      {!isAppReady && <PageLoader onReady={() => setIsAppReady(true)} />}
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Root />
    </HelmetProvider>
  </StrictMode>
);
