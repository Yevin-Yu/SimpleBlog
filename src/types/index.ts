export type SitemapChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface BlogItem {
  id: string;
  title: string;
  date: string;
  category?: string;
  tags?: string[];
}

export interface BlogContent {
  title: string;
  content: string;
  description?: string;
  modifiedTime?: string;
}

export interface SelectedBlog extends BlogItem {
  content: string;
}

export interface BlogSearchItem extends BlogItem {
  description?: string;
}

export interface BlogCategory {
  name: string;
  blogs: BlogItem[];
  expanded: boolean;
  children?: BlogCategory[];
}

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

export interface FrontmatterData {
  title?: string;
  date?: string;
  category?: string;
  description?: string;
  id?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined;
}

export interface ContributionData {
  generatedAt: string;
  contributions: Record<string, number>;
  totalCommits: number;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  count: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  url: string;
  type: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  imageAlt?: string;
  author?: string;
  readingTime?: number;
  tags?: string[];
  structuredData: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};
