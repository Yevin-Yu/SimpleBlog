import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { SEO } from '../components/SEO/SEO';
import { InkBackground } from '../components/InkBackground/InkBackground';
import { ContributionGraph } from '../components/ContributionGraph/ContributionGraph';
import { BlogSearchModal } from '../components/BlogSearchModal/BlogSearchModal';
import { SnowfallEffect } from '../components/SnowfallEffect/SnowfallEffect';
import { useSiteUrl } from '../hooks/useSiteUrl';
import { SITE_CONFIG, SEO_CONFIG, ROUTES, BLOG_CONFIG } from '../config';
import './Home.css';

/**
 * 结构化数据模板
 */
const STRUCTURED_DATA_TEMPLATE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite' as const,
  potentialAction: {
    '@type': 'SearchAction' as const,
    target: {
      '@type': 'EntryPoint' as const,
    },
    'query-input': 'required name=search_term_string',
  },
} as const;

export function Home() {
  const navigate = useNavigate();
  const siteUrl = useSiteUrl();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleNavigateToBlog = () => {
    navigate(ROUTES.BLOG_DETAIL(BLOG_CONFIG.defaultBlogId));
  };

  const handleBlogClick = (blogId: string) => {
    navigate(ROUTES.BLOG_DETAIL(blogId));
  };

  const structuredData = useMemo(() => ({
    ...STRUCTURED_DATA_TEMPLATE,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: siteUrl,
    potentialAction: {
      ...STRUCTURED_DATA_TEMPLATE.potentialAction,
      target: {
        ...STRUCTURED_DATA_TEMPLATE.potentialAction.target,
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
    },
  }), [siteUrl]);

  return (
    <>
      <SEO
        title={SEO_CONFIG.defaultTitle}
        description={SEO_CONFIG.defaultDescription}
        keywords={SEO_CONFIG.defaultKeywords}
        url={ROUTES.HOME}
        structuredData={structuredData}
      />
      <div className="home">
        {/* 雪花特效 */}
        <SnowfallEffect />
        <InkBackground />
        <div className="home-grid" />
        <button
          className="home-search-button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="搜索文章"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="home-container">
          <header className="home-header">
            <h1 className="home-title">耶温博客</h1>
            <p className="home-subtitle">记录思考，分享知识</p>
          </header>
          <nav className="home-nav">
            <button className="home-nav-button" onClick={handleNavigateToBlog}>
              查看文章
            </button>
          </nav>
        </div>
        <ContributionGraph />
        <BlogSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onBlogClick={handleBlogClick}
        />
      </div>
    </>
  );
}
