/**
 * 应用路由配置
 */
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: (id: string) => `/${id}`,
  ERROR: '/error',
} as const;

