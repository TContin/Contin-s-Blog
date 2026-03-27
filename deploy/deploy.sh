#!/bin/bash
# ============================================================
# 博客一键部署脚本（首次配置 + 自动更新）
# 使用方式：chmod +x deploy.sh && sudo ./deploy.sh
# ============================================================

set -e

# ========== 请修改以下配置 ==========
GITHUB_REPO="https://github.com/你的用户名/Contin-s-Blog.git"  # 替换用户名
SITE_DIR="/var/www/blog"        # 网站目录
DOMAIN="yourdomain.com"         # 你的域名（可选，不用域名就用IP访问）
WEBHOOK_SECRET="your-webhook-secret"  # Webhook 密钥，需和 GitHub 设置的一致
WEBHOOK_PORT=9000
# ===================================

echo "=============================="
echo "  博客自动部署配置脚本"
echo "=============================="

# 1. 安装依赖
echo ""
echo "[1/5] 安装必要软件..."
if command -v apt &> /dev/null; then
    sudo apt update
    sudo apt install -y nginx git nodejs npm
elif command -v yum &> /dev/null; then
    sudo yum install -y nginx git nodejs npm
fi

# 2. 克隆仓库
echo ""
echo "[2/5] 克隆 GitHub 仓库..."
if [ -d "$SITE_DIR" ]; then
    echo "目录已存在，执行 git pull..."
    cd "$SITE_DIR"
    git pull origin main
else
    sudo mkdir -p "$SITE_DIR"
    sudo chown $USER:$USER "$SITE_DIR"
    git clone "$GITHUB_REPO" "$SITE_DIR"
fi

# 3. 配置 Nginx
echo ""
echo "[3/5] 配置 Nginx..."
sudo tee /etc/nginx/sites-available/blog > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN} _;

    root ${SITE_DIR};
    index index.html;

    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;

    # 静态文件缓存
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Webhook 反向代理
    location /webhook {
        proxy_pass http://127.0.0.1:${WEBHOOK_PORT}/webhook;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Hub-Signature-256 \$http_x_hub_signature_256;
        proxy_set_header X-GitHub-Event \$http_x_github_event;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 4. 配置 Webhook 服务为 systemd 服务
echo ""
echo "[4/5] 配置 Webhook 自动更新服务..."
sudo tee /etc/systemd/system/blog-webhook.service > /dev/null <<EOF
[Unit]
Description=Blog GitHub Webhook Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=${SITE_DIR}/deploy
Environment=WEBHOOK_SECRET=${WEBHOOK_SECRET}
Environment=WEBHOOK_PORT=${WEBHOOK_PORT}
Environment=REPO_PATH=${SITE_DIR}
ExecStart=/usr/bin/node ${SITE_DIR}/deploy/webhook-server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable blog-webhook
sudo systemctl start blog-webhook

# 5. 完成
echo ""
echo "[5/5] 配置完成！"
echo ""
echo "=============================="
echo "  部署信息"
echo "=============================="
echo "  网站地址: http://${DOMAIN}"
echo "  Webhook:  http://${DOMAIN}/webhook"
echo "  网站目录: ${SITE_DIR}"
echo ""
echo "  下一步："
echo "  1. 去 GitHub 仓库 -> Settings -> Webhooks -> Add webhook"
echo "  2. Payload URL 填: http://${DOMAIN}/webhook"
echo "  3. Content type 选: application/json"
echo "  4. Secret 填: ${WEBHOOK_SECRET}"
echo "  5. 选择 'Just the push event'"
echo "  6. 点击 Add webhook"
echo ""
echo "  之后每次 git push，博客会自动更新！"
echo "=============================="
