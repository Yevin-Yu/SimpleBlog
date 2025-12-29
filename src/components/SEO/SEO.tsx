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
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: Record<string, unknown>;
}

/**
 * SEO 组件 - 管理页面 SEO 元数据
 */
export function SEO({
  title = SEO_CONFIG.defaultTitle,
  description = SEO_CONFIG.defaultDescription,
  keywords = SEO_CONFIG.defaultKeywords,
  image = SEO_CONFIG.defaultImage,
  url = '',
  type = 'website',
  author = '',
  publishedTime = '',
  modifiedTime = '',
  structuredData,
}: SEOProps) {
  const siteUrl = useSiteUrl();
  const fullUrl = url ? `${siteUrl}${url.startsWith('/') ? url : `/${url}`}` : siteUrl;
  const fullImage = useMemo(
    () => (image.startsWith('http') ? image : `${siteUrl}${image}`),
    [image, siteUrl]
  );

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
        </>
      )}

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

