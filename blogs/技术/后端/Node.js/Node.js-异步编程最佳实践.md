---
title: Node.js 异步编程最佳实践
date: 2025-01-18
category: 技术/后端/Node.js
description: 探讨 Node.js 中异步编程的最佳实践和常见陷阱
id: 5idgji60
---
# Node.js 异步编程最佳实践

## 使用 async/await

优先使用 async/await 而不是回调函数或 Promise.then()。

```js
// 好的做法
async function fetchUser(id) {
  try {
    const user = await db.users.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// 避免的做法
function fetchUser(id, callback) {
  db.users.findById(id, (err, user) => {
    if (err) {
      callback(err);
    } else {
      callback(null, user);
    }
  });
}
```

## 错误处理

始终正确处理异步操作的错误。

```js
async function processData() {
  try {
    const data = await fetchData();
    const processed = await processData(data);
    return processed;
  } catch (error) {
    logger.error('Processing failed:', error);
    throw error;
  }
}
```

## 并发控制

使用 Promise.all 进行并发操作，但要控制并发数量。

```js
// 并发执行
const results = await Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3),
]);

// 控制并发数量
import pLimit from 'p-limit';

const limit = pLimit(3);
const results = await Promise.all(
  users.map(user => limit(() => processUser(user)))
);
```

## 避免回调地狱

使用 async/await 可以避免回调地狱。

```js
// 避免
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // 回调地狱
    });
  });
});

// 推荐
const user = await getUser(id);
const posts = await getPosts(user.id);
const comments = await getComments(posts[0].id);
```

## 总结

良好的异步编程实践能够提高代码的可读性和可维护性。

