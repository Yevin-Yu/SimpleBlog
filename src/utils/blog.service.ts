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

const sanitizeId = (id: string): string => {
  return id
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const generateIdFromPath = (filePath: string): string => {
  const pathParts = filePath.split('/');
  const blogsIndex = pathParts.indexOf('blogs');
  
  if (blogsIndex === -1) {
    const filename = pathParts[pathParts.length - 1] ?? '';
    return generateIdFromFilename(filename);
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
  const usedIds = new Set<string>();

  const generateUniqueId = (baseId: string): string => {
    if (!usedIds.has(baseId)) {
      usedIds.add(baseId);
      return baseId;
    }
    
    let counter = 1;
    let id = `${baseId}-${counter}`;
    
    while (usedIds.has(id)) {
      counter++;
      id = `${baseId}-${counter}`;
    }
    
    usedIds.add(id);
    return id;
  };

  for (const [path, content] of Object.entries(blogModules)) {
    try {
      const { frontmatter, content: markdownContent } = parseFrontmatter(content as string);
      const categoryFromPath = extractCategoryFromPath(path);
      const category = frontmatter.category || categoryFromPath || undefined;
      
      const baseId = frontmatter.id 
        ? sanitizeId(frontmatter.id)
        : generateIdFromPath(path);

      if (!baseId) {
        logger.error(`无法生成博客ID: ${path}`);
        continue;
      }

      const id = generateUniqueId(baseId);

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
    const error = new Error(`博客内容不存在: ${id}`);
    logger.error('获取博客内容失败', error);
    throw error;
  }
  return content;
}

export interface BlogSearchItem extends BlogItem {
  description?: string;
}

export async function getAllBlogsForSearch(): Promise<BlogSearchItem[]> {
  return blogList.map((blog) => {
    const content = blogContents[blog.id];
    return {
      ...blog,
      description: content?.description,
    };
  });
}

