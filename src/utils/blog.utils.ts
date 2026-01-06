/** 博客工具 - 分类管理、排序 */

import type { BlogItem, BlogCategory, CategoryNode } from '../types';
import { BLOG_CONFIG } from '../config';

const sortBlogsByDate = (a: BlogItem, b: BlogItem): number => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
  const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
  return timeB - timeA;
};

const buildCategoryTree = (blogs: BlogItem[]): CategoryNode => {
  const root: CategoryNode = { name: '', blogs: [], children: new Map() };

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
        current.children.set(part, { name: part, blogs: [], children: new Map() });
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

const hasAnyContent = (category: BlogCategory): boolean => {
  return category.blogs.length > 0 || (category.children?.length ?? 0) > 0;
};

const sortCategories = (a: BlogCategory, b: BlogCategory): number => {
  const aHasContent = hasAnyContent(a);
  const bHasContent = hasAnyContent(b);
  if (aHasContent && !bHasContent) return -1;
  if (!aHasContent && bHasContent) return 1;
  return a.name.localeCompare(b.name, 'zh-CN');
};

const convertNodeToCategory = (
  node: CategoryNode,
  expandedPaths: Set<string>,
  currentPath: string = ''
): BlogCategory => {
  const shouldExpand = expandedPaths.has(currentPath);

  const children: BlogCategory[] = Array.from(node.children.entries())
    .map(([name, childNode]: [string, CategoryNode]) => {
      const childPath = currentPath ? `${currentPath}/${name}` : name;
      return convertNodeToCategory(childNode, expandedPaths, childPath);
    })
    .sort(sortCategories);

  const category: BlogCategory = {
    name: node.name,
    blogs: node.blogs.sort(sortBlogsByDate),
    expanded: shouldExpand,
  };

  if (children.length > 0) {
    category.children = children;
  }

  return category;
};

export function groupBlogsByCategory(blogs: BlogItem[]): BlogCategory[] {
  const root = buildCategoryTree(blogs);

  const expandedPaths = new Set<string>();
  if (root.children.has('耶温')) {
    expandedPaths.add('耶温');
  }

  const categories: BlogCategory[] = [];

  if (root.blogs.length > 0) {
    categories.push({
      name: BLOG_CONFIG.defaultCategory,
      blogs: root.blogs.sort(sortBlogsByDate),
      expanded: false,
    });
  }

  const childCategories = Array.from(root.children.entries())
    .map(([name, childNode]: [string, CategoryNode]) =>
      convertNodeToCategory(childNode, expandedPaths, name)
    )
    .sort(sortCategories);

  categories.push(...childCategories);

  return categories;
}

export function calculateTotalCount(category: BlogCategory): number {
  let count = category.blogs.length;
  if (category.children) {
    count += category.children.reduce((sum, child) => sum + calculateTotalCount(child), 0);
  }
  return count;
}

export function toggleCategoryByPath(
  categories: BlogCategory[],
  targetName: string
): BlogCategory[] {
  return categories.map((cat) => {
    if (cat.name === targetName) {
      return { ...cat, expanded: !cat.expanded };
    }

    if (cat.children?.length) {
      return { ...cat, children: toggleCategoryByPath(cat.children, targetName) };
    }

    return cat;
  });
}
