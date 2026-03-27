// 博客文章数据
const posts = [
  {
    id: 1,
    title: "深入理解 JavaScript 异步编程 —— 从回调到 async/await",
    excerpt: "JavaScript 的异步编程模型是前端开发中最核心的概念之一。从最早的回调函数，到 Promise 的链式调用，再到 async/await 的优雅语法糖，异步编程的演进反映了开发者对代码可读性和可维护性的不断追求。本文将深入探讨每种模式的原理与最佳实践...",
    date: "2026-03-15",
    category: "技术向",
    tags: ["JavaScript", "异步编程", "前端"],
    cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=300&fit=crop",
    content: `
      <p>JavaScript 的异步编程模型是前端开发中最核心的概念之一。从最早的回调函数，到 Promise 的链式调用，再到 async/await 的优雅语法糖，异步编程的演进反映了开发者对代码可读性和可维护性的不断追求。</p>

      <h2>回调函数（Callback）</h2>
      <p>回调是最原始的异步处理方式。虽然简单直接，但当多个异步操作存在依赖关系时，就会产生著名的"回调地狱"问题。</p>
      <pre><code>fs.readFile('file1.txt', (err, data1) => {
  fs.readFile('file2.txt', (err, data2) => {
    fs.readFile('file3.txt', (err, data3) => {
      // 嵌套越来越深...
    });
  });
});</code></pre>

      <h2>Promise 链式调用</h2>
      <p>ES6 引入的 Promise 对象，让异步操作可以用链式调用的方式组织，大幅改善了代码可读性。</p>
      <pre><code>readFile('file1.txt')
  .then(data1 => readFile('file2.txt'))
  .then(data2 => readFile('file3.txt'))
  .then(data3 => console.log('All done!'))
  .catch(err => console.error(err));</code></pre>

      <h2>async/await 语法糖</h2>
      <p>ES2017 引入的 async/await 让异步代码看起来就像同步代码一样，是目前最推荐的异步编程方式。</p>
      <pre><code>async function readAllFiles() {
  try {
    const data1 = await readFile('file1.txt');
    const data2 = await readFile('file2.txt');
    const data3 = await readFile('file3.txt');
    console.log('All done!');
  } catch (err) {
    console.error(err);
  }
}</code></pre>

      <blockquote>理解这些异步模式的演进，不仅能帮助你写出更优雅的代码，也能让你更好地理解 JavaScript 引擎的事件循环机制。</blockquote>
    `
  },
  {
    id: 2,
    title: "用 Docker 构建现代化的开发环境",
    excerpt: "在团队协作中，环境一致性是困扰很多开发者的问题。Docker 提供了一种轻量级的虚拟化方案，可以确保开发、测试和生产环境的一致性。本文将介绍如何用 Docker 和 Docker Compose 搭建一个完整的全栈开发环境...",
    date: "2026-03-01",
    category: "技术向",
    tags: ["Docker", "DevOps", "后端"],
    cover: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop",
    content: `
      <p>在团队协作中，"在我电脑上能跑"这句话是最让人头疼的。Docker 提供了一种优雅的解决方案。</p>
      <h2>为什么选择 Docker？</h2>
      <p>Docker 容器化技术让我们可以将应用和它的运行环境打包在一起，确保在任何地方运行都有一致的行为。</p>
      <h2>Docker Compose 实战</h2>
      <p>Docker Compose 让我们可以用 YAML 文件定义多容器应用，一键启动整个开发环境。</p>
      <pre><code>version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp</code></pre>
    `
  },
  {
    id: 3,
    title: "Vue 3 组合式 API 最佳实践指南",
    excerpt: "Vue 3 的组合式 API（Composition API）提供了一种全新的代码组织方式，让逻辑复用变得更加灵活。本文总结了在实际项目中使用组合式 API 的最佳实践，包括 composables 的设计模式、响应式数据管理和性能优化技巧...",
    date: "2026-02-18",
    category: "技术向",
    tags: ["Vue", "前端", "JavaScript"],
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
    content: `
      <p>Vue 3 的 Composition API 是前端开发的一次重要革新，它让代码组织更加灵活和可复用。</p>
      <h2>Composables 设计模式</h2>
      <p>自定义 composable 函数是复用有状态逻辑的标准方式。一个好的 composable 应该遵循"组合优于继承"的原则。</p>
      <pre><code>// useCounter.js
import { ref } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}</code></pre>
    `
  },
  {
    id: 4,
    title: "macOS 开发环境配置完全指南（2026版）",
    excerpt: "新 Mac 到手后的第一件事就是搭建开发环境。从 Homebrew 到终端美化，从 Git 配置到 IDE 选择，本文涵盖了 macOS 开发环境配置的方方面面，帮助你快速打造一个高效且美观的工作环境...",
    date: "2026-02-05",
    category: "笔记本",
    tags: ["macOS", "开发环境", "效率"],
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop",
    content: `
      <p>新年新 Mac，让我们一步步打造完美的开发环境。</p>
      <h2>Homebrew — macOS 的包管理器</h2>
      <p>Homebrew 是 macOS 上最流行的包管理器，几乎是每个开发者必装的工具。</p>
      <pre><code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></pre>
      <h2>终端美化</h2>
      <p>推荐使用 iTerm2 + Oh My Zsh + Powerlevel10k 的组合，打造一个既美观又实用的终端。</p>
    `
  },
  {
    id: 5,
    title: "我是如何用 Cloudflare Workers 搭建无服务器 API 的",
    excerpt: "Serverless 架构让我们可以专注于业务逻辑而不必操心服务器运维。Cloudflare Workers 以其全球边缘网络和极低延迟的特性，成为了搭建轻量级 API 的绝佳选择。本文分享我使用 Workers 的实战经验...",
    date: "2026-01-20",
    category: "分享墙",
    tags: ["Cloudflare", "Serverless", "API"],
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
    content: `
      <p>Cloudflare Workers 是一个运行在边缘网络上的 Serverless 平台，它让我们可以在全球 300+ 个数据中心运行代码。</p>
      <h2>Hello World</h2>
      <pre><code>export default {
  async fetch(request) {
    return new Response('Hello World!');
  },
};</code></pre>
      <blockquote>Workers 的冷启动时间几乎为零，这让它非常适合处理 API 请求。</blockquote>
    `
  },
  {
    id: 6,
    title: "2025 年度总结 —— 代码、旅行与成长",
    excerpt: "回顾过去的一年，写了不少代码，去了几个想去的城市，也认识了一些有趣的人。这篇年度总结记录了 2025 年里那些值得纪念的瞬间和思考...",
    date: "2026-01-01",
    category: "随笔录",
    tags: ["年度总结", "生活"],
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
    content: `
      <p>2025 年过去了，是时候做一个简单的回顾了。</p>
      <h2>代码</h2>
      <p>今年写了大约 5 万行代码，主要集中在前端和 Node.js 后端领域。最有成就感的是用 Rust 重写了一个性能关键的模块。</p>
      <h2>旅行</h2>
      <p>去了日本、泰国和新疆，每次旅行都带来了不同的灵感和思考。</p>
      <h2>成长</h2>
      <p>最大的收获是学会了"做减法"。不是每个新技术都需要追，找到适合自己的才是最重要的。</p>
    `
  },
  {
    id: 7,
    title: "CSS 容器查询实战 —— 真正的组件级响应式",
    excerpt: "传统的媒体查询基于视口大小，但组件往往需要根据自身容器的大小来调整布局。CSS 容器查询（Container Queries）终于让真正的组件级响应式成为可能。本文通过实际案例展示容器查询的强大之处...",
    date: "2025-12-15",
    category: "技术向",
    tags: ["CSS", "前端", "响应式"],
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop",
    content: `
      <p>CSS 容器查询是 CSS 近年来最令人兴奋的新特性之一。</p>
      <h2>基本语法</h2>
      <pre><code>.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}</code></pre>
      <blockquote>容器查询让组件真正实现了"自适应"，不再依赖全局的视口大小。</blockquote>
    `
  },
  {
    id: 8,
    title: "TypeScript 类型体操入门 —— 从实用工具类型说起",
    excerpt: "TypeScript 的类型系统非常强大，甚至可以用它来做图灵完备的类型计算。不过对于大多数开发者来说，掌握常用的工具类型和基础类型体操就足以应对日常工作中的类型挑战...",
    date: "2025-11-28",
    category: "技术向",
    tags: ["TypeScript", "前端"],
    cover: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=300&fit=crop",
    content: `
      <p>TypeScript 的类型系统远比看起来强大。让我们从实用工具类型开始，逐步深入类型体操的世界。</p>
      <h2>常用工具类型</h2>
      <pre><code>// Partial - 将所有属性变为可选
type Partial&lt;T&gt; = {
  [P in keyof T]?: T[P];
};

// Required - 将所有属性变为必选
type Required&lt;T&gt; = {
  [P in keyof T]-?: T[P];
};</code></pre>
    `
  }
];

// 归档数据（由 app.js 根据 posts 动态计算）
const archives = [];
