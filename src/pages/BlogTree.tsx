/**
 * 博客树页面
 * 显示博客列表和文章内容，支持响应式布局
 * 在桌面端显示侧边栏+内容区，在移动端可切换侧边栏显示
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBlogTree } from '../hooks/useBlogTree';
import { useSiteUrl } from '../hooks/useSiteUrl';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { BlogTreeSidebar } from '../components/BlogTreeSidebar/BlogTreeSidebar';
import { BlogTreeContent } from '../components/BlogTreeContent/BlogTreeContent';
import { SEO } from '../components/SEO/SEO';
import { FloatingActionButton } from '../components/FloatingActionButton/FloatingActionButton';
import { ROUTES } from '../config';
import { generateArticleSEOData, generateBlogListSEOData } from '../utils/seo.utils';
import './BlogTree.css';

export function BlogTree() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { hasEnoughSpace, isInitialized, containerRef } = useResponsiveLayout();
  const prevHasEnoughSpaceRef = useRef(false);
  const {
    categories,
    selectedBlog,
    loading,
    contentLoading,
    error,
    toggleCategory,
    handleBlogClick,
  } = useBlogTree();

  const siteUrl = useSiteUrl();

  useEffect(() => {
    const prevHasEnoughSpace = prevHasEnoughSpaceRef.current;

    if (prevHasEnoughSpace !== hasEnoughSpace) {
      prevHasEnoughSpaceRef.current = hasEnoughSpace;

      if (prevHasEnoughSpace && !hasEnoughSpace && sidebarVisible) {
        requestAnimationFrame(() => {
          setSidebarVisible(false);
        });
      }
    }
  }, [hasEnoughSpace, sidebarVisible]);

  const handleBlogClickWithSidebar = useCallback(
    (id: string) => {
      handleBlogClick(id);
      if (!hasEnoughSpace) {
        setSidebarVisible(false);
      }
    },
    [handleBlogClick, hasEnoughSpace]
  );

  const seoData = useMemo(() => {
    if (selectedBlog) {
      return generateArticleSEOData(selectedBlog, siteUrl);
    }
    return generateBlogListSEOData(siteUrl);
  }, [selectedBlog, siteUrl]);

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
        type={seoData.type}
        publishedTime={seoData.publishedTime}
        modifiedTime={seoData.modifiedTime}
        author={seoData.author}
        readingTime={seoData.readingTime}
        tags={seoData.tags}
        breadcrumbs={seoData.breadcrumbs}
        structuredData={seoData.structuredData}
      />
      <div className="blog-tree-page">
        {!hasEnoughSpace && (
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
        )}
        {hasEnoughSpace && (
          <nav className="blog-tree-desktop-nav">
            <Link to={ROUTES.HOME} className="blog-tree-desktop-home-button">
              首页
            </Link>
          </nav>
        )}
        <div className="blog-tree-container" ref={containerRef}>
          <BlogTreeSidebar
            categories={categories}
            loading={loading}
            selectedBlogId={selectedBlog?.id}
            onToggleCategory={toggleCategory}
            onBlogClick={handleBlogClickWithSidebar}
            visible={isInitialized ? hasEnoughSpace || sidebarVisible : false}
          />
          <BlogTreeContent selectedBlog={selectedBlog} loading={contentLoading} error={error} />
        </div>
      </div>
      <FloatingActionButton />
    </>
  );
}
