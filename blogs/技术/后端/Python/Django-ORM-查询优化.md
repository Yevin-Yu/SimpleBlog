---
title: Django ORM 查询优化
date: 2025-01-20
category: 技术/后端/Python
description: 探讨 Django ORM 查询优化的技巧和最佳实践
---

# Django ORM 查询优化

## 使用 select_related

对于外键关系，使用 `select_related` 可以减少数据库查询次数。

```python
# 避免 N+1 查询问题
# 不好的做法
users = User.objects.all()
for user in users:
    print(user.profile.bio)  # 每次循环都查询数据库

# 好的做法
users = User.objects.select_related('profile').all()
for user in users:
    print(user.profile.bio)  # 只查询一次
```

## 使用 prefetch_related

对于多对多或反向外键关系，使用 `prefetch_related`。

```python
# 不好的做法
articles = Article.objects.all()
for article in articles:
    print(article.tags.all())  # 每次循环都查询数据库

# 好的做法
articles = Article.objects.prefetch_related('tags').all()
for article in articles:
    print(article.tags.all())  # 只查询一次
```

## 使用 only 和 defer

只查询需要的字段，减少数据传输量。

```python
# 只查询需要的字段
users = User.objects.only('id', 'name', 'email')

# 排除不需要的字段
users = User.objects.defer('bio', 'avatar')
```

## 使用 values 和 values_list

当只需要部分字段时，使用 `values` 或 `values_list`。

```python
# 返回字典列表
users = User.objects.values('id', 'name')

# 返回元组列表
user_ids = User.objects.values_list('id', flat=True)
```

## 使用 exists 和 count

检查存在性和计数时，使用 `exists()` 和 `count()`。

```python
# 检查是否存在
if User.objects.filter(email=email).exists():
    # 处理逻辑

# 获取数量
count = User.objects.filter(active=True).count()
```

## 总结

ORM 查询优化是提高 Django 应用性能的关键，需要根据实际场景选择合适的优化策略。

