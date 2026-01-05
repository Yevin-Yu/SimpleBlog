import MarkdownIt from 'markdown-it';
import { createHighlighter, type Highlighter } from 'shiki';
import DOMPurify from 'dompurify';
import { getAllowedTags, getAllowedAttr } from '../constants/security';

let highlighterInstance: Highlighter | null = null;

export async function initHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['github-light-default'],
      langs: [
        'bash',
        'sh',
        'javascript',
        'typescript',
        'json',
        'html',
        'css',
        'python',
        'java',
        'go',
        'rust',
        'markdown',
        'yaml',
        'toml',
      ],
    });
  }
  return highlighterInstance;
}

const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export function renderMarkdown(content: string): string {
  return markdownRenderer.render(content);
}

export function renderMarkdownAndSanitize(content: string): string {
  const rawHtml = renderMarkdown(content);
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [...getAllowedTags(), 'style'],
    ALLOWED_ATTR: [...getAllowedAttr(), 'tabindex'],
    ALLOW_DATA_ATTR: true,
  });
}

export async function highlightCodeBlocks(container: HTMLElement): Promise<void> {
  const highlighter = await initHighlighter();
  const codeElements = Array.from(container.querySelectorAll('pre > code'));

  for (const codeElement of codeElements) {
    if (codeElement.closest('.shiki')) {
      continue;
    }

    const code = codeElement.textContent || '';
    const langClass = Array.from(codeElement.classList).find((cls) => cls.startsWith('language-'));
    const lang = langClass ? langClass.replace('language-', '') : 'plaintext';

    try {
      const html = highlighter.codeToHtml(code, {
        lang: lang as string,
        theme: 'github-light-default',
      });

      const preElement = codeElement.parentElement as HTMLElement;
      if (!preElement) continue;

      const temp = document.createElement('div');
      temp.innerHTML = html;
      const highlightedPre = temp.firstChild as HTMLElement;

      if (highlightedPre) {
        highlightedPre.style.removeProperty('background-color');
        if (langClass) {
          highlightedPre.classList.add(langClass);
        }
        preElement.replaceWith(highlightedPre);
      }
    } catch (error) {
      console.error('Error highlighting code block:', error);
    }
  }
}
