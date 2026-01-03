/**
 * 博客树侧边栏组件
 * 显示博客分类目录，支持展开/折叠分类，集成搜索功能
 */

import { useMemo, useCallback, useState, memo } from 'react';
import { LoadingLines } from '../LoadingLines/LoadingLines';
import { BlogSearchModal } from '../BlogSearchModal/BlogSearchModal';
import { SearchIcon } from './icons';
import { LAYOUT_CONSTANTS } from '../../constants/layout';
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
  const isExpanded = category.expanded ?? false;

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

  const { INDENT } = LAYOUT_CONSTANTS;

  return (
    <div className={`blog-tree-category blog-tree-category-level-${level}`}>
      {shouldShowToggle && (
        <button
          className="blog-tree-category-header"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          style={{ paddingLeft: `${INDENT.BASE + level * INDENT.STEP}px` }}
        >
          <span className="blog-tree-category-icon">▶</span>
          <span className="blog-tree-category-name">{category.name}</span>
          <span className="blog-tree-category-count">({totalCount})</span>
        </button>
      )}
      <div className={`blog-tree-category-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div className={`blog-tree-category-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
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
          {hasChildren &&
            category.children?.map((child) => (
              <MemoizedCategoryItem
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

const arePropsEqual = (
  prevProps: CategoryItemProps,
  nextProps: CategoryItemProps
): boolean => {
  return (
    prevProps.category === nextProps.category &&
    prevProps.selectedBlogId === nextProps.selectedBlogId &&
    prevProps.level === nextProps.level &&
    prevProps.path === nextProps.path
  );
};

const MemoizedCategoryItem = memo(CategoryItem, arePropsEqual);

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
              <SearchIcon />
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
              <MemoizedCategoryItem
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
