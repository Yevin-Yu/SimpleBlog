import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogList, getBlogContent } from '../utils/blog.service';
import { groupBlogsByCategory } from '../utils/blog.utils';
import { logger } from '../utils/logger';
import { ROUTES } from '../constants/routes';
import { PERFORMANCE_CONSTANTS } from '../constants/performance';
import { BLOG_CONFIG } from '../config';
import type { BlogCategory, SelectedBlog, BlogItem } from '../types';

interface UseBlogTreeReturn {
  categories: BlogCategory[];
  selectedBlog: SelectedBlog | null;
  loading: boolean;
  contentLoading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const selectedBlogRef = useRef<SelectedBlog | null>(null);
  const categoriesInitializedRef = useRef(false);

  const loadBlogs = useCallback(async () => {
    try {
      const blogList = await getBlogList();
      const categories = groupBlogsByCategory(blogList);
      setCategories(categories);
      categoriesInitializedRef.current = true;
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

    const startTime = Date.now();

    try {
      const [blogData, blogList] = await Promise.all([
        getBlogContent(blogId),
        getBlogList(),
      ]);

      const blogMeta = blogList.find((b) => b.id === blogId);
      if (!blogMeta) {
        throw new Error(`博客元数据不存在: ${blogId}`);
      }

      const newBlog: SelectedBlog = {
        ...blogMeta,
        content: blogData.content,
      };

      const prevBlog = selectedBlogRef.current;
      const isSameBlog =
        prevBlog?.id === newBlog.id &&
        prevBlog?.title === newBlog.title &&
        prevBlog?.content === newBlog.content;

      if (!isSameBlog) {
        setSelectedBlog(newBlog);
        selectedBlogRef.current = newBlog;
      }

      // 确保至少显示加载动画
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, PERFORMANCE_CONSTANTS.MIN_LOADING_TIME - elapsedTime);

      await new Promise(resolve => setTimeout(resolve, remainingTime));

      requestAnimationFrame(() => {
        setContentLoading(false);
        loadingRef.current = false;
      });
    } catch (err) {
      logger.error('加载博客内容失败', err);
      setError('文章不存在或已被删除');
      setContentLoading(false);
      loadingRef.current = false;
      setSelectedBlog(null);
    }
  }, []);

  const toggleCategoryByPath = useCallback((
    categories: BlogCategory[],
    path: string,
    parentPath = ''
  ): BlogCategory[] => {
    return categories.map((cat) => {
      const currentPath = parentPath ? `${parentPath}/${cat.name}` : cat.name;
      
      if (currentPath === path) {
        return { ...cat, expanded: !cat.expanded };
      }
      
      if (cat.children?.length) {
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
  }, []);

  const toggleCategory = useCallback((path: string) => {
    setCategories((prev) => toggleCategoryByPath(prev, path));
  }, []);

  const handleBlogClick = useCallback(
    (blogId: string) => {
      if (selectedBlogRef.current?.id === blogId) return;
      navigate(ROUTES.BLOG_DETAIL(blogId));
      loadBlogContent(blogId);
    },
    [navigate, loadBlogContent]
  );

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // 监听 URL id 参数变化来加载文章内容
  useEffect(() => {
    if (id) {
      setError(null);
      loadBlogContent(id);
    }
  }, [id, loadBlogContent]);

  // 在 categories 首次加载完成且没有 id 参数时，导航到默认文章
  useEffect(() => {
    if (!id && categoriesInitializedRef.current && categories.length > 0) {
      const findBlogById = (cats: typeof categories, targetId: string): BlogItem | null => {
        for (const cat of cats) {
          const blog = cat.blogs.find((b) => b.id === targetId);
          if (blog) return blog;
          if (cat.children) {
            const found = findBlogById(cat.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const defaultBlog = findBlogById(categories, BLOG_CONFIG.defaultBlogId);
      const targetBlog = defaultBlog || categories[0]?.blogs[0];
      if (targetBlog) {
        navigate(ROUTES.BLOG_DETAIL(targetBlog.id), { replace: true });
      }

      // 标记已处理，防止 categories 更新时重复触发
      categoriesInitializedRef.current = false;
    }
  }, [id, categories, navigate]);

  return useMemo(
    () => ({
      categories,
      selectedBlog,
      loading,
      contentLoading,
      error,
      toggleCategory,
      handleBlogClick,
    }),
    [categories, selectedBlog, loading, contentLoading, error, toggleCategory, handleBlogClick]
  );
}
