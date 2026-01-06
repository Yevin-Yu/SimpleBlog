/**
 * Root - 应用根容器
 * 管理初始化状态和加载动画过渡
 */

import { useState, useEffect } from 'react';
import { App } from './App';
import { PageLoader } from './components/ui/PageLoader/PageLoader';

export function Root() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      document.getElementById('root')?.classList.add('app-ready');
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.classList.add('fade-out');
        setTimeout(() => initialLoader.remove(), 500);
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
