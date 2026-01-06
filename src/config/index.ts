export const SITE_CONFIG = {
  name: '耶温博客',
  description: '一个简约的个人博客网站，分享技术思考、生活感悟和知识总结',
  url: 'https://blog.yuwb.cn',
  locale: 'zh_CN',
} as const;

export const BASE_PATH = '/';

export const BLOG_CONFIG = {
  defaultCategory: '未分类',
  sidebarWidth: 240,
  defaultBlogId: '9byt3r60',
} as const;

export const SEO_CONFIG = {
  defaultTitle: '耶温博客 - 记录思考，分享知识',
  defaultDescription: '一个现代化的个人博客网站，分享技术思考、生活感悟和知识总结。',
  defaultKeywords: '博客,耶温博客,技术博客,React,TypeScript,前端开发',
  defaultImage: '/icon.svg',
  favicon: '/icon.svg',
  themeColor: '#fafafa',
} as const;

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: (id: string) => `/${id}`,
  ERROR: '/error',
} as const;
