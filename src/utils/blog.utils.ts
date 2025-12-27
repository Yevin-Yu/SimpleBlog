import type { BlogItem, BlogCategory } from '../types';
import { BLOG_CONFIG } from '../config';

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

/**
 * 判断分类是否有内容（博客或子分类）
 */
const hasContent = (category: BlogCategory): boolean => {
  return category.blogs.length > 0 || (category.children?.length ?? 0) > 0;
};

/**
 * 分类排序函数
 */
const sortCategories = (a: BlogCategory, b: BlogCategory): number => {
  const aHasContent = hasContent(a);
  const bHasContent = hasContent(b);
  if (aHasContent && !bHasContent) return -1;
  if (!aHasContent && bHasContent) return 1;
  return a.name.localeCompare(b.name, 'zh-CN');
};

/**
 * 按日期倒序排序博客
 */
const sortBlogsByDate = (a: BlogItem, b: BlogItem): number => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
};

/**
 * 将内部节点结构转换为分类结构
 */
function convertNodeToCategory(node: CategoryNode, defaultExpanded = false): BlogCategory {
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

