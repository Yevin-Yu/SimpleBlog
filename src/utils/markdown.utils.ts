import MarkdownIt from 'markdown-it';
import { createHighlighter, type Highlighter } from 'shiki';
import DOMPurify from 'dompurify';
import { getAllowedTags, getAllowedAttr } from '../constants/security';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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

markdownRenderer.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx];
  const level = token.markup.length;
  const text = tokens[idx + 1].content || '';
  const slug = slugify(text);

  return `<h${level} id="${slug}" class="markdown-heading">`;
};

export function extractTOC(content: string): TOCItem[] {
  const tokens = markdownRenderer.parse(content, {});
  const items: TOCItem[] = [];

  for (const token of tokens) {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1), 10);
      const text = tokens[tokens.indexOf(token) + 1].content || '';
      const id = slugify(text);

      const item: TOCItem = {
        id,
        text,
        level,
      };

      if (level > items[items.length - 1]?.level) {
        if (items.length > 0) {
          const parent = items[items.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        } else {
          items.push(item);
        }
      } else {
        items.push(item);
      }
    }
  }

  return items;
}

export function renderMarkdown(content: string): string {
  return markdownRenderer.render(content);
}

export function renderMarkdownAndSanitize(content: string): string {
  const rawHtml = renderMarkdown(content);
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [...getAllowedTags(), 'style'],
    ALLOWED_ATTR: [...getAllowedAttr(), 'tabindex', 'id'],
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
