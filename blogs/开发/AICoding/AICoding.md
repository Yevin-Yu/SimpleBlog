---
title: AICoding 使用与推荐
date: 2026-01-03
category: 开发/AICoding
id: s8u9yp4g
description: 介绍如何使用AI模型进行开发以及推荐一些好用的AI模型。
tags:
  - AICoding
  - Vibe Coding
  - GLM
  - Cursor
  - Claude Code
  - AI模型
---

分享两个我常用的AI开发工具。

## Cursor

我的主力开发工具，基于VS Code的AI编辑器。

最大的优点是能理解整个项目结构，跨文件修改很准确。前端开发可以直接在编辑器里预览和修改UI，这个体验确实好用。

缺点是有点贵，Pro版本要$20/月。

官网：[https://www.cursor.so/](https://www.cursor.so/)

## Claude Code + GLM

一个低成本的替代方案。Claude Code是命令行工具，配合智谱GLM使用。

**优势：**
- GLM费用较低，最低套餐每5小时刷新额度
- 命令行操作，不用切窗口
- 中文理解能力强

**劣势：**
- 最低套餐有使用限制，如果同时开多个项目，额度不够用
- 需要配置API密钥，比Cursor麻烦
- 没有图形界面，需要适应命令行

### 配置方法

先安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

然后使用配置工具配置 GLM：

```bash
npx @z_ai/coding-helper
```

会引导你配置GLM的API密钥和MCP服务。API密钥在[智谱AI开放平台](https://open.bigmodel.cn/)获取。

### 基本使用

配置完成后，在项目目录直接使用：

```bash
claude
```

## 其他选择

看到别人推荐的，但我没有使用过：

- [MiniMax Code](https://www.minimaxi.com/)
- [Kimi Code](https://www.kimi.com/code)

## 相关链接

- [Cursor官网](https://www.cursor.so/)
- [Claude Code文档](https://docs.anthropic.com/en/docs/claude-code/overview)
- [智谱AI开放平台](https://open.bigmodel.cn/)
- [GLM API文档](https://open.bigmodel.cn/dev/api)

---

以上内容仅供参考。找到适合自己的最重要。
