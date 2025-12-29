import { SITE_CONFIG, BASE_PATH } from '../config';

/**
 * 获取站点完整 URL 的 Hook
 */
export function useSiteUrl(): string {
  if (typeof window === 'undefined') {
    return `${SITE_CONFIG.url}${BASE_PATH}`;
  }
  return `${window.location.origin}${BASE_PATH}`;
}
