import { useEffect, useRef, useState, memo } from 'react';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';
import { LoadingLines } from '../LoadingLines/LoadingLines';
import { Footer } from '../Footer/Footer';
import { fixElementsWidth, restoreElementsWidth } from '../../utils/dom.utils';
import type { SelectedBlog } from '../../types';
import './BlogTreeContent.css';

interface BlogTreeContentProps {
  selectedBlog: SelectedBlog | null;
  loading: boolean;
}

const TRANSITION_DELAY = {
  FADE: 150,
  WIDTH_RESTORE: 200,
} as const;

const TitleSkeleton = () => (
  <div className="blog-tree-article-header-skeleton">
    <div className="skeleton-title-line" />
    <div className="skeleton-meta-line" />
  </div>
);

const SkeletonLoader = () => (
  <div className="blog-tree-article-skeleton">
    <div className="skeleton-line" />
    <div className="skeleton-line" />
    <div className="skeleton-line short" />
  </div>
);

const LoadingOverlay = () => (
  <div className="blog-tree-loading-overlay">
    <LoadingLines />
  </div>
);

function BlogTreeContentComponent({
  selectedBlog,
  loading,
}: BlogTreeContentProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [displayBlog, setDisplayBlog] = useState<SelectedBlog | null>(
    selectedBlog
  );
  const [isVisible, setIsVisible] = useState(true);
  const isInitialMount = useRef(true);
  const prevBlogIdRef = useRef<string | null>(selectedBlog?.id || null);
  const prevSelectedBlogRef = useRef<SelectedBlog | null>(selectedBlog);

  useEffect(() => {
    const currentBlogId = selectedBlog?.id ?? null;
    const prevBlogId = prevBlogIdRef.current;
    const prevBlog = prevSelectedBlogRef.current;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (selectedBlog) {
        setDisplayBlog(selectedBlog);
        prevBlogIdRef.current = currentBlogId;
        prevSelectedBlogRef.current = selectedBlog;
      }
      return;
    }

    if (loading) return;

    const isSameBlog = 
      currentBlogId === prevBlogId &&
      currentBlogId !== null &&
      prevBlog !== null &&
      selectedBlog !== null &&
      selectedBlog.id === prevBlog.id &&
      selectedBlog.title === prevBlog.title &&
      selectedBlog.content === prevBlog.content;

    if (isSameBlog || selectedBlog === prevBlog) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (selectedBlog) {
      if (currentBlogId !== prevBlogId) {
        const container = containerRef.current;
        const page = document.querySelector('.blog-tree-page') as HTMLElement;
        const elements = [container, page, document.body];
        
        if (container) {
          container.scrollTop = 0;
        }
        
        fixElementsWidth(elements);
        setIsVisible(false);
        
        timer = setTimeout(() => {
          if (container) {
            container.scrollTop = 0;
          }
          
          setDisplayBlog(selectedBlog);
          prevBlogIdRef.current = currentBlogId;
          prevSelectedBlogRef.current = selectedBlog;
          
              requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (container) {
                container.scrollTop = 0;
              }
              setIsVisible(true);
              setTimeout(() => {
                restoreElementsWidth(elements);
              }, TRANSITION_DELAY.WIDTH_RESTORE);
            });
          });
        }, TRANSITION_DELAY.FADE);
      } else {
        setDisplayBlog(selectedBlog);
        prevSelectedBlogRef.current = selectedBlog;
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
      prevBlogIdRef.current = null;
      prevSelectedBlogRef.current = null;
      timer = setTimeout(() => {
        setDisplayBlog(null);
      }, TRANSITION_DELAY.FADE);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [selectedBlog, loading]);

  if (!displayBlog) {
    return (
      <main ref={containerRef} className="blog-tree-content">
        {loading && (
          <div className="blog-tree-content-loading">
            <LoadingOverlay />
          </div>
        )}
      </main>
    );
  }

  return (
    <main ref={containerRef} className="blog-tree-content">
      <div className="blog-tree-article-wrapper">
        {loading && <LoadingOverlay />}
        <article
          className={`blog-tree-article ${isVisible && !loading ? 'article-visible' : 'article-hidden'}`}
          key={displayBlog.id}
        >
          <header className="blog-tree-article-header">
            {loading ? (
              <TitleSkeleton />
            ) : (
              <>
                <h1 className="blog-tree-article-title">{displayBlog.title}</h1>
                <div className="blog-tree-article-meta">
                  {displayBlog.category && (
                    <span className="blog-tree-article-category">
                      {displayBlog.category}
                    </span>
                  )}
                  <time className="blog-tree-article-date">{displayBlog.date}</time>
                </div>
              </>
            )}
          </header>
          <div className="blog-tree-article-body">
            {loading ? (
              <SkeletonLoader />
            ) : (
              <MarkdownRenderer content={displayBlog.content} />
            )}
          </div>
        </article>
        <div className={`blog-tree-footer-wrapper ${loading ? 'footer-hidden' : 'footer-visible'}`}>
          <Footer />
        </div>
      </div>
    </main>
  );
}

const arePropsEqual = (
  prevProps: BlogTreeContentProps,
  nextProps: BlogTreeContentProps
): boolean => {
  const prevId = prevProps.selectedBlog?.id ?? null;
  const nextId = nextProps.selectedBlog?.id ?? null;
  
  if (prevId !== nextId) return false;
  if (prevProps.loading !== nextProps.loading) return false;
  if (prevId === null && nextId === null) return true;

  const prevBlog = prevProps.selectedBlog;
  const nextBlog = nextProps.selectedBlog;

  if (!prevBlog || !nextBlog) return true;

  return (
    prevBlog.title === nextBlog.title &&
    prevBlog.content === nextBlog.content &&
    prevBlog.date === nextBlog.date &&
    prevBlog.category === nextBlog.category
  );
};

export const BlogTreeContent = memo(BlogTreeContentComponent, arePropsEqual);
