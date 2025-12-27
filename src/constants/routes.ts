export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: (id: string) => `/blog/${id}`,
} as const;

