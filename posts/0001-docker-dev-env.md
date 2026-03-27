---
title: 用 Docker 搭建开发环境
date: 2026-03-27
excerpt: Docker 让开发环境配置变得简单，本文介绍如何用 Docker Compose 搭建全栈开发环境。
category: 技术向
tags: Docker, DevOps, 后端
cover: https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop
---

在团队协作中，环境一致性是困扰很多开发者的问题。

## 为什么选择 Docker？

Docker 容器化技术让我们可以将应用和运行环境打包在一起。

## Docker Compose 实战

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
```

> Docker 让"在我电脑上能跑"成为历史。
