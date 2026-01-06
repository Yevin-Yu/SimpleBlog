import type { BlogItem, BlogContent, BlogSearchItem } from '@/types';
import { parseFrontmatter, generateIdFromFilename } from '@/features/blog/utils/frontmatter';
import { logger } from '@/utils/logger';
import { isValidDateString } from '@/features/blog/utils/date.utils';

const blogModules = import.meta.glob('/blogs/**/*.md', {
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

class BlogStore {
  private blogList: BlogItem[] = [];
  private blogContents: Record<string, BlogContent> = {};
  private usedIds = new Set<string>();

  private generateUniqueId(baseId: string): string {
    if (!this.usedIds.has(baseId)) {
      this.usedIds.add(baseId);
      return baseId;
    }

    let counter = 1;
    let id = `${baseId}-${counter}`;

    while (this.usedIds.has(id)) {
      counter++;
      id = `${baseId}-${counter}`;
    }

    this.usedIds.add(id);
    return id;
  }

  private processBlogFile(path: string, content: string): void {
    try {
      const { frontmatter, content: markdownContent } = parseFrontmatter(content);
      const categoryFromPath = extractCategoryFromPath(path);
      const category = frontmatter.category || categoryFromPath || undefined;

      const baseId = frontmatter.id ? sanitizeId(frontmatter.id) : generateIdFromPath(path);

      if (!baseId) {
        logger.error(`无法生成博客ID: ${path}`);
        return;
      }

      const id = this.generateUniqueId(baseId);

      if (!isValidDateString(frontmatter.date || '')) {
        logger.warn(`博客日期格式无效: ${path}, 使用当前日期`);
      }

      this.blogList.push({
        id,
        title: frontmatter.title || 'Untitled',
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        category,
        tags: frontmatter.tags,
      });

      this.blogContents[id] = {
        title: frontmatter.title || 'Untitled',
        content: markdownContent,
        description: frontmatter.description,
        modifiedTime: frontmatter.date,
      };
    } catch (error) {
      logger.error(`解析博客文件失败: ${path}`, error);
    }
  }

  public loadBlogs(): void {
    for (const [path, content] of Object.entries(blogModules)) {
      this.processBlogFile(path, content as string);
    }
  }

  public getBlogList(): BlogItem[] {
    return [...this.blogList];
  }

  public getBlogContent(id: string): BlogContent | null {
    return this.blogContents[id] ?? null;
  }

  public getAllBlogsForSearch(): BlogSearchItem[] {
    return this.blogList.map((blog) => ({
      ...blog,
      description: this.blogContents[blog.id]?.description,
    }));
  }
}

const blogStore = new BlogStore();
blogStore.loadBlogs();

export function getBlogList(): Promise<BlogItem[]> {
  return Promise.resolve(blogStore.getBlogList());
}

export function getBlogContent(id: string): Promise<BlogContent> {
  const content = blogStore.getBlogContent(id);
  if (!content) {
    const error = new Error(`博客内容不存在: ${id}`);
    logger.error('获取博客内容失败', error);
    return Promise.reject(error);
  }
  return Promise.resolve(content);
}

export function getAllBlogsForSearch(): Promise<BlogSearchItem[]> {
  return Promise.resolve(blogStore.getAllBlogsForSearch());
}
