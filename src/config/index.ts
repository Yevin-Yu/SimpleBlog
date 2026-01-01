/**
 * 站点配置
 */
export const SITE_CONFIG = {
  name: '耶温博客',
  description: '一个简约的个人博客网站，分享技术思考、生活感悟和知识总结',
  url: 'https://yuwb.cn',
  locale: 'zh_CN',
} as const;

/**
 * 基础路径
 */
export const BASE_PATH = '/b';

/**
 * 博客配置
 */
export const BLOG_CONFIG = {
  defaultCategory: '未分类',
  sidebarWidth: 240,
} as const;

/**
 * SEO 配置
 */
export const SEO_CONFIG = {
  defaultTitle: '耶温博客 - 记录思考，分享知识',
  defaultDescription: '一个现代化的个人博客网站，分享技术思考、生活感悟和知识总结。',
  defaultKeywords: '博客,耶温博客,技术博客,React,TypeScript,前端开发',
  defaultImage: '/og-image.jpg',
  favicon: '/icon.svg',
  themeColor: '#0a0a0a',
} as const;

export { ROUTES } from '../constants/routes';

