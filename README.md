# Contin's Blog

一个简洁美观的个人博客，采用纯 HTML/CSS/JS 构建，支持暗色模式、全局搜索和响应式布局。

## 预览

- **首页**：三栏布局，左侧个人信息/分类/标签，中间文章列表，右侧最近文章/归档
- **文章详情**：封面图 + 正文 + 标签 + 上下篇导航
- **归档页**：按年份分组展示所有文章
- **标签页**：标签云 + 点击筛选
- **友链页**：卡片式展示

## 功能特性

- 🌓 亮色 / 暗色主题切换（自动记忆偏好）
- 🔍 全局搜索（支持 `Ctrl+K` 快捷键）
- 📱 响应式设计，适配手机 / 平板 / 桌面
- ⬆️ 回到顶部按钮
- 🎨 文章卡片悬浮动效
- 📌 侧边栏吸顶

## 技术栈

- HTML5 + CSS3（CSS Variables、Grid、Flexbox）
- Vanilla JavaScript（零依赖）
- Font Awesome 图标

## 项目结构

```
├── css/
│   └── style.css            # 样式（含亮/暗主题）
├── js/
│   ├── app.js               # 交互逻辑
│   └── data.js              # 文章数据
├── deploy/                  # 服务器部署配置
│   ├── deploy.sh            # 一键部署脚本
│   ├── webhook-server.js    # Webhook 自动部署
│   ├── nginx.conf           # Nginx 配置模板
│   └── README.md            # 部署文档
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions 自动部署
├── index.html               # 首页
├── post.html                # 文章详情
├── archives.html            # 归档
├── tags.html                # 标签
├── links.html               # 友链
└── DEPLOY.md                # 部署指南
```

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/TContin/Contin-s-Blog.git

# 直接用浏览器打开
open index.html
# 或启动本地服务器
python -m http.server 8080
```

## 部署到服务器

支持两种自动部署方式，push 到 GitHub 后服务器自动更新：

- **GitHub Actions + SSH**（推荐）
- **Webhook 监听**

详见 [DEPLOY.md](DEPLOY.md)

## License

MIT
