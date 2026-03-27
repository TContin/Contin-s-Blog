// ============================================
// DOM Elements
// ============================================
const postListEl = document.getElementById('postList');
const recentListEl = document.getElementById('recentList');
const archiveListEl = document.getElementById('archiveList');
const categoryListEl = document.querySelector('.category-list');
const tagsListEl = document.querySelector('.tags-list');
const profileStats = document.querySelectorAll('.stat-value');
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
  themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    toggleTheme();
  });
}

initTheme();

// ============================================
// Filter State
// ============================================
var currentFilter = { type: null, value: null };

// ============================================
// Filter handler (global function)
// ============================================
function filterBy(type, value) {
  if (currentFilter.type === type && currentFilter.value === value) {
    currentFilter = { type: null, value: null };
  } else {
    currentFilter = { type: type, value: value };
  }
  renderPostList();
  updateActiveStates();
}

function clearFilter() {
  currentFilter = { type: null, value: null };
  renderPostList();
  updateActiveStates();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Compute stats from posts data
// ============================================
function computeCategories() {
  var catMap = {};
  posts.forEach(function(p) {
    catMap[p.category] = (catMap[p.category] || 0) + 1;
  });
  return catMap;
}

function computeTags() {
  var tagMap = {};
  posts.forEach(function(p) {
    p.tags.forEach(function(t) {
      tagMap[t] = (tagMap[t] || 0) + 1;
    });
  });
  return tagMap;
}

function computeYears() {
  var yearMap = {};
  posts.forEach(function(p) {
    var year = p.date.split('-')[0];
    yearMap[year] = (yearMap[year] || 0) + 1;
  });
  return yearMap;
}

// ============================================
// Render Categories (dynamic from posts)
// ============================================
function renderCategories() {
  if (!categoryListEl) return;
  var catMap = computeCategories();
  var cats = Object.keys(catMap).sort(function(a, b) { return catMap[b] - catMap[a]; });

  categoryListEl.innerHTML = cats.map(function(cat) {
    return '<li><a href="javascript:void(0)" onclick="filterBy(\'category\',\'' + cat + '\')">' +
      '<span class="cat-name">' + cat + '</span>' +
      '<span class="cat-count">' + catMap[cat] + '</span></a></li>';
  }).join('');
}

// ============================================
// Render Tags (dynamic from posts)
// ============================================
function renderTags() {
  if (!tagsListEl) return;
  var tagMap = computeTags();
  var tags = Object.keys(tagMap).sort(function(a, b) { return tagMap[b] - tagMap[a]; });

  tagsListEl.innerHTML = tags.map(function(tag) {
    return '<a href="javascript:void(0)" class="tag" onclick="filterBy(\'tag\',\'' + tag + '\')"># ' + tag + '</a>';
  }).join('');
}

// ============================================
// Render Archives (dynamic, only years with posts, from 2026 down)
// ============================================
function renderArchives() {
  if (!archiveListEl) return;
  var yearMap = computeYears();
  var years = Object.keys(yearMap).sort(function(a, b) { return b - a; });

  archiveListEl.innerHTML = years.map(function(year) {
    return '<li><a href="javascript:void(0)" onclick="filterBy(\'year\',\'' + year + '\')">' +
      '<span>' + year + '</span>' +
      '<span class="archive-count">' + yearMap[year] + '</span></a></li>';
  }).join('');
}

// ============================================
// Render Profile Stats (dynamic)
// ============================================
function renderProfileStats() {
  if (!profileStats || profileStats.length < 4) return;
  var catMap = computeCategories();
  var tagMap = computeTags();
  var totalWords = 0;
  posts.forEach(function(p) {
    totalWords += (p.excerpt || '').length + (p.content || '').length;
  });
  profileStats[0].textContent = posts.length;
  profileStats[1].textContent = Object.keys(catMap).length;
  profileStats[2].textContent = Object.keys(tagMap).length;
  profileStats[3].textContent = (totalWords / 10000).toFixed(1);
}

// ============================================
// Render Post List (with filter)
// ============================================
function renderPostList() {
  if (!postListEl) return;

  var filtered = posts;
  if (currentFilter.type === 'category') {
    filtered = posts.filter(function(p) { return p.category === currentFilter.value; });
  } else if (currentFilter.type === 'tag') {
    filtered = posts.filter(function(p) { return p.tags.indexOf(currentFilter.value) !== -1; });
  } else if (currentFilter.type === 'year') {
    filtered = posts.filter(function(p) { return p.date.startsWith(currentFilter.value); });
  }

  var html = '';

  if (currentFilter.type) {
    html += '<div class="filter-bar" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:12px 16px;background:var(--accent-light);border-radius:var(--radius-sm);font-size:0.88rem;">';
    html += '<span><i class="fas fa-filter" style="margin-right:6px;color:var(--accent)"></i>';
    html += '筛选：' + currentFilter.value + '（' + filtered.length + ' 篇）</span>';
    html += '<a href="javascript:void(0)" onclick="clearFilter()" style="color:var(--accent);font-weight:500;">清除筛选</a>';
    html += '</div>';
  }

  if (filtered.length === 0) {
    html += '<div style="text-align:center;padding:60px 20px;color:var(--text-muted);">暂无相关文章</div>';
  } else {
    filtered.forEach(function(post) {
      html += '<article class="post-card">';
      html += '<div class="post-cover"><a href="post.html?id=' + post.id + '">';
      html += '<img src="' + post.cover + '" alt="' + post.title + '" loading="lazy"></a></div>';
      html += '<div class="post-body">';
      html += '<h2 class="post-title"><a href="post.html?id=' + post.id + '">' + post.title + '</a></h2>';
      html += '<p class="post-excerpt">' + post.excerpt + '</p>';
      html += '<div class="post-meta"><div class="post-meta-left">';
      html += '<span><i class="far fa-calendar-alt"></i> ' + post.date + '</span>';
      html += '<span><i class="far fa-folder"></i> ' + post.category + '</span>';
      html += '</div><a href="post.html?id=' + post.id + '" class="post-read-more">继续阅读</a></div>';
      html += '</div></article>';
    });
  }

  postListEl.innerHTML = html;
}

// ============================================
// Update active states on sidebar
// ============================================
function updateActiveStates() {
  document.querySelectorAll('.category-list a').forEach(function(a) {
    var name = a.querySelector('.cat-name');
    if (name) {
      var isActive = currentFilter.type === 'category' && currentFilter.value === name.textContent;
      a.style.background = isActive ? 'var(--accent-light)' : '';
      a.style.color = isActive ? 'var(--accent)' : '';
    }
  });

  document.querySelectorAll('.archive-list a').forEach(function(a) {
    var span = a.querySelector('span');
    if (span) {
      var isActive = currentFilter.type === 'year' && currentFilter.value === span.textContent;
      a.style.background = isActive ? 'var(--accent-light)' : '';
      a.style.color = isActive ? 'var(--accent)' : '';
    }
  });

  document.querySelectorAll('.tags-list .tag').forEach(function(a) {
    var tagText = a.textContent.replace('# ', '').trim();
    var isActive = currentFilter.type === 'tag' && currentFilter.value === tagText;
    a.style.color = isActive ? 'var(--accent)' : '';
    a.style.fontWeight = isActive ? '700' : '';
  });
}

// ============================================
// Render Recent Posts
// ============================================
function renderRecent() {
  if (!recentListEl) return;
  var recent = posts.slice(0, 5);
  recentListEl.innerHTML = recent.map(function(post) {
    return '<li><span class="recent-date">' + post.date + '</span>' +
      '<a href="post.html?id=' + post.id + '" class="recent-title">' + post.title + '</a></li>';
  }).join('');
}

// ============================================
// Back to Top
// ============================================
window.addEventListener('scroll', function() {
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// Search
// ============================================
function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('active');
  setTimeout(function() { searchInput && searchInput.focus(); }, 200);
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('active');
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
}

if (searchToggle) {
  searchToggle.addEventListener('click', function(e) {
    e.preventDefault();
    openSearch();
  });
}

if (searchClose) {
  searchClose.addEventListener('click', closeSearch);
}

if (searchOverlay) {
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) closeSearch();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSearch();
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
});

