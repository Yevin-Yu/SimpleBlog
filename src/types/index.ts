export interface BlogItem {
  id: string;
  title: string;
  date: string;
  category?: string;
}

export interface BlogContent {
  title: string;
  content: string;
  description?: string;
  modifiedTime?: string;
}

export interface BlogCategory {
  name: string;
  blogs: BlogItem[];
  expanded: boolean;
  children?: BlogCategory[];
}

export interface SelectedBlog extends BlogItem {
  content: string;
}

export type SitemapChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}
