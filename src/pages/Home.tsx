import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { SEO } from '../components/SEO/SEO';
import { InkBackground } from '../components/InkBackground/InkBackground';
import { ContributionGraph } from '../components/ContributionGraph/ContributionGraph';
import { useSiteUrl } from '../hooks/useSiteUrl';
import { SITE_CONFIG, SEO_CONFIG, ROUTES } from '../config';
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
  
  const handleNavigateToBlog = () => {
    navigate(ROUTES.BLOG);
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
        <InkBackground />
        <div className="home-grid" />
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
      </div>
    </>
  );
}
