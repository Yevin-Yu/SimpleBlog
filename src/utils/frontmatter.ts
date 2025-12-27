export interface Frontmatter {
  title: string;
  date: string;
  category?: string;
  description?: string;
  [key: string]: string | undefined;
}

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
const DEFAULT_DATE = new Date().toISOString().split('T')[0] as string;

export function parseFrontmatter(markdown: string): {
  frontmatter: Frontmatter;
  content: string;
} {
  const match = markdown.match(FRONTMATTER_REGEX);

  if (!match) {
    return {
      frontmatter: {
        title: 'Untitled',
        date: DEFAULT_DATE,
      },
      content: markdown,
    };
  }

  const [, frontmatterText, content] = match;
  const frontmatter: Frontmatter = {
    title: 'Untitled',
    date: DEFAULT_DATE,
  };

  for (const line of frontmatterText.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      if (key) {
        frontmatter[key] = value;
      }
    }
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

