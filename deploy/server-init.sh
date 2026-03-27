#!/bin/bash
# ============================================================
# 腾讯云服务器一键初始化脚本
# 在服务器上执行: curl -sSL <url> | bash
# 或手动复制粘贴执行
# ============================================================

set -e

echo "========================================"
echo "  Contin's Blog 服务器初始化"
echo "========================================"

# 1. 安装 Nginx 和 Git
echo ""
echo "[1/4] 安装 Nginx 和 Git..."
sudo apt update -y
sudo apt install -y nginx git

# 2. 克隆仓库
echo ""
echo "[2/4] 克隆博客仓库..."
if [ -d "/var/www/blog/.git" ]; then
    echo "仓库已存在，拉取最新代码..."
    cd /var/www/blog
    git pull origin main
else
    sudo rm -rf /var/www/blog
    sudo mkdir -p /var/www/blog
    sudo chown $USER:$USER /var/www/blog
    git clone https://github.com/TContin/Contin-s-Blog.git /var/www/blog
fi

# 3. 配置 Nginx
echo ""
echo "[3/4] 配置 Nginx..."
sudo tee /etc/nginx/sites-available/blog > /dev/null <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/blog;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
sudo systemctl enable nginx

# 4. 生成 SSH 部署密钥
echo ""
echo "[4/4] 生成 SSH 部署密钥..."
if [ ! -f ~/.ssh/deploy_key ]; then
    ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/deploy_key -N ""
    cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    echo ""
    echo "========================================"
    echo "  初始化完成！"
    echo "========================================"
    echo ""
    echo "你的博客已经可以访问了！"
    echo "  浏览器打开: http://$(curl -s ifconfig.me)"
    echo ""
    echo "========================================"
    echo "  接下来配置 GitHub 自动部署"
    echo "========================================"
    echo ""
    echo "去 GitHub 仓库 Settings > Secrets > Actions 添加以下 3 个 Secret："
    echo ""
    echo "1. SERVER_HOST 的值："
    echo "   $(curl -s ifconfig.me)"
    echo ""
    echo "2. SERVER_USER 的值："
    echo "   $USER"
    echo ""
    echo "3. SSH_PRIVATE_KEY 的值（复制下面全部内容）："
    echo "----------------------------------------"
    cat ~/.ssh/deploy_key
    echo "----------------------------------------"
    echo ""
    echo "配置完成后，每次 git push 博客会自动更新！"
    echo "========================================"
else
    echo "部署密钥已存在"
    echo ""
    echo "========================================"
    echo "  初始化完成！"
    echo "========================================"
    echo "  浏览器打开: http://$(curl -s ifconfig.me)"
    echo ""
    echo "  如需重新查看 SSH 私钥："
    echo "  cat ~/.ssh/deploy_key"
    echo "========================================"
fi
