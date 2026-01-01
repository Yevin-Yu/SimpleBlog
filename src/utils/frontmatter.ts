export interface Frontmatter {
  title: string;
  date: string;
  category?: string;
  description?: string;
  id?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined;
}

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;

const getDefaultDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * 解析 Markdown 文件的 Frontmatter
 */
export function parseFrontmatter(markdown: string): {
  frontmatter: Frontmatter;
  content: string;
} {
  const match = markdown.match(FRONTMATTER_REGEX);

  if (!match) {
    return {
      frontmatter: {
        title: 'Untitled',
        date: getDefaultDate(),
      },
      content: markdown,
    };
  }

  const [, frontmatterText, content] = match;
  const frontmatter: Frontmatter = {
    title: 'Untitled',
    date: getDefaultDate(),
  };

  let currentKey: string | null = null;
  const arrayValues: string[] = [];

  for (const line of frontmatterText.split('\n')) {
    // 处理数组项（以 "- " 开头）
    if (line.trim().startsWith('- ')) {
      const value = line.trim().slice(2).trim().replace(/^["']|["']$/g, '');
      if (currentKey) {
        arrayValues.push(value);
      }
      continue;
    }

    // 如果之前在收集数组项，现在保存它们
    if (currentKey && arrayValues.length > 0) {
      frontmatter[currentKey] = [...arrayValues];
      arrayValues.length = 0;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      currentKey = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');

      if (value) {
        // 如果有值，直接保存
        frontmatter[currentKey] = value;
        currentKey = null;
      }
      // 如果没有值，可能是数组开始，继续等待下一行的数组项
    }
  }

  // 保存最后的数组
  if (currentKey && arrayValues.length > 0) {
    frontmatter[currentKey] = [...arrayValues];
  }

  return { frontmatter, content };
}

/**
 * 从文件名生成唯一 ID
 */
export function generateIdFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

