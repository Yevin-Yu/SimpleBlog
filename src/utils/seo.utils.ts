import { SITE_CONFIG, ROUTES } from '../config';
import type { SelectedBlog } from '../types';

interface SEOData {
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
  breadcrumbs?: Array<{ name: string; url: string }>;
  noindex?: boolean;
}

/**
 * 计算文章阅读时间（基于中文平均阅读速度）
 */
function calculateReadingTime(content: string): number {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 标题
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 链接
    .replace(/`{1,3}.*?`{1,3}/g, '') // 代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/[>*+-]/g, '') // 列表
    .replace(/\n/g, '') // 换行
    .trim();

  // 中文按字数，英文按单词数
  const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = plainText.match(/[a-zA-Z]+/g)?.length || 0;

  // 中文阅读速度：400字/分钟，英文阅读速度：200词/分钟
  const readingMinutes = Math.ceil(chineseChars / 400 + englishWords / 200);

  return Math.max(1, readingMinutes); // 至少1分钟
}

/**
 * 从文章内容生成描述
 */
function generateDescription(content: string, maxLength = 160): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/`{1,3}.*?`{1,3}/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[>*+-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  // 截取前面部分作为描述
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength - 3) + '...';
}

/**
 * 生成文章页面的 SEO 数据
 */
export function generateArticleSEOData(
  blog: SelectedBlog,
  siteUrl: string
): SEOData {
  const articleUrl = `${siteUrl}/blog/${blog.id}`;
  const readingTime = calculateReadingTime(blog.content);
  const description = generateDescription(blog.content, 160);

  // 生成面包屑
  const breadcrumbs = [
    { name: '首页', url: '/' },
    { name: '博客', url: '/blog' },
    { name: blog.title, url: `/blog/${blog.id}` },
  ];

  // 生成标签（分类 + 关键词）
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
    breadcrumbs,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description: description,
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

/**
 * 生成博客列表页面的 SEO 数据
 */
export function generateBlogListSEOData(siteUrl: string): SEOData {
  return {
    title: '博客目录 - 耶温博客',
    description:
      '浏览耶温博客的所有文章，包括技术分享、编程教程、开发经验、前端开发、React、TypeScript 等内容。',
    keywords: '博客列表,技术文章,编程教程,开发经验,React,TypeScript,前端开发',
    url: ROUTES.BLOG,
    type: 'website',
    breadcrumbs: [
      { name: '首页', url: '/' },
      { name: '博客', url: '/blog' },
    ],
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

/**
 * 生成首页的 SEO 数据
 */
export function generateHomeSEOData(siteUrl: string): SEOData {
  return {
    title: '耶温博客 - 记录思考，分享知识',
    description: SITE_CONFIG.description,
    keywords: '耶温博客,技术博客,个人博客,React,TypeScript,前端开发,编程,学习笔记',
    url: ROUTES.HOME,
    type: 'website',
    breadcrumbs: [{ name: '首页', url: '/' }],
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

/**
 * 生成 404 页面的 SEO 数据
 */
export function generateErrorSEOData(
  statusCode: number,
  _siteUrl: string
): SEOData {
  return {
    title: `错误 ${statusCode} - 耶温博客`,
    description: `页面未找到或发生错误（${statusCode}）。请检查链接是否正确。`,
    keywords: `错误${statusCode},页面未找到,404`,
    url: `/error`,
    type: 'website',
    noindex: true, // 不索引错误页面
    breadcrumbs: [
      { name: '首页', url: '/' },
      { name: '错误', url: '/error' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `错误 ${statusCode}`,
      description: `页面发生错误：${statusCode}`,
    },
  };
}
