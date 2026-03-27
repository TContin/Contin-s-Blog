// ============================================
// Theme Toggle
// ============================================
(function() {
  var themeToggle = document.querySelector('.theme-toggle');

  function initTheme() {
    var saved = localStorage.getItem('blog-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    var icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('blog-theme', next);
      updateThemeIcon(next);
    });
  }

  initTheme();
})();

// ============================================
// Filter State
// ============================================
var currentFilter = { type: null, value: null };

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
// Compute stats from posts
// ============================================
function computeCategories() {
  var map = {};
  posts.forEach(function(p) { map[p.category] = (map[p.category] || 0) + 1; });
  return map;
}

function computeTags() {
  var map = {};
  posts.forEach(function(p) {
    p.tags.forEach(function(t) { map[t] = (map[t] || 0) + 1; });
  });
  return map;
}

function computeYears() {
  var map = {};
  posts.forEach(function(p) {
    var y = p.date.split('-')[0];
    map[y] = (map[y] || 0) + 1;
  });
  return map;
}

// ============================================
// Render sidebar categories
// ============================================
function renderCategories() {
  var el = document.querySelector('.category-list');
  if (!el) return;
  var catMap = computeCategories();
  var cats = Object.keys(catMap).sort(function(a, b) { return catMap[b] - catMap[a]; });
  el.innerHTML = cats.map(function(cat) {
    return '<li><a href="javascript:void(0)" onclick="filterBy(\'category\',\'' + cat + '\')">' +
      '<span class="cat-name">' + cat + '</span>' +
      '<span class="cat-count">' + catMap[cat] + '</span></a></li>';
  }).join('');
}

// ============================================
// Render sidebar tags
// ============================================
function renderTagsSidebar() {
  var el = document.querySelector('.tags-list');
  if (!el) return;
  var tagMap = computeTags();
  var tags = Object.keys(tagMap).sort(function(a, b) { return tagMap[b] - tagMap[a]; });
  el.innerHTML = tags.map(function(tag) {
    return '<a href="javascript:void(0)" class="tag" onclick="filterBy(\'tag\',\'' + tag + '\')"># ' + tag + '</a>';
  }).join('');
}

// ============================================
// Render sidebar archives (only years with posts)
// ============================================
function renderArchives() {
  var el = document.getElementById('archiveList');
  if (!el) return;
  var yearMap = computeYears();
  var years = Object.keys(yearMap).sort(function(a, b) { return parseInt(b) - parseInt(a); });
  el.innerHTML = years.map(function(year) {
    return '<li><a href="javascript:void(0)" onclick="filterBy(\'year\',\'' + year + '\')">' +
      '<span>' + year + '</span>' +
      '<span class="archive-count">' + yearMap[year] + '</span></a></li>';
  }).join('');
}

// ============================================
// Render profile stats (dynamic)
// ============================================
function renderProfileStats() {
  var els = document.querySelectorAll('.stat-value');
  if (!els || els.length < 4) return;
  var catMap = computeCategories();
  var tagMap = computeTags();
  els[0].textContent = posts.length;
  els[1].textContent = Object.keys(catMap).length;
  els[2].textContent = Object.keys(tagMap).length;
  var totalChars = 0;
  posts.forEach(function(p) { totalChars += (p.excerpt || '').length + (p.content || '').length; });
  els[3].textContent = (totalChars / 10000).toFixed(1);
}

