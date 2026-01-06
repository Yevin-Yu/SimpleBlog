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

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

export interface BlogTreeState {
  displayBlog: SelectedBlog | null;
  isVisible: boolean;
}

export interface CategoryNode {
  name: string;
  blogs: BlogItem[];
  children: Map<string, CategoryNode>;
}

export interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  maxLife: number;
  speed: number;
  intensity: number;
  waveCount: number;
  phase: number;
}

export interface DayData {
  date: string;
  count: number;
  level: number;
}
