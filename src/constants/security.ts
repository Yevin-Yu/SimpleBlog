/**
 * 安全相关常量
 * 用于 DOMPurify 等 XSS 防护工具的配置
 */

/**
 * Markdown 渲染允许的 HTML 标签
 */
export const MARKDOWN_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'del',
  's',
  'hr',
  'div',
  'span',
] as const;

/**
 * Markdown 渲染允许的 HTML 属性
 */
export const MARKDOWN_ALLOWED_ATTR = [
  'href',
  'src',
  'alt',
  'class',
  'title',
  'target',
  'rel',
  'id',
  'data-highlighted',
] as const;

/**
 * 获取允许的标签数组（非只读版本）
 */
export const getAllowedTags = (): string[] => [...MARKDOWN_ALLOWED_TAGS];

/**
 * 获取允许的属性数组（非只读版本）
 */
export const getAllowedAttr = (): string[] => [...MARKDOWN_ALLOWED_ATTR];
