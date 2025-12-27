import { useEffect, useRef, useState } from 'react';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { LoadingLines } from '../LoadingLines';
import { Footer } from '../Footer';
import type { SelectedBlog } from '../../types';
import './BlogTreeContent.css';

interface BlogTreeContentProps {
  selectedBlog: SelectedBlog | null;
  loading: boolean;
}

/** 淡入淡出动画延迟时间（毫秒） */
const FADE_TRANSITION_DELAY_MS = 150;

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

export function BlogTreeContent({
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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (selectedBlog) {
        setDisplayBlog(selectedBlog);
        prevBlogIdRef.current = selectedBlog.id;
      }
      return;
    }

    if (loading) {
      return;
    }

    const currentBlogId = selectedBlog?.id ?? null;
    const prevBlogId = prevBlogIdRef.current;

    if (selectedBlog) {
      if (currentBlogId !== prevBlogId) {
        setIsVisible(false);
        setTimeout(() => {
          setDisplayBlog(selectedBlog);
          prevBlogIdRef.current = currentBlogId;
          containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }, FADE_TRANSITION_DELAY_MS);
      } else {
        setDisplayBlog(selectedBlog);
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
      prevBlogIdRef.current = null;
      setTimeout(() => {
        setDisplayBlog(null);
      }, FADE_TRANSITION_DELAY_MS);
    }
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
            <h1 className="blog-tree-article-title">{displayBlog.title}</h1>
            <div className="blog-tree-article-meta">
              {displayBlog.category && (
                <span className="blog-tree-article-category">
                  {displayBlog.category}
                </span>
              )}
              <time className="blog-tree-article-date">{displayBlog.date}</time>
            </div>
          </header>
          <div className="blog-tree-article-body">
            {loading ? (
              <SkeletonLoader />
            ) : (
              <MarkdownRenderer content={displayBlog.content} />
            )}
          </div>
        </article>
        <Footer />
      </div>
    </main>
  );
}
