import { useMemo, memo, useState, useEffect } from 'react';
import { extractTOC, type TOCItem } from '../../utils/markdown.utils';
import { logger } from '../../utils/logger';
import './BlogTOCDrawer.css';

interface BlogTOCDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  isSmallScreen: boolean;
}

interface TOCItemProps {
  item: TOCItem;
  onHeadingClick: () => void;
}

function TOCItemComponent({ item, onHeadingClick }: TOCItemProps) {
  const handleClick = () => {
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onHeadingClick();
    }
  };

  return (
    <div className={`blog-toc-item blog-toc-level-${item.level}`}>
      <button className="blog-toc-item-button" onClick={handleClick}>
        <span className="blog-toc-item-text">{item.text}</span>
      </button>
      {item.children && (
        <div className="blog-toc-children">
          {item.children.map((child) => (
            <MemoizedTOCItem key={child.id} item={child} onHeadingClick={onHeadingClick} />
          ))}
        </div>
      )}
    </div>
  );
}

const MemoizedTOCItem = memo(TOCItemComponent);

export function BlogTOCDrawer({ isOpen, onClose, content, isSmallScreen }: BlogTOCDrawerProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const toc = useMemo(() => {
    if (content) {
      try {
        return extractTOC(content);
      } catch (error) {
        logger.error('提取目录失败', error);
      }
    }
    return [];
  }, [content]);

  const handleHeadingClick = () => {
    if (isSmallScreen) {
      onClose();
    }
  };

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={`blog-toc-drawer-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}>
      <div className="blog-toc-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="blog-toc-drawer-header">
          <h3 className="blog-toc-drawer-title">目录</h3>
          <button className="blog-toc-drawer-close" onClick={onClose} aria-label="关闭目录">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="blog-toc-drawer-content">
          {toc.length > 0 ? (
            <div className="blog-toc-list">
              {toc.map((item) => (
                <MemoizedTOCItem key={item.id} item={item} onHeadingClick={handleHeadingClick} />
              ))}
            </div>
          ) : (
            <div className="blog-toc-empty">暂无目录</div>
          )}
        </div>
      </div>
    </div>
  );
}