// ============================================
// Render post list (with filter)
// ============================================
function renderPostList() {
  var el = document.getElementById('postList');
  if (!el) return;

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
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:12px 16px;background:var(--accent-light);border-radius:8px;font-size:0.88rem;">';
    html += '<span><i class="fas fa-filter" style="margin-right:6px;color:var(--accent)"></i>筛选：' + currentFilter.value + '（' + filtered.length + ' 篇）</span>';
    html += '<a href="javascript:void(0)" onclick="clearFilter()" style="color:var(--accent);font-weight:500;">清除筛选</a></div>';
  }

  if (filtered.length === 0) {
    html += '<div style="text-align:center;padding:60px 20px;color:var(--text-muted);">暂无相关文章</div>';
  } else {
    filtered.forEach(function(post) {
      html += '<article class="post-card">';
      html += '<div class="post-cover"><a href="post.html?id=' + post.id + '"><img src="' + post.cover + '" alt="' + post.title + '" loading="lazy"></a></div>';
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
  el.innerHTML = html;
}

// ============================================
// Update active states
// ============================================
function updateActiveStates() {
  document.querySelectorAll('.category-list a').forEach(function(a) {
    var name = a.querySelector('.cat-name');
    if (!name) return;
    var active = currentFilter.type === 'category' && currentFilter.value === name.textContent;
    a.style.background = active ? 'var(--accent-light)' : '';
    a.style.color = active ? 'var(--accent)' : '';
  });
  document.querySelectorAll('#archiveList a').forEach(function(a) {
    var span = a.querySelector('span');
    if (!span) return;
    var active = currentFilter.type === 'year' && currentFilter.value === span.textContent;
    a.style.background = active ? 'var(--accent-light)' : '';
    a.style.color = active ? 'var(--accent)' : '';
  });
  document.querySelectorAll('.tags-list .tag').forEach(function(a) {
    var t = a.textContent.replace('# ', '').trim();
    var active = currentFilter.type === 'tag' && currentFilter.value === t;
    a.style.color = active ? 'var(--accent)' : '';
    a.style.fontWeight = active ? '700' : '';
  });
}

// ============================================
// Render recent posts
// ============================================
function renderRecent() {
  var el = document.getElementById('recentList');
  if (!el) return;
  var recent = posts.slice(0, 5);
  el.innerHTML = recent.map(function(post) {
    return '<li><span class="recent-date">' + post.date + '</span>' +
      '<a href="post.html?id=' + post.id + '" class="recent-title">' + post.title + '</a></li>';
  }).join('');
}

// ============================================
// Back to Top
// ============================================
(function() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============================================
// Search
// ============================================
(function() {
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var closeBtn = document.getElementById('searchClose');
  var toggle = document.querySelector('.search-toggle');

  function open() {
    if (!overlay) return;
    overlay.classList.add('active');
    setTimeout(function() { input && input.focus(); }, 200);
  }
  function close() {
    if (!overlay) return;
    overlay.classList.remove('active');
    if (input) input.value = '';
    if (results) results.innerHTML = '';
  }

  if (toggle) toggle.addEventListener('click', function(e) { e.preventDefault(); open(); });
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
  });

  if (input) {
    input.addEventListener('input', function(e) {
      var q = e.target.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ''; return; }
      var r = posts.filter(function(p) {
        return p.title.toLowerCase().indexOf(q) !== -1 ||
          p.excerpt.toLowerCase().indexOf(q) !== -1 ||
          p.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; });
      });
      if (r.length === 0) { results.innerHTML = '<div class="search-empty">没有找到相关文章</div>'; return; }
      results.innerHTML = r.map(function(p) {
        return '<a href="post.html?id=' + p.id + '" class="search-result-item"><h4>' + p.title + '</h4><p>' + p.date + ' · ' + p.category + '</p></a>';
      }).join('');
    });
  }
})();

// ============================================
// Article Detail
// ============================================
function renderArticle() {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  var post = posts.find(function(p) { return p.id === id; });
  if (!post) return;

  document.title = post.title + " - Contin's Blog";
  var hero = document.getElementById('articleHero');
  var title = document.getElementById('articleTitle');
  var meta = document.getElementById('articleMeta');
  var text = document.getElementById('articleText');
  var tags = document.getElementById('articleTags');
  var nav = document.getElementById('articleNav');

  if (hero) hero.innerHTML = '<img src="' + post.cover + '" alt="' + post.title + '">';
  if (title) title.textContent = post.title;
  if (meta) meta.innerHTML = '<div class="post-meta-left"><span><i class="far fa-calendar-alt"></i> ' + post.date + '</span><span><i class="far fa-folder"></i> ' + post.category + '</span></div>';
  if (text) text.innerHTML = post.content;
  if (tags) tags.innerHTML = post.tags.map(function(t) { return '<span class="article-tag"># ' + t + '</span>'; }).join('');

  if (nav) {
    var idx = posts.findIndex(function(p) { return p.id === id; });
    var h = '';
    if (idx > 0) h += '<a href="post.html?id=' + posts[idx-1].id + '"><i class="fas fa-arrow-left"></i> ' + posts[idx-1].title + '</a>';
    else h += '<span></span>';
    if (idx < posts.length - 1) h += '<a href="post.html?id=' + posts[idx+1].id + '">' + posts[idx+1].title + ' <i class="fas fa-arrow-right"></i></a>';
    nav.innerHTML = h;
  }
}

// ============================================
// Initialize
// ============================================
renderCategories();
renderTagsSidebar();
renderArchives();
renderProfileStats();
renderPostList();
renderRecent();

if (document.getElementById('articleTitle')) {
  renderArticle();
}
