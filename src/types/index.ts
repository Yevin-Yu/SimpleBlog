/**
 * 博客基础信息
 */
export interface BlogItem {
  id: string;
  title: string;
  date: string;
  category?: string;
}

/**
 * 博客内容
 */
export interface BlogContent {
  title: string;
  content: string;
  description?: string;
  modifiedTime?: string;
}

/**
 * 博客分类结构
 */
export interface BlogCategory {
  name: string;
  blogs: BlogItem[];
  expanded: boolean;
  children?: BlogCategory[];
}

/**
 * 选中的博客（包含内容）
 */
export interface SelectedBlog extends BlogItem {
  content: string;
}

/**
 * 用于搜索的博客项
 */
export interface BlogSearchItem extends BlogItem {
  description?: string;
}

/**
 * Sitemap 变更频率
 */
export type SitemapChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

/**
 * Sitemap URL 配置
 */
export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}
