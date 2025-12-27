---
title: React 性能优化技巧
date: 2025-01-16
category: 技术/前端/React
description: 分享 React 应用性能优化的实用技巧和最佳实践
id: tnt6gduo
---
# React 性能优化技巧

## 使用 React.memo 优化组件渲染

`React.memo` 可以防止组件在 props 未变化时重新渲染。

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  // 复杂计算
  return <div>{/* ... */}</div>;
});
```

## 使用 useMemo 缓存计算结果

对于昂贵的计算，使用 `useMemo` 可以避免重复计算。

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

## 使用 useCallback 缓存函数

避免在每次渲染时创建新的函数引用。

```tsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## 代码分割

使用 React.lazy 和 Suspense 实现代码分割。

```tsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 虚拟列表

对于长列表，使用虚拟滚动技术。

```tsx
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
  >
    {({ index, style }) => (
      <div style={style}>{items[index]}</div>
    )}
  </FixedSizeList>
);
```

## 总结

性能优化是一个持续的过程，需要根据实际场景选择合适的优化策略。

