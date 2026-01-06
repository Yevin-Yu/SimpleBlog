import { useState, useEffect, useCallback, memo } from 'react';
import { getBlogList } from '../../utils/blog.service';
import {
  groupBlogsByCategory,
  calculateTotalCount,
  toggleCategoryByPath,
} from '../../utils/blog.utils';
import { logger } from '../../utils/logger';
import type { BlogCategory } from '../../types';
import './BlogListDrawer.css';

interface BlogListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogClick: (id: string) => void;
  selectedBlogId?: string;
}

interface CategoryItemProps {
  category: BlogCategory;
  selectedBlogId?: string;
  onBlogClick: (id: string) => void;
  onToggleCategory: (name: string) => void;
  level?: number;
}

const INDENT_BASE = 16;
const INDENT_STEP = 16;
const INDENT_ITEM_BASE = 32;

function CategoryItem({
  category,
  selectedBlogId,
  onBlogClick,
  onToggleCategory,
  level = 0,
}: CategoryItemProps) {
  const isExpanded = category.expanded ?? false;
  const hasChildren = category.children && category.children.length > 0;

  const totalCount = useCallback(() => calculateTotalCount(category), [category]);

  const headerPaddingLeft = INDENT_BASE + level * INDENT_STEP;
  const itemPaddingLeft = INDENT_ITEM_BASE + level * INDENT_STEP;

  return (
    <div className="blog-list-drawer-category">
      <button
        className="blog-list-drawer-category-header"
        onClick={() => onToggleCategory(category.name)}
        aria-expanded={isExpanded}
        style={{ paddingLeft: headerPaddingLeft }}
      >
        <span className="blog-list-drawer-category-icon">▶</span>
        <span className="blog-list-drawer-category-name">{category.name}</span>
        <span className="blog-list-drawer-category-count">({totalCount()})</span>
      </button>
      <div className={`blog-list-drawer-category-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div
          className={`blog-list-drawer-category-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
          {category.blogs.map((blog) => (
            <div
              key={blog.id}
              className={`blog-list-drawer-item ${selectedBlogId === blog.id ? 'active' : ''}`}
              onClick={() => onBlogClick(blog.id)}
              style={{ paddingLeft: itemPaddingLeft }}
            >
              <span className="blog-list-drawer-item-title">{blog.title}</span>
              {blog.date && <span className="blog-list-drawer-item-date">{blog.date}</span>}
            </div>
          ))}
          {hasChildren &&
            category.children?.map((child) => (
              <MemoizedCategoryItem
                key={child.name}
                category={child}
                selectedBlogId={selectedBlogId}
                onBlogClick={onBlogClick}
                onToggleCategory={onToggleCategory}
                level={level + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

const MemoizedCategoryItem = memo(CategoryItem);

export function BlogListDrawer({
  isOpen,
  onClose,
  onBlogClick,
  selectedBlogId,
}: BlogListDrawerProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const loadBlogs = async () => {
        try {
          setLoading(true);
          const blogList = await getBlogList();
          const categories = groupBlogsByCategory(blogList);
          setCategories(categories);
        } catch (error) {
          logger.error('加载博客列表失败', error);
        } finally {
          setLoading(false);
        }
      };
      loadBlogs();
    }
  }, [isOpen]);

  const handleToggleCategory = useCallback((name: string) => {
    setCategories((prev) => toggleCategoryByPath(prev, name));
  }, []);

  const handleBlogClickWithClose = useCallback(
    (id: string) => {
      onBlogClick(id);
      onClose();
    },
    [onBlogClick, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="blog-list-drawer-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="blog-list-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="blog-list-drawer-header">
          <h3 className="blog-list-drawer-title">文章列表</h3>
          <button className="blog-list-drawer-close" onClick={onClose} aria-label="关闭列表">
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
        <div className="blog-list-drawer-content">
          {loading ? (
            <div className="blog-list-drawer-loading">加载中...</div>
          ) : categories.length > 0 ? (
            <div className="blog-list-drawer-nav">
              {categories.map((category) => (
                <MemoizedCategoryItem
                  key={category.name}
                  category={category}
                  selectedBlogId={selectedBlogId}
                  onBlogClick={handleBlogClickWithClose}
                  onToggleCategory={handleToggleCategory}
                />
              ))}
            </div>
          ) : (
            <div className="blog-list-drawer-empty">暂无文章</div>
          )}
        </div>
      </div>
    </div>
  );
}
