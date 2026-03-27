# Contin's Blog - 部署指南

## 目录结构

```
├── .github/workflows/deploy.yml  # GitHub Actions 自动部署
├── css/style.css                 # 样式
├── js/
│   ├── data.js                   # 文章数据
│   └── app.js                    # 交互逻辑
├── scripts/
│   ├── deploy.sh                 # 服务器手动部署脚本
│   ├── webhook.py                # Webhook 自动部署监听
│   └── nginx.conf                # Nginx 配置示例
├── index.html                    # 首页
├── post.html                     # 文章详情
├── archives.html                 # 归档
├── tags.html                     # 标签
└── links.html                    # 友链
```

---

## 一、上传到 GitHub

```bash
# 1. 初始化 Git 仓库
git init
git add .
git commit -m "初始化博客"

# 2. 在 GitHub 上创建仓库，然后关联
git remote add origin https://github.com/TContin/Contin-s-Blog.git
git branch -M main
git push -u origin main
```

---

## 二、服务器初始化

### 2.1 安装 Nginx 和 Git

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx git -y

# CentOS
sudo yum install nginx git -y
```

### 2.2 克隆仓库到服务器

```bash
sudo mkdir -p /var/www/blog
sudo chown $USER:$USER /var/www/blog
git clone https://github.com/TContin/Contin-s-Blog.git /var/www/blog
```

### 2.3 配置 Nginx

```bash
# 复制配置文件
sudo cp /var/www/blog/scripts/nginx.conf /etc/nginx/sites-available/blog

# 编辑配置，把 your-domain.com 改为你的域名或 IP
sudo nano /etc/nginx/sites-available/blog

# 启用站点
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试并重启
sudo nginx -t
sudo systemctl restart nginx
```

此时访问你的域名/IP 就能看到博客了。

---

## 三、自动部署（二选一）

### 方案 A：GitHub Actions（推荐）

> 每次 push 到 main 分支，GitHub 自动通过 SSH 连接服务器执行 `git pull`。

**步骤：**

1. **在服务器上生成 SSH 密钥**（如果没有）：
   ```bash
   ssh-keygen -t ed25519 -C "deploy" -f ~/.ssh/deploy_key -N ""
   cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
   ```

2. **在 GitHub 仓库设置 Secrets**：

   进入仓库 → Settings → Secrets and variables → Actions → New repository secret

   | Secret 名称 | 值 |
   |---|---|
   | `SERVER_HOST` | 你的服务器 IP |
   | `SERVER_USER` | SSH 用户名（如 `root` 或 `ubuntu`） |
   | `SSH_PRIVATE_KEY` | `cat ~/.ssh/deploy_key` 的完整内容 |
   | `SERVER_PORT` | SSH 端口（默认 22，可不设） |

3. **Push 代码触发部署**：
   ```bash
   git add .
   git commit -m "update blog"
   git push
   ```
   
   去 GitHub 仓库的 Actions 页面查看部署状态。

---

### 方案 B：Webhook 监听（轻量方案）

> 在服务器上运行一个小型监听服务，GitHub push 时主动通知服务器更新。

**步骤：**

1. **编辑 Webhook 脚本配置**：
   ```bash
   nano /var/www/blog/scripts/webhook.py
   # 修改 WEBHOOK_SECRET 为你想设的密钥
   ```

2. **启动 Webhook 服务**：
   ```bash
   # 方式一：直接运行
   python3 /var/www/blog/scripts/webhook.py &

   # 方式二：用 systemd 管理（推荐）
   sudo tee /etc/systemd/system/blog-webhook.service << 'EOF'
   [Unit]
   Description=Blog Webhook Listener
   After=network.target

   [Service]
   ExecStart=/usr/bin/python3 /var/www/blog/scripts/webhook.py
   WorkingDirectory=/var/www/blog
   Restart=always
   User=www-data

   [Install]
   WantedBy=multi-user.target
   EOF

   sudo systemctl daemon-reload
   sudo systemctl enable blog-webhook
   sudo systemctl start blog-webhook
   ```

3. **在 GitHub 上配置 Webhook**：
   
   进入仓库 → Settings → Webhooks → Add webhook
   
   | 配置项 | 值 |
   |---|---|
   | Payload URL | `http://你的服务器IP/webhook` |
   | Content type | `application/json` |
   | Secret | 你在脚本中设的密钥 |
   | Events | `Just the push event` |

4. **Push 代码，自动部署**：
   ```bash
   git push
   # 服务器自动 git pull 更新！
   ```

---

## 四、工作流总结

```
本地编辑 → git push → GitHub 仓库更新
                           ↓
              GitHub Actions / Webhook 触发
                           ↓
              服务器自动 git pull 更新文件
                           ↓
              Nginx 直接提供最新页面
```

每次你在本地修改文章、样式后，只需 `git push`，服务器就会自动更新，无需手动操作。

---

## 五、可选：HTTPS 配置

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 自动配置 SSL
sudo certbot --nginx -d your-domain.com

# 自动续期（已默认配置）
sudo certbot renew --dry-run
```
