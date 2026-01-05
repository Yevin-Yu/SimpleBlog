import { useMemo } from 'react';
import { renderMarkdownAndSanitize } from '../../utils/markdown.utils';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => renderMarkdownAndSanitize(content), [content]);

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
