/**
 * Home - 首页
 * 展示品牌信息、背景特效、贡献图和最新文章
 */

import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { SEO } from '../components/SEO/SEO';
import { InkBackground } from '../components/InkBackground/InkBackground';
import { ContributionGraph } from '../components/ContributionGraph/ContributionGraph';
import { BlogSearchModal } from '../components/BlogSearchModal/BlogSearchModal';
import { SnowfallEffect } from '../components/SnowfallEffect/SnowfallEffect';
import { useSiteUrl } from '../hooks/useSiteUrl';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { SITE_CONFIG, SEO_CONFIG, ROUTES, BLOG_CONFIG } from '../config';
import { getBlogList } from '../utils/blog.service';
import type { BlogItem } from '../types';
import './Home.css';

const STRUCTURED_DATA_TEMPLATE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite' as const,
  potentialAction: {
    '@type': 'SearchAction' as const,
    target: { '@type': 'EntryPoint' as const },
    'query-input': 'required name=search_term_string',
  },
} as const;

export function Home() {
  const navigate = useNavigate();
  const siteUrl = useSiteUrl();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>([]);

  useGlobalSearch(() => setIsSearchModalOpen(true));

  const handleBlogClick = (blogId: string) => navigate(ROUTES.BLOG_DETAIL(blogId));

  useEffect(() => {
    getBlogList().then((blogs) => setLatestBlogs(blogs.slice(0, 3)));
  }, []);

  const structuredData = useMemo(
    () => ({
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
    }),
    [siteUrl]
  );

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
        <SnowfallEffect />
        <InkBackground />
        <div className="home-grid" />
        <button
          className="home-search-button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="搜索文章 (快捷键: Q)"
          title="搜索文章 (快捷键: Q)"
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
            <button
              className="home-nav-button"
              onClick={() => navigate(ROUTES.BLOG_DETAIL(BLOG_CONFIG.defaultBlogId))}
            >
              查看文章
            </button>
          </nav>
          {latestBlogs.length > 0 && (
            <div className="home-latest-blogs">
              <h3 className="home-latest-blogs-title">最新文章</h3>
              <ul className="home-latest-blogs-list">
                {latestBlogs.map((blog) => (
                  <li key={blog.id} className="home-latest-blogs-item">
                    <button
                      className="home-latest-blogs-link"
                      onClick={() => handleBlogClick(blog.id)}
                    >
                      <span className="home-latest-blogs-item-title">{blog.title}</span>
                      <span className="home-latest-blogs-item-date">{blog.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
