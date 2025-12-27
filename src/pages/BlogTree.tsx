import { useState } from 'react';
import { useBlogTree } from '../hooks/useBlogTree';
import { useSiteUrl } from '../hooks/useSiteUrl';
import { BlogTreeSidebar } from '../components/BlogTreeSidebar';
import { BlogTreeContent } from '../components/BlogTreeContent';
import { SEO } from '../components/SEO';
import { SITE_CONFIG, ROUTES } from '../config';
import { Link } from 'react-router-dom';
import './BlogTree.css';

function BlogTree() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const {
    categories,
    selectedBlog,
    loading,
    contentLoading,
    toggleCategory,
    handleBlogClick,
  } = useBlogTree();

  const siteUrl = useSiteUrl();
  
  const handleBlogClickWithSidebar = (id: string) => {
    handleBlogClick(id);
    setSidebarVisible(false);
  };


  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: SITE_CONFIG.name,
    description: '技术博客文章列表',
    url: `${siteUrl}${ROUTES.BLOG}`,
  };

  return (
    <>
      <SEO
        title="博客目录 - 耶温博客"
        description="浏览所有博客文章，包括技术分享、编程教程、开发经验等内容。"
        keywords="博客列表,技术文章,编程教程,开发经验"
        url={ROUTES.BLOG}
        structuredData={structuredData}
      />
      <div className="blog-tree-page">
        <div className="blog-tree-mobile-header">
          <button
            className="blog-tree-mobile-menu-button"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            aria-label={sidebarVisible ? '隐藏目录' : '显示目录'}
          >
            {sidebarVisible ? '✕' : '☰'}
          </button>
          <Link to={ROUTES.HOME} className="blog-tree-mobile-home-button">
            首页
          </Link>
        </div>
        <nav className="blog-tree-desktop-nav">
          <Link to={ROUTES.HOME} className="blog-tree-desktop-home-button">
            首页
          </Link>
        </nav>
        <div className="blog-tree-container">
          <BlogTreeSidebar
            categories={categories}
            loading={loading}
            selectedBlogId={selectedBlog?.id}
            onToggleCategory={toggleCategory}
            onBlogClick={handleBlogClickWithSidebar}
            visible={sidebarVisible}
          />
          <BlogTreeContent selectedBlog={selectedBlog} loading={contentLoading} />
        </div>
        {sidebarVisible && (
          <div
            className="blog-tree-mobile-overlay"
            onClick={() => setSidebarVisible(false)}
          />
        )}
      </div>
    </>
  );
};

export default BlogTree;
