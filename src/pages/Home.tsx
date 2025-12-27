import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { useSiteUrl } from '../hooks/useSiteUrl';
import { SITE_CONFIG, SEO_CONFIG, ROUTES } from '../config';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const siteUrl = useSiteUrl();
  
  const handleNavigateToBlog = () => {
    navigate(ROUTES.BLOG);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}${ROUTES.BLOG}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

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
        <div className="home-grid" />
        <div className="home-container">
          <header className="home-header">
            <h1 className="home-title">耶温博客</h1>
            <p className="home-subtitle">记录思考，分享知识</p>
          </header>
          <nav className="home-nav">
            <button
              className="home-nav-button"
              onClick={handleNavigateToBlog}
            >
              查看文章
            </button>
          </nav>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
