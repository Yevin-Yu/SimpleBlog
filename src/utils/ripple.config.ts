/**
 * 墨水涟漪效果配置
 * 用于背景动画的参数设置
 */

export const RIPPLE_CONFIG = {
  /** 随机涟漪生成间隔（毫秒） */
  GENERATION_INTERVAL: { min: 600, max: 1500 },
  /** 基础最大半径（相对于画布尺寸的比例） */
  BASE_MAX_RADIUS_RATIO: 0.18,
  /** 初始半径范围 */
  INITIAL_RADIUS: { min: 2, max: 8 },
  /** 生命周期范围 */
  LIFETIME: { min: 280, max: 420 },
  /** 基础速度范围 */
  BASE_SPEED: { min: 0.4, max: 0.7 },
  /** 透明度范围 */
  OPACITY: { min: 0.08, max: 0.18 },
  /** 强度阈值 */
  INTENSITY_THRESHOLDS: {
    small: 0.3,
    medium: 0.6,
  },
  /** 波纹数量配置 */
  WAVE_COUNT: {
    small: 2,
    medium: 3,
    large: 4,
  },
  /** 鼠标移动涟漪配置 */
  MOUSE_MOVE: {
    enabled: true,
    minDistance: 80,
    intensity: 0.2,
    maxCount: 8,
  },
  /** 高光配置 */
  HIGHLIGHT: {
    enabled: true,
    opacity: 0.12,
    offset: 0.15,
  },
} as const;

export const RIPPLE_SIZE_MULTIPLIERS = {
  small: { min: 0.2, max: 0.5 },
  medium: { min: 0.5, max: 0.7 },
  large: { min: 0.7, max: 1.0 },
} as const;

