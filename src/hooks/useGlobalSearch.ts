import { useEffect } from 'react';

/**
 * 全局搜索快捷键Hook
 * 监听Q键来触发搜索功能
 */
export function useGlobalSearch(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只响应单独的Q键，不响应在输入框中的按键
      if (
        event.key === 'q' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey
      ) {
        // 检查当前焦点是否在输入框、文本域或可编辑元素上
        const target = event.target as HTMLElement;
        const isInputFocused =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true';

        // 如果焦点不在输入框中，则打开搜索弹窗
        if (!isInputFocused) {
          event.preventDefault();
          onOpen();
        }
      }
    };

    // 添加全局键盘事件监听
    window.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpen]);
}
