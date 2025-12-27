import { useEffect, useRef } from 'react';
import 'highlight.js/styles/github.css';
import { renderMarkdown, highlightCodeBlocks } from '../../utils/markdown.utils';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const html = renderMarkdown(content);
    container.innerHTML = html;
    highlightCodeBlocks(container);
  }, [content]);

  return <div ref={containerRef} className="markdown-content" />;
}

