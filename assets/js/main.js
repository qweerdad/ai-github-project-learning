/* TaskFlow 教程 HTML 学习版 - 交互脚本
   全部本地运行：无网络请求、无外部依赖、无个人数据上传 */
(function () {
  'use strict';
  var LS_THEME = 'tfc-theme';
  var LS_DONE = 'tfc-done';      // {pageId: true}
  var LS_CHECK = 'tfc-check';    // {pageId: {idx: true}}
  var LS_NAV = 'tfc-nav';        // 侧栏折叠状态

  function getJSON(k) { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var pageId = document.body.getAttribute('data-page') || location.pathname;

  /* ---------- 主题 ---------- */
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  var themeBtn = document.getElementById('themeBtn');
  function refreshThemeBtn() {
    if (!themeBtn) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var ti = themeBtn.querySelector('.ti'), tt = themeBtn.querySelector('.tt');
    if (ti) ti.textContent = dark ? '☀️' : '🌙';
    if (tt) tt.textContent = dark ? ' 浅色' : ' 深色';
  }
  if (themeBtn) {
    refreshThemeBtn();
    themeBtn.addEventListener('click', function () {
      var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(t); try { localStorage.setItem(LS_THEME, t); } catch (e) {}
      refreshThemeBtn();
    });
  }

  /* ---------- 侧栏（移动端开合 + 分组折叠记忆） ---------- */
  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('scrim');
  var menuBtn = document.getElementById('menuBtn');
  function closeSidebar() { if (sidebar) sidebar.classList.remove('open'); if (scrim) scrim.classList.remove('on'); }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    if (!sidebar) return;
    var open = sidebar.classList.toggle('open');
    if (scrim) scrim.classList.toggle('on', open);
  });
  if (scrim) scrim.addEventListener('click', closeSidebar);

  var navState = getJSON(LS_NAV);
  document.querySelectorAll('.nav-group').forEach(function (g, i) {
    var key = g.getAttribute('data-g') || String(i);
    var head = g.querySelector('.nav-head');
    if (navState[key] === false && !g.classList.contains('keep-open')) g.classList.add('closed');
    if (head) head.addEventListener('click', function () {
      g.classList.toggle('closed');
      navState[key] = !g.classList.contains('closed'); setJSON(LS_NAV, navState);
    });
  });

  /* ---------- 复制（clipboard API + execCommand 兜底，file:// 可用） ---------- */
  function copyText(text, btn) {
    function ok() { if (btn) { var o = btn.textContent; btn.textContent = '✓ 已复制'; btn.classList.add('ok'); setTimeout(function () { btn.textContent = o; btn.classList.remove('ok'); }, 1600); } }
    function legacy() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { if (btn) btn.textContent = '复制失败'; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, legacy);
    } else legacy();
  }
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var w = btn.closest('.code-wrap');
      var code = w && w.querySelector('pre code');
      if (code) copyText(code.innerText.replace(/\n$/, ''), btn);
    });
  });
  document.querySelectorAll('.qcopy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.closest('li');
      if (!li) return;
      var text = li.innerText.replace(/复制这条提问|✓ 已复制/g, '').trim();
      copyText(text, btn);
    });
  });

  /* ---------- 任务清单复选框持久化 ---------- */
  var checks = getJSON(LS_CHECK);
  var pageChecks = checks[pageId] || {};
  document.querySelectorAll('ul.task-list input[type="checkbox"]').forEach(function (box, i) {
    var key = 'c' + i;
    var li = box.closest('li');
    if (pageChecks[key]) { box.checked = true; if (li) li.classList.add('done'); }
    box.disabled = false;
    box.addEventListener('change', function () {
      if (!checks[pageId]) checks[pageId] = {};
      if (box.checked) { checks[pageId][key] = true; if (li) li.classList.add('done'); }
      else { delete checks[pageId][key]; if (li) li.classList.remove('done'); }
      setJSON(LS_CHECK, checks);
    });
  });

  /* ---------- 章节完成标记 ---------- */
  var done = getJSON(LS_DONE);
  var markBtn = document.getElementById('markDone');
  function refreshDoneUI() {
    var isDone = !!done[pageId];
    if (markBtn) {
      markBtn.textContent = isDone ? '✓ 已完成（点击取消）' : '标记本章为已完成';
      markBtn.classList.toggle('on', isDone);
    }
    document.querySelectorAll('.nav-done[data-p]').forEach(function (d) { d.classList.toggle('on', !!done[d.getAttribute('data-p')]); });
    document.querySelectorAll('.card[data-p]').forEach(function (c) { c.classList.toggle('done', !!done[c.getAttribute('data-p')]); });
    var bar = document.getElementById('homeBar'), pct = document.getElementById('homePct');
    if (bar) {
      var total = parseInt(bar.getAttribute('data-total') || '8', 10);
      var n = (bar.getAttribute('data-pages') || '').split(',').filter(function (p) { return done[p]; }).length;
      bar.style.width = Math.round(n / total * 100) + '%';
      if (pct) pct.textContent = n + ' / ' + total + ' 章';
    }
  }
  if (markBtn) markBtn.addEventListener('click', function () {
    if (done[pageId]) delete done[pageId]; else done[pageId] = true;
    setJSON(LS_DONE, done); refreshDoneUI();
  });
  refreshDoneUI();

  /* ---------- 阅读进度条 + 返回顶部 ---------- */
  var readbar = document.getElementById('readbar');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (readbar) readbar.style.width = max > 0 ? (h.scrollTop / max * 100) + '%' : '0';
    if (toTop) toTop.classList.toggle('on', h.scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- 右侧 TOC scroll-spy ---------- */
  var tocLinks = document.querySelectorAll('.toc-rail a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var a = map[e.target.id]; if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-64px 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) obs.observe(el); });
  }

  /* ---------- 移动端"本页目录"（克隆右栏） ---------- */
  if (window.matchMedia('(max-width: 1240px)').matches) {
    var rail = document.querySelector('.toc-rail');
    var art = document.querySelector('article');
    if (rail && art && rail.children.length > 1) {
      var det = document.createElement('details');
      det.className = 'generic toc-mobile';
      var sum = document.createElement('summary'); sum.textContent = '本页目录';
      det.appendChild(sum);
      var inner = rail.cloneNode(true);
      inner.className = ''; inner.removeAttribute('class');
      inner.style.cssText = 'position:static;height:auto;width:auto;padding:8px 0 8px 10px;';
      det.appendChild(inner); art.insertBefore(det, art.children[1] || null);
    }
  }

  /* ---------- 图片灯箱 ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.cap');
    document.querySelectorAll('article img').forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.src; lbImg.alt = img.alt || '';
        lbCap.textContent = img.alt || '';
        lb.classList.add('on');
      });
    });
    lb.addEventListener('click', function () { lb.classList.remove('on'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
  }
})();
