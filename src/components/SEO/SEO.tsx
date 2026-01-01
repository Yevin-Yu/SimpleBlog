import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteUrl } from '../../hooks/useSiteUrl';
import { SITE_CONFIG, SEO_CONFIG } from '../../config';

/**
 * SEO 组件属性
 */
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  /**
   * 页面类型，默认为 website
   */
  type?: 'website' | 'article';
  /**
   * 作者名称
   */
  author?: string;
  /**
   * 文章发布时间
   */
  publishedTime?: string;
  /**
   * 文章修改时间
   */
  modifiedTime?: string;
  /**
   * 结构化数据（JSON-LD）
   */
  structuredData?: Record<string, unknown>;
  /**
   * 爬虫指令
   */
  noindex?: boolean;
  nofollow?: boolean;
  /**
   * 阅读时间（分钟）
   */
  readingTime?: number;
  /**
   * 文章标签
   */
  tags?: string[];
  /**
   * 面包屑导航
   */
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * SEO 组件 - 管理页面 SEO 元数据
 */
export function SEO({
  title = SEO_CONFIG.defaultTitle,
  description = SEO_CONFIG.defaultDescription,
  keywords = SEO_CONFIG.defaultKeywords,
  image = SEO_CONFIG.defaultImage,
  imageAlt,
  url = '',
  type = 'website',
  author = SITE_CONFIG.name,
  publishedTime = '',
  modifiedTime = '',
  structuredData,
  noindex = false,
  nofollow = false,
  readingTime,
  tags = [],
  breadcrumbs = [],
}: SEOProps) {
  const siteUrl = useSiteUrl();
  const fullUrl = url ? `${siteUrl}${url.startsWith('/') ? url : `/${url}`}` : siteUrl;
  const fullImage = useMemo(
    () => (image.startsWith('http') ? image : `${siteUrl}${image}`),
    [image, siteUrl]
  );

  // 生成 robots meta 内容
  const robotsContent = useMemo(() => {
    const parts: string[] = [];
    if (noindex) parts.push('noindex');
    else parts.push('index');
    if (nofollow) parts.push('nofollow');
    else parts.push('follow');
    return parts.join(', ');
  }, [noindex, nofollow]);

  // 生成文章关键词（包含标签）
  const allKeywords = useMemo(() => {
    const baseKeywords = keywords || SEO_CONFIG.defaultKeywords;
    if (tags.length > 0) {
      return `${baseKeywords},${tags.join(',')}`;
    }
    return baseKeywords;
  }, [keywords, tags]);

  // 生成结构化数据数组
  const allStructuredData = useMemo(() => {
    const dataList: Record<string, unknown>[] = [];

    // 添加主要结构化数据
    if (structuredData) {
      dataList.push(structuredData);
    }

    // 添加面包屑导航
    if (breadcrumbs.length > 0) {
      dataList.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.url.startsWith('/') ? crumb.url : `/${crumb.url}`}`,
        })),
      });
    }

    // 添加 WebSite 结构化数据
    dataList.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
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
    });

    return dataList;
  }, [structuredData, breadcrumbs, siteUrl]);

  return (
    <Helmet>
      {/* 基础 Meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph 标签 */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={imageAlt || description} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:site" content={SITE_CONFIG.name} />

      {/* 文章特定标签 */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {tags.length > 0 && tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
          {readingTime && (
            <meta name="article:reading_time" content={`${readingTime} minutes`} />
          )}
        </>
      )}

      {/* 视口和主题 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href={SEO_CONFIG.favicon} />
      <link rel="shortcut icon" href={SEO_CONFIG.favicon} />

      {/* 结构化数据 */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
