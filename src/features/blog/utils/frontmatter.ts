import type { FrontmatterData } from '@/types';

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;

const getDefaultDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export function parseFrontmatter(markdown: string): {
  frontmatter: FrontmatterData;
  content: string;
} {
  const match = markdown.match(FRONTMATTER_REGEX);

  if (!match) {
    return {
      frontmatter: { title: 'Untitled', date: getDefaultDate() },
      content: markdown,
    };
  }

  const [, frontmatterText, content] = match;
  const frontmatter: FrontmatterData = {
    title: 'Untitled',
    date: getDefaultDate(),
  };

  let currentKey: string | null = null;
  const arrayValues: string[] = [];

  for (const line of frontmatterText.split('\n')) {
    if (line.trim().startsWith('- ')) {
      const value = line
        .trim()
        .slice(2)
        .trim()
        .replace(/^["']|["']$/g, '');
      if (currentKey) {
        arrayValues.push(value);
      }
      continue;
    }

    if (currentKey && arrayValues.length > 0) {
      frontmatter[currentKey] = [...arrayValues];
      arrayValues.length = 0;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      currentKey = line.slice(0, colonIndex).trim();
      const value = line
        .slice(colonIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, '');

      if (value) {
        frontmatter[currentKey] = value;
        currentKey = null;
      }
    }
  }

  if (currentKey && arrayValues.length > 0) {
    frontmatter[currentKey] = [...arrayValues];
  }

  return { frontmatter, content };
}

export function generateIdFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
