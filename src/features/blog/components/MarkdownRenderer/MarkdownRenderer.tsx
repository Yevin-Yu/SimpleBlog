import { useEffect, useRef, useMemo } from 'react';
import { renderMarkdownAndSanitize, highlightCodeBlocks } from '../../utils/markdown.utils';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const htmlContent = useMemo(() => renderMarkdownAndSanitize(content), [content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const abortController = new AbortController();
    const signal = abortController.signal;

    (async () => {
      try {
        await highlightCodeBlocks(container);
      } catch (error) {
        if (!signal.aborted) {
          console.error('Error highlighting code blocks:', error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
