import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';
import { getAllowedTags, getAllowedAttr } from '../constants/security';

/**
 * 需要过滤的警告关键词
 */
const WARNING_FILTERS = [
  'Unescaped HTML',
  'Deprecated as of',
  'highlight.js',
  'security',
  'github.com/highlightjs/highlight.js',
  'The element with unescaped HTML',
  'data-highlighted',
  'language-',
  'hljs',
  '<code class=',
] as const;

/**
 * 安全地执行函数，临时过滤特定警告
 */
const withWarningSuppressed = <T,>(fn: () => T): T => {
  const originalWarn = console.warn;

  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || '');
    const fullMessage = args.map(String).join(' ');
    const shouldSuppress = WARNING_FILTERS.some(
      (filter) => message.includes(filter) || fullMessage.includes(filter)
    );
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  try {
    return fn();
  } finally {
    console.warn = originalWarn;
  }
};

/**
 * Markdown 渲染器配置
 */
const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang?: string): string => {
    if (!lang || !hljs.getLanguage(lang)) {
      return '';
    }
    try {
      return withWarningSuppressed(() =>
        hljs.highlight(str, { language: lang }).value
      );
    } catch {
      return '';
    }
  },
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

/**
 * 高亮代码块
 */
export function highlightCodeBlocks(container: HTMLElement): void {
  withWarningSuppressed(() => {
    container.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  });
}

