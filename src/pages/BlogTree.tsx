/**
 * 博客树页面
 * 显示博客列表和文章内容，支持响应式布局
 * 在桌面端显示侧边栏+内容区，在移动端可切换侧边栏显示
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useBlogTree } from '../features/blog/hooks/useBlogTree';
import { useSiteUrl } from '../features/blog/hooks/useSiteUrl';
import { useResponsiveLayout } from '../features/blog/hooks/useResponsiveLayout';
import { BlogTreeSidebar } from '../features/blog/components/BlogTreeSidebar/BlogTreeSidebar';
import { BlogTreeContent } from '../features/blog/components/BlogTreeContent/BlogTreeContent';
import { SEO } from '../features/blog/components/SEO/SEO';
import { FloatingActionButton } from '../components/ui/FloatingActionButton/FloatingActionButton';
import { BlogTOCDrawer } from '../features/blog/components/BlogTOCDrawer/BlogTOCDrawer';
import { generateArticleSEOData, generateBlogListSEOData } from '../features/blog/utils/seo.utils';
import './BlogTree.css';

export function BlogTree() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [tocDrawerOpen, setTocDrawerOpen] = useState(false);
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
      <FloatingActionButton
        onBlogClick={handleBlogClickWithSidebar}
        selectedBlogId={selectedBlog?.id}
        onTocClick={() => setTocDrawerOpen(true)}
      />
      <BlogTOCDrawer
        isOpen={tocDrawerOpen}
        onClose={() => setTocDrawerOpen(false)}
        content={selectedBlog?.content}
        isSmallScreen={!hasEnoughSpace}
      />
    </>
  );
}
