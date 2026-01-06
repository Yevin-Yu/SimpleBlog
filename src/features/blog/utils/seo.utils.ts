import { SITE_CONFIG, ROUTES } from '@/config';
import type { SEOData, SelectedBlog, BreadcrumbItem } from '@/types';

const PLAIN_TEXT_PATTERNS = [
  [/#{1,6}\s+/g, ''],
  [/!\[.*?\]\(.*?\)/g, ''],
  [/\[.*?\]\(.*?\)/g, ''],
  [/`{1,3}.*?`{1,3}/g, ''],
  [/```[\s\S]*?```/g, ''],
  [/[>*+-]/g, ''],
  [/\n/g, ' '],
] as const;

function stripMarkdown(content: string): string {
  return PLAIN_TEXT_PATTERNS.reduce((text, [pattern]) => text.replace(pattern, ''), content).trim();
}

function calculateReadingTime(content: string): number {
  const plainText = stripMarkdown(content);
  const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = plainText.match(/[a-zA-Z]+/g)?.length || 0;

  const readingMinutes = Math.ceil(chineseChars / 400 + englishWords / 200);
  return Math.max(1, readingMinutes);
}

function generateDescription(content: string, maxLength = 160): string {
  const plainText = stripMarkdown(content);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength - 3) + '...';
}

function generateBreadcrumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return items;
}

export function generateArticleSEOData(blog: SelectedBlog, siteUrl: string): SEOData {
  const articleUrl = `${siteUrl}/blog/${blog.id}`;
  const readingTime = calculateReadingTime(blog.content);
  const description = generateDescription(blog.content, 160);

  const tags = blog.category ? [blog.category] : [];

  return {
    title: `${blog.title} - ${SITE_CONFIG.name}`,
    description: `${blog.title}。${description}`,
    keywords: blog.category
      ? `${blog.category},${blog.title},技术博客,编程`
      : `${blog.title},技术博客,编程`,
    url: ROUTES.BLOG_DETAIL(blog.id),
    type: 'article',
    publishedTime: blog.date,
    modifiedTime: blog.date,
    author: SITE_CONFIG.name,
    readingTime,
    tags,
    breadcrumbs: generateBreadcrumbs(
      { name: '首页', url: '/' },
      { name: '博客', url: '/blog' },
      { name: blog.title, url: `/blog/${blog.id}` }
    ),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description,
      image: SITE_CONFIG.url + '/og-image.jpg',
      datePublished: blog.date,
      dateModified: blog.date,
      author: {
        '@type': 'Person',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: {
          '@type': 'ImageObject',
          url: SITE_CONFIG.url + '/icon.svg',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      keywords: tags.join(', '),
      articleSection: blog.category || '技术',
      wordCount: blog.content.length,
      timeRequired: `PT${readingTime}M`,
    },
  };
}

export function generateBlogListSEOData(siteUrl: string): SEOData {
  return {
    title: '博客目录 - 耶温博客',
    description:
      '浏览耶温博客的所有文章，包括技术分享、编程教程、开发经验、前端开发、React、TypeScript 等内容。',
    keywords: '博客列表,技术文章,编程教程,开发经验,React,TypeScript,前端开发',
    url: ROUTES.BLOG,
    type: 'website',
    breadcrumbs: generateBreadcrumbs({ name: '首页', url: '/' }, { name: '博客', url: '/blog' }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: SITE_CONFIG.name + ' - 博客',
      description: '技术博客文章列表',
      url: `${siteUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: siteUrl,
      },
    },
  };
}

export function generateHomeSEOData(siteUrl: string): SEOData {
  return {
    title: '耶温博客 - 记录思考，分享知识',
    description: SITE_CONFIG.description,
    keywords: '耶温博客,技术博客,个人博客,React,TypeScript,前端开发,编程,学习笔记',
    url: ROUTES.HOME,
    type: 'website',
    breadcrumbs: generateBreadcrumbs({ name: '首页', url: '/' }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      alternateName: '耶温博客',
      url: siteUrl,
      description: SITE_CONFIG.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  };
}

export function generateErrorSEOData(statusCode: number, _siteUrl: string): SEOData {
  return {
    title: `错误 ${statusCode} - 耶温博客`,
    description: `页面未找到或发生错误（${statusCode}）。请检查链接是否正确。`,
    keywords: `错误${statusCode},页面未找到,404`,
    url: `/error`,
    type: 'website',
    noindex: true,
    breadcrumbs: generateBreadcrumbs({ name: '首页', url: '/' }, { name: '错误', url: '/error' }),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `错误 ${statusCode}`,
      description: `页面发生错误：${statusCode}`,
    },
  };
}