if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    var query = e.target.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    var results = posts.filter(function(post) {
      return post.title.toLowerCase().indexOf(query) !== -1 ||
        post.excerpt.toLowerCase().indexOf(query) !== -1 ||
        post.tags.some(function(t) { return t.toLowerCase().indexOf(query) !== -1; });
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">没有找到相关文章</div>';
      return;
    }

    searchResults.innerHTML = results.map(function(post) {
      return '<a href="post.html?id=' + post.id + '" class="search-result-item">' +
        '<h4>' + post.title + '</h4>' +
        '<p>' + post.date + ' · ' + post.category + '</p></a>';
    }).join('');
  });
}

// ============================================
// Article Detail Page
// ============================================
function renderArticle() {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  var post = posts.find(function(p) { return p.id === id; });

  if (!post) return;

  document.title = post.title + " - Contin's Blog";

  var heroEl = document.getElementById('articleHero');
  var titleEl = document.getElementById('articleTitle');
  var metaEl = document.getElementById('articleMeta');
  var textEl = document.getElementById('articleText');
  var tagsEl = document.getElementById('articleTags');
  var navEl = document.getElementById('articleNav');

  if (heroEl) heroEl.innerHTML = '<img src="' + post.cover + '" alt="' + post.title + '">';
  if (titleEl) titleEl.textContent = post.title;
  if (metaEl) metaEl.innerHTML = '<div class="post-meta-left">' +
    '<span><i class="far fa-calendar-alt"></i> ' + post.date + '</span>' +
    '<span><i class="far fa-folder"></i> ' + post.category + '</span></div>';
  if (textEl) textEl.innerHTML = post.content;
  if (tagsEl) tagsEl.innerHTML = post.tags.map(function(t) {
    return '<span class="article-tag"># ' + t + '</span>';
  }).join('');

  if (navEl) {
    var idx = posts.findIndex(function(p) { return p.id === id; });
    var navHTML = '';
    if (idx > 0) {
      var prev = posts[idx - 1];
      navHTML += '<a href="post.html?id=' + prev.id + '"><i class="fas fa-arrow-left"></i> ' + prev.title + '</a>';
    } else {
      navHTML += '<span></span>';
    }
    if (idx < posts.length - 1) {
      var next = posts[idx + 1];
      navHTML += '<a href="post.html?id=' + next.id + '">' + next.title + ' <i class="fas fa-arrow-right"></i></a>';
    }
    navEl.innerHTML = navHTML;
  }
}

// ============================================
// Initialize
// ============================================
renderCategories();
renderTags();
renderPostList();
renderRecent();
renderArchives();
renderProfileStats();

if (document.getElementById('articleTitle')) {
  renderArticle();
}
