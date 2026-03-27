const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================
// 配置项（部署时修改）
// ============================================
const CONFIG = {
  port: 3001,
  password: 'changeme123',       // 管理后台密码，部署后请修改
  blogDir: '/var/www/blog',      // 博客目录
  dataFile: '/var/www/blog/js/data.js',
};

// ============================================
// 工具函数
// ============================================
function parseCookies(req) {
  const cookies = {};
  (req.headers.cookie || '').split(';').forEach(c => {
    const [k, v] = c.trim().split('=');
    if (k) cookies[k] = decodeURIComponent(v || '');
  });
  return cookies;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function jsonResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath, contentType) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end('Not Found');
  }
}

// ============================================
// 读写文章数据
// ============================================
function readPosts() {
  try {
    const content = fs.readFileSync(CONFIG.dataFile, 'utf-8');
    // 用 Function 方式安全解析 data.js
    const fn = new Function(content + '\nreturn { posts, archives };');
    return fn().posts || [];
  } catch (e) {
    console.error('读取文章失败:', e.message);
    return [];
  }
}

function writePosts(posts) {
  let js = '// 博客文章数据\nconst posts = [\n';
  posts.forEach((post, i) => {
    js += '  {\n';
    js += `    id: ${post.id},\n`;
    js += `    title: ${JSON.stringify(post.title)},\n`;
    js += `    excerpt: ${JSON.stringify(post.excerpt)},\n`;
    js += `    date: "${post.date}",\n`;
    js += `    category: ${JSON.stringify(post.category)},\n`;
    js += `    tags: ${JSON.stringify(post.tags)},\n`;
    js += `    cover: ${JSON.stringify(post.cover)},\n`;
    js += '    content: `\n' + post.content + '\n    `\n';
    js += '  }' + (i < posts.length - 1 ? ',' : '') + '\n';
  });
  js += '];\n\n';
  js += '// 归档数据（由 app.js 根据 posts 动态计算）\n';
  js += 'const archives = [];\n';

  fs.writeFileSync(CONFIG.dataFile, js, 'utf-8');
}

function gitPush(message) {
  try {
    execSync(`cd ${CONFIG.blogDir} && git add -A && git commit -m "${message}" && git push origin main`, {
      timeout: 30000,
      stdio: 'pipe'
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.stderr?.toString() || e.message };
  }
}

// ============================================
// 生成 session token
// ============================================
let sessionToken = '';
function generateToken() {
  sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
  return sessionToken;
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  return cookies.token && cookies.token === sessionToken;
}

// ============================================
// HTTP 服务
// ============================================
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // --- 静态文件 ---
  if (pathname === '/admin' || pathname === '/admin/') {
    serveFile(res, path.join(__dirname, 'index.html'), 'text/html; charset=utf-8');
    return;
  }

  // --- 登录 ---
  if (pathname === '/admin/api/login' && req.method === 'POST') {
    const body = JSON.parse(await readBody(req));
    if (body.password === CONFIG.password) {
      const token = generateToken();
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Max-Age=86400`
      });
      res.end(JSON.stringify({ success: true }));
    } else {
      jsonResponse(res, 401, { success: false, message: '密码错误' });
    }
    return;
  }

  // --- 需要认证的 API ---
  if (pathname.startsWith('/admin/api/') && pathname !== '/admin/api/login') {
    if (!isAuthed(req)) {
      jsonResponse(res, 401, { success: false, message: '未登录' });
      return;
    }
  }

  // --- 获取文章列表 ---
  if (pathname === '/admin/api/posts' && req.method === 'GET') {
    const posts = readPosts();
    jsonResponse(res, 200, { success: true, posts });
    return;
  }

  // --- 创建文章 ---
  if (pathname === '/admin/api/posts' && req.method === 'POST') {
    const body = JSON.parse(await readBody(req));
    const posts = readPosts();
    const maxId = posts.reduce((max, p) => Math.max(max, p.id), 0);
    const newPost = {
      id: maxId + 1,
      title: body.title || '无标题',
      excerpt: body.excerpt || '',
      date: body.date || new Date().toISOString().split('T')[0],
      category: body.category || '未分类',
      tags: body.tags || [],
      cover: body.cover || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=300&fit=crop',
      content: body.content || ''
    };
    posts.unshift(newPost); // 新文章放最前面
    writePosts(posts);
    const git = gitPush(`发布文章：${newPost.title}`);
    jsonResponse(res, 200, { success: true, post: newPost, git });
    return;
  }

  // --- 更新文章 ---
  if (pathname.match(/^\/admin\/api\/posts\/\d+$/) && req.method === 'PUT') {
    const id = parseInt(pathname.split('/').pop());
    const body = JSON.parse(await readBody(req));
    const posts = readPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) { jsonResponse(res, 404, { success: false, message: '文章不存在' }); return; }
    Object.assign(posts[idx], {
      title: body.title ?? posts[idx].title,
      excerpt: body.excerpt ?? posts[idx].excerpt,
      date: body.date ?? posts[idx].date,
      category: body.category ?? posts[idx].category,
      tags: body.tags ?? posts[idx].tags,
      cover: body.cover ?? posts[idx].cover,
      content: body.content ?? posts[idx].content
    });
    writePosts(posts);
    const git = gitPush(`更新文章：${posts[idx].title}`);
    jsonResponse(res, 200, { success: true, post: posts[idx], git });
    return;
  }

  // --- 删除文章 ---
  if (pathname.match(/^\/admin\/api\/posts\/\d+$/) && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/').pop());
    let posts = readPosts();
    const post = posts.find(p => p.id === id);
    if (!post) { jsonResponse(res, 404, { success: false, message: '文章不存在' }); return; }
    posts = posts.filter(p => p.id !== id);
    writePosts(posts);
    const git = gitPush(`删除文章：${post.title}`);
    jsonResponse(res, 200, { success: true, git });
    return;
  }

  // --- 登出 ---
  if (pathname === '/admin/api/logout' && req.method === 'POST') {
    sessionToken = '';
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'token=; Path=/; Max-Age=0'
    });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // --- 检查登录状态 ---
  if (pathname === '/admin/api/check') {
    jsonResponse(res, 200, { success: true, authed: isAuthed(req) });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(CONFIG.port, () => {
  console.log(`博客管理后台运行在 http://localhost:${CONFIG.port}/admin`);
  console.log(`博客目录: ${CONFIG.blogDir}`);
});
