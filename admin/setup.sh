#!/bin/bash
# ============================================
# 博客管理后台一键部署脚本
# 在服务器上执行: bash /var/www/blog/admin/setup.sh
# ============================================

set -e
echo "========================================="
echo "  Contin's Blog 管理后台部署"
echo "========================================="

BLOG_DIR="/var/www/blog"

# 1. 安装 Node.js
echo ""
echo "[1/6] 检查 Node.js..."
if ! command -v node &> /dev/null; then
  echo "  安装 Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
echo "  Node.js $(node -v)"

# 2. 配置 Git
echo ""
echo "[2/6] 配置 Git..."
cd $BLOG_DIR
git config user.email "Contin-kd@outlook.com"
git config user.name "TContin"
git config credential.helper store
echo "  Git 配置完成"

# 3. 安装 systemd 服务
echo ""
echo "[3/6] 配置 systemd 服务..."
sudo cp $BLOG_DIR/admin/blog-admin.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable blog-admin
echo "  服务已注册"

# 4. 配置 Nginx
echo ""
echo "[4/6] 配置 Nginx..."
sudo tee /etc/nginx/sites-available/blog > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    root /var/www/blog;
    index index.html;

    # 管理后台反向代理
    location /admin {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1024;
}
NGINX

sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo "  Nginx 配置完成"

# 5. 启动管理后台服务
echo ""
echo "[5/6] 启动管理后台..."
sudo systemctl restart blog-admin
echo "  服务已启动"

# 6. 验证
echo ""
echo "[6/6] 验证..."
sleep 2
if curl -s http://127.0.0.1:3001/admin/api/check > /dev/null 2>&1; then
  echo "  管理后台运行正常！"
else
  echo "  警告：管理后台可能未正常启动，请检查: sudo systemctl status blog-admin"
fi

echo ""
echo "========================================="
echo "  部署完成！"
echo "  访问: http://$(curl -s ifconfig.me 2>/dev/null || echo '你的服务器IP')/admin"
echo "  密码: k96017.."
echo "========================================="
