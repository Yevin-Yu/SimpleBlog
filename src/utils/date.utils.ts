/**
 * 日期工具函数
 */

/**
 * 验证日期字符串是否有效
 * @param dateString - 日期字符串 (YYYY-MM-DD 或 ISO 8601 格式)
 * @returns 是否为有效日期
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);

  // 检查是否为无效日期
  if (isNaN(date.getTime())) {
    return false;
  }

  // 检查日期是否在合理范围内（1900-2100年）
  const year = date.getFullYear();
  if (year < 1900 || year > 2100) {
    return false;
  }

  return true;
}

/**
 * 解析日期字符串
 * @param dateString - 日期字符串
 * @param fallback - 失败时的回退值
 * @returns Date 对象或 fallback
 */
export function parseSafeDate(dateString: string, fallback: Date = new Date()): Date {
  if (!isValidDateString(dateString)) {
    return fallback;
  }

  return new Date(dateString);
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param date - Date 对象
 * @returns 格式化的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 获取日期的时间戳（毫秒）
 * @param dateString - 日期字符串
 * @returns 时间戳，如果日期无效则返回 0
 */
export function getDateTimestamp(dateString: string): number {
  if (!isValidDateString(dateString)) {
    return 0;
  }

  return new Date(dateString).getTime();
}
