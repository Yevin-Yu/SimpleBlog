import { useEffect, useRef, useMemo } from 'react';
import 'highlight.js/styles/github.css';
import { renderMarkdownAndSanitize, highlightCodeBlocks } from '../../utils/markdown.utils';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown 渲染组件
 * 渲染并净化 Markdown 内容，然后高亮代码块
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const htmlContent = useMemo(() => renderMarkdownAndSanitize(content), [content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    highlightCodeBlocks(container);
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

