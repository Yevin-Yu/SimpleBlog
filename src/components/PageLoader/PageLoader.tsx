import { useEffect, useState } from 'react';
import './PageLoader.css';

interface PageLoaderProps {
  onReady: () => void;
}

/**
 * 页面加载过渡动画组件
 * 使用简洁的线条动画，与文章切换加载动画一致
 */
export function PageLoader({ onReady }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 等待一小段时间后开始淡出动画
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 300);

    // 等待淡出动画完成后完全移除
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onReady();
    }, 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onReady]);

  if (!isVisible) return null;

  return (
    <div className={`page-loader ${isFadingOut ? 'page-loader-fade-out' : ''}`}>
      <div className="page-loader-background"></div>
      <div className="page-loader-content">
        <p className="page-loader-text">耶温博客</p>
        <div className="page-loader-lines">
          <div className="page-loader-line"></div>
          <div className="page-loader-line"></div>
          <div className="page-loader-line"></div>
          <div className="page-loader-line"></div>
          <div className="page-loader-line"></div>
        </div>
      </div>
    </div>
  );
}
