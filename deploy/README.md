# 博客部署指南：GitHub 推送自动更新

## 整体架构

```
你的电脑                    GitHub                     你的服务器
  │                          │                           │
  │  git push               │   Webhook 通知             │
  │ ──────────────────────► │ ────────────────────────► │
  │                          │                           │ git pull (自动)
  │                          │                           │ 网站自动更新！
```

---

## 方案一：GitHub Webhook 自动部署（推荐）

### 第一步：上传到 GitHub

```bash
# 在项目目录下
cd /path/to/your/blog

git init
git add .
git commit -m "Initial commit: my blog"
git branch -M main
git remote add origin https://github.com/TContin/Contin-s-Blog.git
git push -u origin main
```

### 第二步：服务器首次配置（一键脚本）

SSH 登录到你的服务器后执行：

```bash
# 1. 先克隆你的仓库
git clone https://github.com/TContin/Contin-s-Blog.git /var/www/blog

# 2. 把 deploy 目录下的脚本也会一起克隆下来
# 3. 修改 deploy.sh 中的配置（仓库地址、域名等）
cd /var/www/blog/deploy
nano deploy.sh  # 修改顶部的配置变量

# 4. 运行一键部署脚本
chmod +x deploy.sh
sudo ./deploy.sh
```

### 第三步：配置 GitHub Webhook

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings** → **Webhooks** → **Add webhook**
3. 填写以下信息：

| 字段 | 值 |
|------|------|
| Payload URL | `http://你的服务器IP/webhook` |
| Content type | `application/json` |
| Secret | `your-webhook-secret`（与 deploy.sh 中一致） |
| Events | 选择 `Just the push event` |

4. 点击 **Add webhook**

### 第四步：测试

在本地修改任意文件，然后推送：

```bash
git add .
git commit -m "test auto deploy"
git push
```

等待几秒，刷新你的网站，内容应该已经更新了！

---

## 方案二：GitHub Actions + SSH 自动部署

如果你的服务器不方便开放 Webhook 端口，可以用 GitHub Actions。

### 1. 在项目中创建 `.github/workflows/deploy.yml`

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/blog
            git pull origin main
```

### 2. 配置 GitHub Secrets

在仓库 **Settings** → **Secrets and variables** → **Actions** 中添加：

| Secret 名称 | 值 |
|-------------|------|
| `SERVER_HOST` | 你的服务器 IP |
| `SERVER_USER` | SSH 用户名（如 `root`） |
| `SSH_PRIVATE_KEY` | 你的 SSH 私钥内容 |

### 3. 服务器端只需配置 Nginx

```bash
# 克隆仓库
git clone https://github.com/TContin/Contin-s-Blog.git /var/www/blog

# 配置 Nginx（复制 deploy/nginx.conf 到 /etc/nginx/sites-available/blog）
sudo cp /var/www/blog/deploy/nginx.conf /etc/nginx/sites-available/blog
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 方案三：GitHub Pages（最简单，免费，无需服务器）

如果你没有自己的服务器，GitHub Pages 是最简单的方案：

1. 在仓库 **Settings** → **Pages**
2. Source 选择 `Deploy from a branch`
3. Branch 选择 `main`，目录选 `/ (root)`
4. 保存后等待几分钟
5. 你的博客会部署在 `https://TContin.github.io/Contin-s-Blog/`

> 每次 push 自动更新，零配置。

---

## 可选：配置 HTTPS（Let's Encrypt 免费证书）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 自动配置 HTTPS（需要域名已指向服务器IP）
sudo certbot --nginx -d yourdomain.com

# 证书自动续期（已自动配置）
sudo certbot renew --dry-run
```

---

## 文件结构说明

```
deploy/
├── deploy.sh            # 一键部署脚本（服务器首次配置）
├── webhook-server.js    # Webhook 监听服务（接收 GitHub 通知）
├── nginx.conf           # Nginx 配置模板
└── README.md            # 本文档
```

## 常见问题

**Q: push 后网站没更新？**
- 检查 Webhook 服务是否运行：`sudo systemctl status blog-webhook`
- 查看日志：`sudo journalctl -u blog-webhook -f`
- 检查 GitHub Webhook 页面的 Recent Deliveries 是否有错误

**Q: 如何手动更新？**
```bash
cd /var/www/blog && git pull origin main
```

**Q: 如何重启 Webhook 服务？**
```bash
sudo systemctl restart blog-webhook
```
