import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { getAllowedTags, getAllowedAttr } from '../constants/security';

const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

/**
 * 渲染 Markdown 内容为 HTML
 */
export function renderMarkdown(content: string): string {
  return markdownRenderer.render(content);
}

/**
 * 渲染并净化 Markdown 内容（防止 XSS 攻击）
 */
export function renderMarkdownAndSanitize(content: string): string {
  const rawHtml = renderMarkdown(content);
  // 使用 DOMPurify 净化 HTML，允许安全的标签和属性
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: getAllowedTags(),
    ALLOWED_ATTR: getAllowedAttr(),
    ALLOW_DATA_ATTR: true,
  });
}
