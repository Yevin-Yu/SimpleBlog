import { useEffect, useRef, useMemo } from 'react';
import 'highlight.js/styles/github.css';
import { renderMarkdown, highlightCodeBlocks } from '../../utils/markdown.utils';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown 渲染组件
 * 使用 dangerouslySetInnerHTML 渲染 HTML，并在渲染后高亮代码块
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const htmlContent = useMemo(() => renderMarkdown(content), [content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const message = String(args[0] || '');
      const fullMessage = args.map(String).join(' ');
      if (
        message.includes('Unescaped HTML') ||
        message.includes('The element with unescaped HTML') ||
        message.includes('highlight.js') ||
        message.includes('security') ||
        message.includes('github.com/highlightjs/highlight.js') ||
        fullMessage.includes('data-highlighted') ||
        fullMessage.includes('language-') ||
        fullMessage.includes('hljs') ||
        fullMessage.includes('<code class=')
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    try {
      highlightCodeBlocks(container);
    } finally {
      console.warn = originalWarn;
    }
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

