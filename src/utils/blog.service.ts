import type { BlogItem, BlogContent, BlogSearchItem } from '../types';
import { parseFrontmatter, generateIdFromFilename } from './frontmatter';
import { logger } from './logger';
import { isValidDateString } from './date.utils';

const blogModules = import.meta.glob('../../blogs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * 从文件路径提取分类
 */
const extractCategoryFromPath = (filePath: string): string => {
  const pathParts = filePath.split('/');
  const blogsIndex = pathParts.indexOf('blogs');
  
  if (blogsIndex === -1 || blogsIndex === pathParts.length - 2) {
    return '';
  }
  
  return pathParts.slice(blogsIndex + 1, -1).join('/');
};

/**
 * 清理并规范化 ID
 */
const sanitizeId = (id: string): string => {
  return id
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * 从文件路径生成 ID
 */
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

/**
 * 从文件系统加载所有博客
 */
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

      // 验证日期格式
      const date = frontmatter.date;
      if (!isValidDateString(date)) {
        logger.warn(`博客日期格式无效: ${path}, 使用当前日期`);
      }

      blogList.push({
        id,
        title: frontmatter.title,
        date,
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
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  // 处理无效日期
  const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
  const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();

  return timeB - timeA;
};

/**
 * 获取博客列表（按日期倒序）
 */
export function getBlogList(): Promise<BlogItem[]> {
  return Promise.resolve([...blogList].sort(sortBlogsByDate));
}

/**
 * 获取指定博客的内容
 */
export function getBlogContent(id: string): Promise<BlogContent> {
  const content = blogContents[id];
  if (!content) {
    const error = new Error(`博客内容不存在: ${id}`);
    logger.error('获取博客内容失败', error);
    return Promise.reject(error);
  }
  return Promise.resolve(content);
}

/**
 * 获取所有博客用于搜索（包含描述）
 */
export function getAllBlogsForSearch(): Promise<BlogSearchItem[]> {
  return Promise.resolve(
    blogList.map((blog) => {
      const content = blogContents[blog.id];
      return {
        ...blog,
        description: content?.description,
      };
    })
  );
}

