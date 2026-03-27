/**
 * GitHub Webhook 监听服务
 * 当 GitHub 仓库收到 push 事件时，自动执行 git pull 更新网站
 *
 * 使用方式：
 *   1. 在服务器上安装 Node.js
 *   2. 设置环境变量 WEBHOOK_SECRET（与 GitHub Webhook 配置中的 Secret 一致）
 *   3. node webhook-server.js
 */

const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');
const path = require('path');

// ========== 配置 ==========
const PORT = process.env.WEBHOOK_PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
const REPO_PATH = process.env.REPO_PATH || '/var/www/blog';
// ==========================

function verifySignature(payload, signature) {
  if (!signature) return false;
  const sig = 'sha256=' + crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(signature));
}

function deploy() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 开始部署...`);

  try {
    // 进入项目目录，拉取最新代码
    const options = { cwd: REPO_PATH, encoding: 'utf-8', timeout: 30000 };

    // 丢弃本地修改（如果有），确保 pull 成功
    execSync('git fetch --all', options);
    execSync('git reset --hard origin/main', options);

    console.log(`[${timestamp}] 部署成功！`);
    return true;
  } catch (err) {
    console.error(`[${timestamp}] 部署失败:`, err.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // 仅处理 POST /webhook
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    // 验证签名
    const signature = req.headers['x-hub-signature-256'];
    if (!verifySignature(body, signature)) {
      console.log('签名验证失败，拒绝请求');
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // 检查是否是 push 事件
    const event = req.headers['x-github-event'];
    if (event !== 'push') {
      res.writeHead(200);
      res.end('Ignored: not a push event');
      return;
    }

    // 执行部署
    const success = deploy();
    res.writeHead(success ? 200 : 500);
    res.end(success ? 'Deploy success' : 'Deploy failed');
  });
});

server.listen(PORT, () => {
  console.log(`Webhook 服务已启动，监听端口 ${PORT}`);
  console.log(`项目路径: ${REPO_PATH}`);
  console.log(`Webhook 地址: http://your-server-ip:${PORT}/webhook`);
});
