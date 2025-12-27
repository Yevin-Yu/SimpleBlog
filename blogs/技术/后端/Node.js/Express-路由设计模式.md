---
title: Express 路由设计模式
date: 2025-01-19
category: 技术/后端/Node.js
description: 介绍 Express 框架中路由设计的最佳实践和常见模式
id: 3tlvqxfm
---
# Express 路由设计模式

## 路由分离

将路由逻辑分离到不同的文件中，保持代码组织清晰。

```js
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
```

## 中间件使用

使用中间件处理通用逻辑。

```js
// 认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // 验证 token
  next();
};

// 使用中间件
router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});
```

## 错误处理

统一处理路由错误。

```js
// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

app.use(errorHandler);
```

## RESTful 设计

遵循 RESTful API 设计原则。

```js
// GET    /api/users        - 获取所有用户
// GET    /api/users/:id    - 获取单个用户
// POST   /api/users        - 创建用户
// PUT    /api/users/:id    - 更新用户
// DELETE /api/users/:id    - 删除用户
```

## 总结

良好的路由设计能够使 API 更加清晰和易于维护。

