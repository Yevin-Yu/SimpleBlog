import type { BlogItem, BlogContent } from '../types';
import { parseFrontmatter, generateIdFromFilename } from './frontmatter';
import { logger } from './logger';

const blogModules = import.meta.glob('../../blogs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const extractCategoryFromPath = (filePath: string): string => {
  const pathParts = filePath.split('/');
  const blogsIndex = pathParts.indexOf('blogs');
  
  if (blogsIndex === -1 || blogsIndex === pathParts.length - 2) {
    return '';
  }
  
  return pathParts.slice(blogsIndex + 1, -1).join('/');
};

const generateIdFromPath = (filePath: string): string => {
  const pathParts = filePath.split('/');
  const blogsIndex = pathParts.indexOf('blogs');
  
  if (blogsIndex === -1) {
    return generateIdFromFilename(pathParts[pathParts.length - 1] ?? '');
  }
  
  return pathParts
    .slice(blogsIndex + 1)
    .join('/')
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^-|-$/g, '')
    .replace(/\//g, '-');
};

const loadBlogsFromFiles = (): {
  blogList: BlogItem[];
  blogContents: Record<string, BlogContent>;
} => {
  const blogList: BlogItem[] = [];
  const blogContents: Record<string, BlogContent> = {};

  for (const [path, content] of Object.entries(blogModules)) {
    try {
      const id = generateIdFromPath(path);
      const { frontmatter, content: markdownContent } = parseFrontmatter(content as string);
      const categoryFromPath = extractCategoryFromPath(path);
      const category = frontmatter.category || categoryFromPath || undefined;

      blogList.push({
        id,
        title: frontmatter.title,
        date: frontmatter.date,
        category,
      });

      blogContents[id] = {
        title: frontmatter.title,
        content: markdownContent,
        description: frontmatter.description,
        modifiedTime: frontmatter.date,
      };
    } catch (error) {
      logger.error(`解析博客文件失败: ${path}`, error);
    }
  }

  return { blogList, blogContents };
};

const { blogList, blogContents } = loadBlogsFromFiles();

const sortBlogsByDate = (a: BlogItem, b: BlogItem): number => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
};

export async function getBlogList(): Promise<BlogItem[]> {
  return [...blogList].sort(sortBlogsByDate);
}

export async function getBlogContent(id: string): Promise<BlogContent> {
  const content = blogContents[id];
  if (!content) {
    throw new Error(`博客内容不存在: ${id}`);
  }
  return content;
}

