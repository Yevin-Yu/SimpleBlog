import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

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

const originalConsoleWarn = console.warn;
let isSuppressingWarnings = false;

/**
 * 过滤 highlight.js 相关警告
 */
const suppressHighlightWarnings = (): void => {
  if (isSuppressingWarnings) return;
  isSuppressingWarnings = true;
  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || '');
    const fullMessage = args.map(String).join(' ');
    const shouldSuppress = WARNING_FILTERS.some(
      (filter) => message.includes(filter) || fullMessage.includes(filter)
    );
    if (!shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };
};

/**
 * 恢复原始 console.warn
 */
const restoreConsoleWarn = (): void => {
  if (!isSuppressingWarnings) return;
  isSuppressingWarnings = false;
  console.warn = originalConsoleWarn;
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
      suppressHighlightWarnings();
      const result = hljs.highlight(str, { language: lang }).value;
      restoreConsoleWarn();
      return result;
    } catch {
      restoreConsoleWarn();
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
 * 高亮代码块
 */
export function highlightCodeBlocks(container: HTMLElement): void {
  suppressHighlightWarnings();
  try {
    container.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  } finally {
    restoreConsoleWarn();
  }
}

