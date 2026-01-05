import MarkdownIt from 'markdown-it';
import { createHighlighter, type Highlighter } from 'shiki';
import DOMPurify from 'dompurify';
import { getAllowedTags, getAllowedAttr } from '../constants/security';

let highlighterInstance: Highlighter | null = null;

const SUPPORTED_LANGUAGES = [
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
  'ini',
  'xml',
  'sql',
  'vim',
  'docker',
] as const;

const THEME = 'github-light-default';

export async function initHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: [THEME],
      langs: [...SUPPORTED_LANGUAGES],
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

const isAlreadyHighlighted = (element: HTMLElement): boolean => {
  return element.closest('.shiki') !== null;
};

const extractLanguage = (element: HTMLElement): string => {
  const langClass = Array.from(element.classList).find((cls) => cls.startsWith('language-'));
  return langClass ? langClass.replace('language-', '') : 'plaintext';
};

const highlightCodeElement = async (
  codeElement: HTMLElement,
  highlighter: Highlighter
): Promise<void> => {
  const code = codeElement.textContent || '';
  const lang = extractLanguage(codeElement);

  try {
    const html = highlighter.codeToHtml(code, {
      lang,
      theme: THEME,
    });

    const preElement = codeElement.parentElement as HTMLElement;
    if (!preElement) return;

    const temp = document.createElement('div');
    temp.innerHTML = html;
    const highlightedPre = temp.firstChild as HTMLElement;

    if (highlightedPre) {
      highlightedPre.style.removeProperty('background-color');

      const langClass = Array.from(codeElement.classList).find((cls) =>
        cls.startsWith('language-')
      );
      if (langClass) {
        highlightedPre.classList.add(langClass);
      }

      preElement.replaceWith(highlightedPre);
    }
  } catch (error) {
    console.error('Error highlighting code block:', error);
  }
};

export async function highlightCodeBlocks(container: HTMLElement): Promise<void> {
  const highlighter = await initHighlighter();
  const codeElements = Array.from(container.querySelectorAll('pre > code'));

  const highlightPromises = codeElements
    .filter((element) => !isAlreadyHighlighted(element as HTMLElement))
    .map((element) => highlightCodeElement(element as HTMLElement, highlighter));

  await Promise.allSettled(highlightPromises);
}
