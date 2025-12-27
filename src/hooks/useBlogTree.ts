import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogList, getBlogContent } from '../utils/blog.service';
import { groupBlogsByCategory } from '../utils/blog.utils';
import { logger } from '../utils/logger';
import { ROUTES } from '../constants/routes';
import type { BlogCategory, SelectedBlog } from '../types';

interface UseBlogTreeReturn {
  categories: BlogCategory[];
  selectedBlog: SelectedBlog | null;
  loading: boolean;
  contentLoading: boolean;
  toggleCategory: (name: string) => void;
  handleBlogClick: (id: string) => void;
}

export function useBlogTree(): UseBlogTreeReturn {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<SelectedBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const loadingRef = useRef(false);

  const loadBlogs = useCallback(async () => {
    try {
      const blogList = await getBlogList();
      const categories = groupBlogsByCategory(blogList);
      setCategories(categories);
    } catch (error) {
      logger.error('加载博客列表失败', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBlogContent = useCallback(async (blogId: string) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setContentLoading(true);

    try {
      const [blogData, blogList] = await Promise.all([
        getBlogContent(blogId),
        getBlogList(),
      ]);

      const blogMeta = blogList.find((b) => b.id === blogId);
      if (!blogMeta) {
        logger.error(`博客元数据不存在: ${blogId}`);
        throw new Error(`博客元数据不存在: ${blogId}`);
      }

      const newBlog: SelectedBlog = {
        ...blogMeta,
        content: blogData.content,
      };

      await new Promise((resolve) => setTimeout(resolve, 200));
      
      setSelectedBlog(newBlog);
      requestAnimationFrame(() => {
        setContentLoading(false);
        loadingRef.current = false;
      });
    } catch (error) {
      logger.error('加载博客内容失败', error);
      setContentLoading(false);
      loadingRef.current = false;
    }
  }, []);

  /**
   * 递归切换分类展开状态
   */
  const toggleCategoryByPath = (
    categories: BlogCategory[],
    path: string,
    parentPath = ''
  ): BlogCategory[] => {
    return categories.map((cat) => {
      const currentPath = parentPath ? `${parentPath}/${cat.name}` : cat.name;
      
      if (currentPath === path) {
        return { ...cat, expanded: !cat.expanded };
      }
      
      if (cat.children && cat.children.length > 0) {
        const nextPath = `${currentPath}/`;
        if (path.startsWith(nextPath) || path === currentPath) {
          return {
            ...cat,
            children: toggleCategoryByPath(cat.children, path, currentPath),
          };
        }
      }
      
      return cat;
    });
  };

  const toggleCategory = useCallback((path: string) => {
    setCategories((prev) => toggleCategoryByPath(prev, path));
  }, []);

  const handleBlogClick = useCallback(
    (blogId: string) => {
      navigate(ROUTES.BLOG_DETAIL(blogId));
      loadBlogContent(blogId);
    },
    [navigate, loadBlogContent]
  );

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  useEffect(() => {
    if (id) {
      loadBlogContent(id);
    } else if (categories.length > 0) {
      const firstBlog = categories[0]?.blogs[0];
      if (firstBlog) {
        navigate(ROUTES.BLOG_DETAIL(firstBlog.id), { replace: true });
      }
    }
  }, [id, categories, navigate, loadBlogContent]);

  return {
    categories,
    selectedBlog,
    loading,
    contentLoading,
    toggleCategory,
    handleBlogClick,
  };
}
