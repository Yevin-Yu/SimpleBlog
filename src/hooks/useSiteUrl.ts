import { useMemo } from 'react';
import { SITE_CONFIG } from '../config';

export function useSiteUrl(): string {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return SITE_CONFIG.url;
    }
    return window.location.origin;
  }, []);
}
