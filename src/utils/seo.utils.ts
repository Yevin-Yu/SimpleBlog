import { SITE_CONFIG, ROUTES } from '../config';
import type { SelectedBlog } from '../types';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  url: string;
  type: 'website' | 'article';
  publishedTime?: string;
  structuredData: Record<string, unknown>;
}

/**
 * 生成文章页面的 SEO 数据
 */
export function generateArticleSEOData(
  blog: SelectedBlog,
  siteUrl: string
): SEOData {
  const articleUrl = `${siteUrl}/blog/${blog.id}`;

  return {
    title: `${blog.title} - ${SITE_CONFIG.name}`,
    description: `阅读文章：${blog.title}`,
    keywords: blog.category 
      ? `${blog.category},${blog.title}` 
      : blog.title,
    url: ROUTES.BLOG_DETAIL(blog.id),
    type: 'article',
    publishedTime: blog.date,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      datePublished: blog.date,
      author: {
        '@type': 'Person',
        name: SITE_CONFIG.name,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      url: articleUrl,
    },
  };
}

/**
 * 生成博客列表页面的 SEO 数据
 */
export function generateBlogListSEOData(siteUrl: string): SEOData {
  return {
    title: '博客目录 - 耶温博客',
    description: '浏览所有博客文章，包括技术分享、编程教程、开发经验等内容。',
    keywords: '博客列表,技术文章,编程教程,开发经验',
    url: ROUTES.BLOG,
    type: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: SITE_CONFIG.name,
      description: '技术博客文章列表',
      url: `${siteUrl}/blog`,
    },
  };
}

