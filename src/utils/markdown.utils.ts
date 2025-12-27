import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const originalConsoleWarn = console.warn;
let isSuppressingWarnings = false;

const suppressHighlightWarnings = (): void => {
  if (isSuppressingWarnings) return;
  isSuppressingWarnings = true;
  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || '');
    if (
      message.includes('Unescaped HTML') ||
      message.includes('Deprecated as of') ||
      (message.includes('highlight.js') && message.includes('warning'))
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
};

const restoreConsoleWarn = (): void => {
  if (!isSuppressingWarnings) return;
  isSuppressingWarnings = false;
  console.warn = originalConsoleWarn;
};

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

export function renderMarkdown(content: string): string {
  return markdownRenderer.render(content);
}

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

