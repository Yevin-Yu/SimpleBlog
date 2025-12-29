import { useMemo, useCallback, useState } from 'react';
import { LoadingLines } from '../LoadingLines';
import { BlogSearchModal } from '../BlogSearchModal';
import type { BlogCategory } from '../../types';
import './BlogTreeSidebar.css';

interface BlogTreeSidebarProps {
  categories: BlogCategory[];
  loading: boolean;
  selectedBlogId?: string;
  onToggleCategory: (path: string) => void;
  onBlogClick: (id: string) => void;
  visible?: boolean;
}

interface CategoryItemProps {
  category: BlogCategory;
  selectedBlogId?: string;
  onToggleCategory: (path: string) => void;
  onBlogClick: (id: string) => void;
  level?: number;
  path?: string;
}

function CategoryItem({
  category,
  selectedBlogId,
  onToggleCategory,
  onBlogClick,
  level = 0,
  path = '',
}: CategoryItemProps) {
  const currentPath = path ? `${path}/${category.name}` : category.name;
  const hasChildren = category.children && category.children.length > 0;
  const shouldShowToggle = hasChildren || category.blogs.length > 0;

  const isExpanded = useMemo(() => {
    if (level === 0 && !hasChildren && category.blogs.length > 0) {
      return true;
    }
    return category.expanded;
  }, [level, hasChildren, category.blogs.length, category.expanded]);

  const totalCount = useMemo(() => {
    const getTotalCount = (cat: BlogCategory): number => {
      let count = cat.blogs.length;
      if (cat.children) {
        count += cat.children.reduce((sum, child) => sum + getTotalCount(child), 0);
      }
      return count;
    };
    return getTotalCount(category);
  }, [category]);

  const handleToggle = useCallback(() => {
    onToggleCategory(currentPath);
  }, [onToggleCategory, currentPath]);

  const INDENT = {
    BASE: 16,
    STEP: 16,
    ITEM_BASE: 32,
  } as const;

  return (
    <div className={`blog-tree-category blog-tree-category-level-${level}`}>
      {shouldShowToggle && (
        <button
          className="blog-tree-category-header"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          style={{ paddingLeft: `${INDENT.BASE + level * INDENT.STEP}px` }}
        >
          <span className="blog-tree-category-icon">
            ▶
          </span>
          <span className="blog-tree-category-name">{category.name}</span>
          <span className="blog-tree-category-count">
            ({totalCount})
          </span>
        </button>
      )}
      <div className={`blog-tree-category-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div
          className={`blog-tree-category-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
        {category.blogs.map((blog) => (
          <div
            key={blog.id}
            className={`blog-tree-item ${selectedBlogId === blog.id ? 'active' : ''}`}
            onClick={() => onBlogClick(blog.id)}
            style={{ paddingLeft: `${INDENT.ITEM_BASE + level * INDENT.STEP}px` }}
          >
            <span className="blog-tree-item-title">{blog.title}</span>
          </div>
        ))}
        {hasChildren && category.children?.map((child) => (
          <CategoryItem
            key={child.name}
            category={child}
            selectedBlogId={selectedBlogId}
            onToggleCategory={onToggleCategory}
            onBlogClick={onBlogClick}
            level={level + 1}
            path={currentPath}
          />
        ))}
        </div>
      </div>
    </div>
  );
}

export function BlogTreeSidebar({
  categories,
  loading,
  selectedBlogId,
  onToggleCategory,
  onBlogClick,
  visible = true,
}: BlogTreeSidebarProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <>
      <aside className={`blog-tree-sidebar ${visible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        <div className="blog-tree-header">
          <div className="blog-tree-header-top">
            <h2 className="blog-tree-title">文章列表</h2>
            <button
              className="blog-tree-search-button"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="搜索文章"
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
          </div>
        </div>
        {loading ? (
          <div className="blog-tree-loading">
            <LoadingLines />
          </div>
        ) : (
          <nav className="blog-tree-nav">
            {categories.map((category) => (
              <CategoryItem
                key={category.name}
                category={category}
                selectedBlogId={selectedBlogId}
                onToggleCategory={onToggleCategory}
                onBlogClick={onBlogClick}
              />
            ))}
          </nav>
        )}
      </aside>
      <BlogSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onBlogClick={onBlogClick}
      />
    </>
  );
}
