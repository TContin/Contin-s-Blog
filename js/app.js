// ============================================
// DOM Elements
// ============================================
const postListEl = document.getElementById('postList');
const recentListEl = document.getElementById('recentList');
const archiveListEl = document.getElementById('archiveList');
const backToTopBtn = document.getElementById('backToTop');
const themeToggle = document.querySelector('.theme-toggle');
const searchToggle = document.querySelector('.search-toggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchClose = document.getElementById('searchClose');

// ============================================
// Theme Toggle
// ============================================
function initTheme() {
  const saved = localStorage.getItem('blog-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('blog-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

if (themeToggle) {
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleTheme();
  });
}

initTheme();

// ============================================
// Render Posts
// ============================================
function renderPosts() {
  if (!postListEl) return;

  postListEl.innerHTML = posts.map(post => `
    <article class="post-card">
      <div class="post-cover">
        <a href="post.html?id=${post.id}">
          <img src="${post.cover}" alt="${post.title}" loading="lazy">
        </a>
      </div>
      <div class="post-body">
        <h2 class="post-title">
          <a href="post.html?id=${post.id}">${post.title}</a>
        </h2>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-meta">
          <div class="post-meta-left">
            <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
            <span><i class="far fa-folder"></i> ${post.category}</span>
          </div>
          <a href="post.html?id=${post.id}" class="post-read-more">继续阅读</a>
        </div>
      </div>
    </article>
  `).join('');
}

// ============================================
// Render Recent Posts
// ============================================
function renderRecent() {
  if (!recentListEl) return;

  const recent = posts.slice(0, 5);
  recentListEl.innerHTML = recent.map(post => `
    <li>
      <span class="recent-date">${post.date}</span>
      <a href="post.html?id=${post.id}" class="recent-title">${post.title}</a>
    </li>
  `).join('');
}

// ============================================
// Render Archives
// ============================================
function renderArchives() {
  if (!archiveListEl) return;

  archiveListEl.innerHTML = archives.map(a => `
    <li>
      <a href="#">
        <span>${a.year}</span>
        <span class="archive-count">${a.count}</span>
      </a>
    </li>
  `).join('');
}

// ============================================
// Back to Top
// ============================================
window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// Search
// ============================================
function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('active');
  setTimeout(() => searchInput && searchInput.focus(), 200);
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('active');
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
}

if (searchToggle) {
  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });
}

if (searchClose) {
  searchClose.addEventListener('click', closeSearch);
}

if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearch();
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const results = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(t => t.toLowerCase().includes(query))
    );

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">没有找到相关文章</div>';
      return;
    }

    searchResults.innerHTML = results.map(post => `
      <a href="post.html?id=${post.id}" class="search-result-item">
        <h4>${highlightText(post.title, query)}</h4>
        <p>${post.date} · ${post.category}</p>
      </a>
    `).join('');
  });
}

function highlightText(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark style="background:var(--accent-light);color:var(--accent);padding:0 2px;border-radius:2px;">$1</mark>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// Article Detail Page
// ============================================
function renderArticle() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const post = posts.find(p => p.id === id);

  if (!post) return;

  document.title = `${post.title} - Contin's Blog`;

  const heroEl = document.getElementById('articleHero');
  const titleEl = document.getElementById('articleTitle');
  const metaEl = document.getElementById('articleMeta');
  const textEl = document.getElementById('articleText');
  const tagsEl = document.getElementById('articleTags');
  const navEl = document.getElementById('articleNav');

  if (heroEl) heroEl.innerHTML = `<img src="${post.cover}" alt="${post.title}">`;
  if (titleEl) titleEl.textContent = post.title;
  if (metaEl) metaEl.innerHTML = `
    <div class="post-meta-left">
      <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
      <span><i class="far fa-folder"></i> ${post.category}</span>
    </div>
  `;
  if (textEl) textEl.innerHTML = post.content;
  if (tagsEl) tagsEl.innerHTML = post.tags.map(t => `<span class="article-tag"># ${t}</span>`).join('');

  // 上下篇导航
  if (navEl) {
    const idx = posts.findIndex(p => p.id === id);
    let navHTML = '';
    if (idx > 0) {
      const prev = posts[idx - 1];
      navHTML += `<a href="post.html?id=${prev.id}"><i class="fas fa-arrow-left"></i> ${prev.title}</a>`;
    } else {
      navHTML += '<span></span>';
    }
    if (idx < posts.length - 1) {
      const next = posts[idx + 1];
      navHTML += `<a href="post.html?id=${next.id}">${next.title} <i class="fas fa-arrow-right"></i></a>`;
    }
    navEl.innerHTML = navHTML;
  }
}

// ============================================
// Initialize
// ============================================
renderPosts();
renderRecent();
renderArchives();

// 如果是文章详情页
if (document.getElementById('articleTitle')) {
  renderArticle();
}
