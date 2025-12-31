import { useState, useEffect, useRef } from 'react';

const SIDEBAR_THRESHOLD = 1024;

interface UseResponsiveLayoutReturn {
  hasEnoughSpace: boolean;
  isInitialized: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * 响应式布局 Hook
 * 根据容器宽度判断是否有足够空间显示侧边栏
 */
export function useResponsiveLayout(): UseResponsiveLayoutReturn {
  const initialHasEnoughSpace = 
    typeof window !== 'undefined' 
      ? window.innerWidth >= SIDEBAR_THRESHOLD 
      : false;

  const [hasEnoughSpace, setHasEnoughSpace] = useState(initialHasEnoughSpace);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasEnoughSpaceRef = useRef(initialHasEnoughSpace);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSpaceStatus = () => {
      const width = container.offsetWidth;
      const enoughSpace = width >= SIDEBAR_THRESHOLD;
      
      hasEnoughSpaceRef.current = enoughSpace;
      setHasEnoughSpace(enoughSpace);
      setIsInitialized(true);
    };

    updateSpaceStatus();

    const resizeObserver = new ResizeObserver(updateSpaceStatus);
    resizeObserver.observe(container);

    window.addEventListener('resize', updateSpaceStatus);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSpaceStatus);
    };
  }, []);

  return {
    hasEnoughSpace,
    isInitialized,
    containerRef,
  };
}

