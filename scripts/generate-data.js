#!/usr/bin/env node
/**
 * Generate js/data.js from markdown posts in ./posts
 *
 * Post format (Markdown):
 * ---
 * title: ...
 * date: YYYY-MM-DD
 * excerpt: ...
 * category: ...
 * tags: ["Docker", "DevOps"]   # or comma-separated string
 * cover: https://...
 * ---
 *
 * Markdown body below frontmatter.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const OUT_FILE = path.join(ROOT, 'js', 'data.js');

function readAllPostFiles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(POSTS_DIR, f));
}

function parseFrontmatter(src) {
  // very small YAML-ish parser for simple key: value pairs
  // expects src begins with ---\n ... \n---
  if (!src.startsWith('---')) return { fm: {}, body: src };
  const end = src.indexOf('\n---', 3);
  if (end === -1) return { fm: {}, body: src };
  const fmBlock = src.slice(3, end).trim();
  const body = src.slice(end + 4).replace(/^\s*\n/, '');
  const fm = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return { fm, body };
}

function parseTags(val) {
  if (!val) return [];
  val = String(val).trim();
  // JSON-like array
  if (val.startsWith('[') && val.endsWith(']')) {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) ? arr.map(String).map(s => s.trim()).filter(Boolean) : [];
    } catch {}
  }
  return val.split(/,|，/).map(s => s.trim()).filter(Boolean);
}

function escapeTemplateLiteral(s) {
  return String(s).replace(/`/g, '\\`');
}

function mdToHtml(md) {
  // Minimal markdown -> HTML (no deps): headings, paragraphs, code fences, blockquotes.
  // This is intentionally simple; can be upgraded later.
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let inCode = false;
  let codeLang = '';
  let codeBuf = [];

  function flushParagraph(buf) {
    const text = buf.join(' ').trim();
    if (!text) return '';
    return `<p>${text}</p>\n`;
  }

  let pBuf = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fence = line.match(/^```\s*([A-Za-z0-9_-]+)?\s*$/);
    if (fence) {
      if (!inCode) {
        // start
        html += flushParagraph(pBuf); pBuf = [];
        inCode = true;
        codeLang = fence[1] || '';
        codeBuf = [];
      } else {
        // end
        const cls = codeLang ? ` class="language-${codeLang}"` : '';
        const code = codeBuf.join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        html += `<pre><code${cls}>${code}</code></pre>\n`;
        inCode = false;
        codeLang = '';
        codeBuf = [];
      }
      continue;
    }

    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    if (/^\s*$/.test(line)) {
      html += flushParagraph(pBuf);
      pBuf = [];
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      html += flushParagraph(pBuf); pBuf = [];
      const level = h[1].length;
      html += `<h${level}>${h[2].trim()}</h${level}>\n`;
      continue;
    }

    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      html += flushParagraph(pBuf); pBuf = [];
      html += `<blockquote>${bq[1].trim()}</blockquote>\n`;
      continue;
    }

    pBuf.push(line.trim());
  }

  html += flushParagraph(pBuf);
  // If code fence wasn't closed, still emit it
  if (inCode) {
    const code = codeBuf.join('\n')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html += `<pre><code>${code}</code></pre>\n`;
  }

  return html.trim();
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post';
}

function main() {
  const files = readAllPostFiles();
  const posts = [];

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const { fm, body } = parseFrontmatter(src);

    const title = fm.title || path.basename(file, '.md');
    const date = fm.date || '1970-01-01';
    const excerpt = fm.excerpt || '';
    const category = fm.category || '未分类';
    const cover = fm.cover || 'img/cover-default.jpg';
    const tags = parseTags(fm.tags);

    // id: if filename starts with number- and looks like a post id, use it; else assign later
    // Example: 0001-hello.md -> id=1
    let id = null;
    const bn = path.basename(file, '.md');
    const m = bn.match(/^(\d+)[-_]/);
    if (m) {
      const candidate = parseInt(m[1], 10);
      if (candidate >= 1 && candidate <= 1000000) id = candidate;
    }

    const html = mdToHtml(body);

    posts.push({
      id,
      title,
      date,
      category,
      tags,
      cover,
      excerpt,
      content: html,
      __file: path.relative(ROOT, file),
    });
  }

  // Sort newest first by date, then title
  posts.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.title.localeCompare(b.title, 'zh');
  });

  // Assign ids if missing, stable after sort
  let maxId = posts.reduce((m, p) => (Number.isFinite(p.id) ? Math.max(m, p.id) : m), 0);
  for (const p of posts) {
    if (!Number.isFinite(p.id)) p.id = ++maxId;
  }

  // Strip helper
  const outPosts = posts.map(({ __file, ...rest }) => rest);

  const banner = `// AUTO-GENERATED by scripts/generate-data.js. DO NOT EDIT BY HAND.\n`;
  const out = banner +
    `// Source: ./posts/*.md\n` +
    `const posts = ${JSON.stringify(outPosts, null, 2)
      .replace(/\\u2028/g, '\\u2028')
      .replace(/\\u2029/g, '\\u2029')};\n\n` +
    `// 归档数据（由 app.js 根据 posts 动态计算）\n` +
    `const archives = [];\n`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, out.replace(/\n/g, '\n'), 'utf8');

  // Also print suggested filename for new post
  // eslint-disable-next-line no-console
  console.log(`Generated ${path.relative(ROOT, OUT_FILE)} with ${outPosts.length} post(s).`);
}

main();
