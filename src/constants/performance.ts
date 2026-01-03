/**
 * 性能相关常量
 */
export const PERFORMANCE_CONSTANTS = {
  /** 最短加载时间，防止闪烁 */
  MIN_LOADING_TIME: 500,
  /** 搜索输入框聚焦延迟 */
  SEARCH_FOCUS_DELAY: 100,
  /** 文章切换淡出动画时长 */
  FADE_OUT_DURATION: 150,
  /** 宽度恢复延迟 */
  WIDTH_RESTORE_DELAY: 200,
  /** 搜索框最大输入长度 */
  SEARCH_MAX_LENGTH: 100,
} as const;

/**
 * 贡献图相关常量
 */
export const CONTRIBUTION_CONFIG = {
  /** 显示天数 */
  DAYS_IN_MONTH: 30,
  /** 提示框垂直偏移 */
  TOOLTIP_OFFSET_Y: 60,
  /** 贡献级别阈值 */
  LEVEL_THRESHOLDS: [0, 1, 3, 5] as const,
} as const;

/**
 * 贡献级别枚举
 */
export const CONTRIBUTION_LEVELS = {
  EMPTY: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
} as const;
