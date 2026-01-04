import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { getAllBlogsForSearch } from '../../utils/blog.service';
import type { BlogSearchItem } from '../../types';
import { logger } from '../../utils/logger';
import { PERFORMANCE_CONSTANTS } from '../../constants/performance';
import './BlogSearchModal.css';

interface BlogSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogClick: (id: string) => void;
}

export function BlogSearchModal({ isOpen, onClose, onBlogClick }: BlogSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allBlogs, setAllBlogs] = useState<BlogSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllBlogsForSearch()
        .then((blogs) => {
          setAllBlogs(blogs);
          setLoading(false);
        })
        .catch((error) => {
          logger.error('加载博客列表失败', error);
          setLoading(false);
        });

      setTimeout(() => {
        inputRef.current?.focus();
      }, PERFORMANCE_CONSTANTS.SEARCH_FOCUS_DELAY);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.trim().toLowerCase();
    return allBlogs.filter((blog) => {
      const titleMatch = blog.title.toLowerCase().includes(query);
      const descriptionMatch = blog.description?.toLowerCase().includes(query) ?? false;
      const tagsMatch = blog.tags?.some(tag => tag.toLowerCase().includes(query)) ?? false;
      return titleMatch || descriptionMatch || tagsMatch;
    });
  }, [allBlogs, searchQuery]);

  const handleBlogClick = useCallback((blogId: string) => {
    onBlogClick(blogId);
    onClose();
  }, [onBlogClick, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="blog-search-modal-overlay">
      <div className="blog-search-modal">
        <div className="blog-search-modal-header">
          <h3 className="blog-search-modal-title">搜索文章</h3>
          <button
            className="blog-search-modal-close"
            onClick={onClose}
            aria-label="关闭搜索"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="blog-search-modal-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="blog-search-modal-input"
            placeholder="输入关键词搜索标题、简介或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.slice(0, PERFORMANCE_CONSTANTS.SEARCH_MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={PERFORMANCE_CONSTANTS.SEARCH_MAX_LENGTH}
          />
        </div>
        <div className="blog-search-modal-results">
          {loading ? (
            <div className="blog-search-modal-loading">加载中...</div>
          ) : searchQuery.trim() ? (
            filteredBlogs.length > 0 ? (
              <ul className="blog-search-modal-list">
                {filteredBlogs.map((blog) => (
                  <li
                    key={blog.id}
                    className="blog-search-modal-item"
                    onClick={() => handleBlogClick(blog.id)}
                  >
                    <div className="blog-search-modal-item-header">
                      <div className="blog-search-modal-item-title">{blog.title}</div>
                      <div className="blog-search-modal-item-meta">
                        {blog.category && (
                          <span className="blog-search-modal-item-category">{blog.category}</span>
                        )}
                        {blog.date && (
                          <span className="blog-search-modal-item-date">{blog.date}</span>
                        )}
                      </div>
                    </div>
                    {blog.description && (
                      <div className="blog-search-modal-item-description">
                        {blog.description}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="blog-search-modal-empty">未找到匹配的文章</div>
            )
          ) : (
            <div className="blog-search-modal-empty">请输入关键词进行搜索</div>
          )}
        </div>
      </div>
    </div>
  );
}
