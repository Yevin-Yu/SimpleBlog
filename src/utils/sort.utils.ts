import type { BlogItem } from '../types';

/**
 * 按日期排序博客（最新的在前）
 */
export const sortBlogsByDate = (a: BlogItem, b: BlogItem): number => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
  const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
  return timeB - timeA;
};
