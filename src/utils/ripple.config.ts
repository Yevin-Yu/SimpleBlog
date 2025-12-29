export const RIPPLE_CONFIG = {
  /** 随机涟漪生成间隔（毫秒） */
  GENERATION_INTERVAL: { min: 400, max: 1000 },
  /** 基础最大半径（相对于画布尺寸的比例） */
  BASE_MAX_RADIUS_RATIO: 0.15,
  /** 初始半径范围 */
  INITIAL_RADIUS: { min: 3, max: 11 },
  /** 生命周期范围 */
  LIFETIME: { min: 200, max: 350 },
  /** 基础速度范围 */
  BASE_SPEED: { min: 0.5, max: 0.9 },
  /** 透明度范围 */
  OPACITY: { min: 0.06, max: 0.14 },
  /** 强度阈值 */
  INTENSITY_THRESHOLDS: {
    small: 0.3,
    medium: 0.6,
  },
  /** 波纹数量配置 */
  WAVE_COUNT: {
    small: 2,
    medium: 2,
    large: 3,
  },
} as const;

export const RIPPLE_SIZE_MULTIPLIERS = {
  small: { min: 0.2, max: 0.5 },
  medium: { min: 0.5, max: 0.7 },
  large: { min: 0.7, max: 1.0 },
} as const;

