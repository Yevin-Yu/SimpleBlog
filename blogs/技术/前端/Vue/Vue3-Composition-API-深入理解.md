---
title: Vue3 Composition API 深入理解
date: 2025-01-17
category: 技术/前端/Vue
description: 深入理解 Vue3 Composition API 的设计理念和使用方法
---

# Vue3 Composition API 深入理解

## 什么是 Composition API

Composition API 是 Vue3 引入的新特性，它提供了一种更灵活的方式来组织组件逻辑。

## 基本用法

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

const increment = () => {
  count.value++
}

onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

## 组合式函数

可以将逻辑抽取为可复用的组合式函数。

```js
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return { count, increment, decrement, reset }
}
```

## 生命周期钩子

Composition API 提供了对应的生命周期钩子。

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('mounted')
})

onUpdated(() => {
  console.log('updated')
})

onUnmounted(() => {
  console.log('unmounted')
})
```

## 总结

Composition API 让组件逻辑更加清晰和可复用，是 Vue3 的重要特性之一。

