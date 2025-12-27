import { useMemo, useCallback } from 'react';
import { LoadingLines } from '../LoadingLines';
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

  /** 缩进基础值 */
  const INDENT_BASE = 16;
  /** 每级缩进增量 */
  const INDENT_STEP = 16;
  /** 博客项缩进基础值 */
  const ITEM_INDENT_BASE = 32;

  return (
    <div className={`blog-tree-category blog-tree-category-level-${level}`}>
      {shouldShowToggle && (
        <button
          className="blog-tree-category-header"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          style={{ paddingLeft: `${INDENT_BASE + level * INDENT_STEP}px` }}
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
            style={{ paddingLeft: `${ITEM_INDENT_BASE + level * INDENT_STEP}px` }}
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
  return (
    <aside className={`blog-tree-sidebar ${visible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      <div className="blog-tree-header">
        <h2 className="blog-tree-title">文章列表</h2>
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
  );
}
