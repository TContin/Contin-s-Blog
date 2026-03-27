# 博客管理后台

一个轻量的博客文章管理服务，支持在浏览器中写文章、编辑、删除，自动推送到 GitHub 并部署。

## 功能

- 密码保护的管理界面
- 新建/编辑/删除文章
- 自动修改 `data.js` 并 `git push`
- GitHub Actions 自动部署到服务器

## 在服务器上部署

### 1. 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. 修改管理密码

编辑 `/var/www/blog/admin/server.js`，修改第 10 行：

```javascript
password: 'changeme123',  // 改成你自己的密码
```

### 3. 配置 Git（确保服务器能推送）

```bash
cd /var/www/blog
git config user.email "你的邮箱"
git config user.name "TContin"

# 保存 Git 凭证（避免每次输密码）
git config credential.helper store
# 执行一次 git pull 输入用户名和 token，之后就不用了
git pull origin main
```

### 4. 启动服务

```bash
# 方式一：用 systemd（推荐，开机自启）
sudo cp /var/www/blog/admin/blog-admin.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable blog-admin
sudo systemctl start blog-admin

# 查看状态
sudo systemctl status blog-admin
```

### 5. 配置 Nginx 反向代理

在 Nginx 配置中添加（编辑 `/etc/nginx/sites-available/blog`）：

```nginx
# 在 server {} 块内添加：
location /admin {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

然后重载 Nginx：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 6. 访问管理后台

打开 `http://你的服务器IP/admin`，输入密码即可使用。

## 发布文章流程

1. 访问 `http://你的服务器IP/admin`
2. 输入管理密码登录
3. 点击「+ 新建文章」
4. 填写标题、摘要、分类、标签、封面图、正文
5. 点击「发布」
6. 服务自动修改 `data.js` → `git push` → GitHub Actions 部署 → 博客更新
