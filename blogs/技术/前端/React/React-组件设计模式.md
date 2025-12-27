---
title: React 组件设计模式
date: 2025-01-15
category: 技术/前端/React
description: 深入探讨 React 组件设计的最佳实践和常见模式
id: xn6ayng3
---
# React 组件设计模式

## 引言

在 React 开发中，良好的组件设计模式能够提高代码的可维护性和可复用性。本文将介绍几种常见的组件设计模式。

## 容器组件与展示组件模式

容器组件负责数据获取和状态管理，展示组件负责 UI 渲染。

```tsx
// 容器组件
const UserContainer = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  
  return <UserDisplay user={user} />;
};

// 展示组件
const UserDisplay = ({ user }) => {
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
};
```

## 高阶组件模式

高阶组件（HOC）是一种复用组件逻辑的方式。

```tsx
const withLoading = (Component) => {
  return (props) => {
    if (props.loading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
};
```

## 渲染属性模式

通过 render prop 共享组件逻辑。

```tsx
const DataFetcher = ({ render }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return render(data);
};
```

## 总结

选择合适的组件设计模式能够使代码更加清晰和可维护。在实际开发中，应该根据具体场景选择最合适的模式。

