import { useEffect, useState } from 'react';
import './PageLoader.css';

interface PageLoaderProps {
  onReady: () => void;
}

export function PageLoader({ onReady }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 300);
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
      <div className="page-loader-background" />
      <div className="page-loader-content">
        <p className="page-loader-text">耶温博客</p>
        <div className="page-loader-lines">
          <div className="page-loader-line" />
          <div className="page-loader-line" />
          <div className="page-loader-line" />
          <div className="page-loader-line" />
          <div className="page-loader-line" />
        </div>
      </div>
    </div>
  );
}
