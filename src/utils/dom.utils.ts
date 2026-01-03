/**
 * DOM 操作工具函数
 * 提供滚动条宽度计算、元素宽度固定等实用功能
 */

/**
 * 获取浏览器滚动条宽度
 */
export function getScrollbarWidth(): number {
  const outer = document.createElement('div');
  outer.style.cssText = 'visibility:hidden;overflow:scroll;width:100px;height:100px;position:absolute;top:-9999px';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '100%';
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  document.body.removeChild(outer);

  return scrollbarWidth || 17;
}

/**
 * 固定元素宽度，防止布局抖动
 */
export function fixElementWidth(element: HTMLElement | null): string | null {
  if (!element) return null;
  const width = `${element.offsetWidth}px`;
  element.style.width = width;
  element.style.minWidth = width;
  element.style.maxWidth = width;
  return width;
}

/**
 * 恢复元素宽度
 */
export function restoreElementWidth(element: HTMLElement | null): void {
  if (!element) return;
  element.style.width = '';
  element.style.minWidth = '';
  element.style.maxWidth = '';
}

/**
 * 批量固定元素宽度
 */
export function fixElementsWidth(elements: (HTMLElement | null)[]): Array<string | null> {
  return elements.map(fixElementWidth);
}

/**
 * 批量恢复元素宽度
 */
export function restoreElementsWidth(elements: (HTMLElement | null)[]): void {
  elements.forEach(restoreElementWidth);
}

