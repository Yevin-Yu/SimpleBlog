import type { BlogItem, BlogCategory } from '../types';
import { BLOG_CONFIG } from '../config';

/**
 * 分类树节点（内部使用）
 */
interface CategoryNode {
  name: string;
  blogs: BlogItem[];
  children: Map<string, CategoryNode>;
}

/**
 * 构建分类树结构
 */
const buildCategoryTree = (blogs: BlogItem[]): CategoryNode => {
  const root: CategoryNode = {
    name: '',
    blogs: [],
    children: new Map(),
  };

  for (const blog of blogs) {
    const categoryPath = blog.category || BLOG_CONFIG.defaultCategory;
    const pathParts = categoryPath.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      root.blogs.push(blog);
      continue;
    }

    let current = root;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLeaf = i === pathParts.length - 1;

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          blogs: [],
          children: new Map(),
        });
      }

      const childNode = current.children.get(part);
      if (!childNode) continue;

      current = childNode;

      if (isLeaf) {
        current.blogs.push(blog);
      }
    }
  }

  return root;
};

const hasContent = (category: BlogCategory): boolean => {
  return category.blogs.length > 0 || (category.children?.length ?? 0) > 0;
};

const sortCategories = (a: BlogCategory, b: BlogCategory): number => {
  const aHasContent = hasContent(a);
  const bHasContent = hasContent(b);
  if (aHasContent && !bHasContent) return -1;
  if (!aHasContent && bHasContent) return 1;
  return a.name.localeCompare(b.name, 'zh-CN');
};

const sortBlogsByDate = (a: BlogItem, b: BlogItem): number => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
};

/**
 * 将节点转换为分类对象
 */
const convertNodeToCategory = (node: CategoryNode, defaultExpanded = false): BlogCategory => {
  const children: BlogCategory[] = Array.from(node.children.values())
    .map((child) => convertNodeToCategory(child, false))
    .sort(sortCategories);

  const category: BlogCategory = {
    name: node.name,
    blogs: node.blogs.sort(sortBlogsByDate),
    expanded: defaultExpanded,
  };

  if (children.length > 0) {
    category.children = children;
  }

  return category;
}

/**
 * 将博客列表按分类分组
 */
export function groupBlogsByCategory(blogs: BlogItem[]): BlogCategory[] {
  const root = buildCategoryTree(blogs);
  
  const categories: BlogCategory[] = [];
  
  if (root.blogs.length > 0) {
    categories.push({
      name: BLOG_CONFIG.defaultCategory,
      blogs: root.blogs.sort(sortBlogsByDate),
      expanded: true,
    });
  }

  const childCategories = Array.from(root.children.values())
    .map((child) => convertNodeToCategory(child, categories.length === 0))
    .sort(sortCategories);

  categories.push(...childCategories);

  return categories;
}

