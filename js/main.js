// ============================================================
//  main.js — بقية الله للعلوم الإسلامية
// ============================================================

var CFG = {};
var ALL_PUBS = [];

/* ── بداية الصفحة ── */
window.addEventListener('load', function () {
  setTimeout(function () {
    var loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 1900);
});

window.addEventListener('scroll', function () {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('sc', window.scrollY > 50);
});

function toggleMob() {
  var mn = document.getElementById('mob-nav');
  if (mn) mn.classList.toggle('open');
}

/* ── كشف العناصر عند التمرير ── */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.1 });

function initReveal() {
  document.querySelectorAll('.rv').forEach(function (el) {
    revealObserver.observe(el);
  });
}

/* ── جزيئات الخلفية ── */
function initParticles() {
  var c = document.getElementById('h-parts');
  if (!c) return;
  for (var i = 0; i < 16; i++) {
    var p = document.createElement('div');
    p.className = 'h-part';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = (Math.random() * 3 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 14 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = (Math.random() * 0.4 + 0.1).toString();
    c.appendChild(p);
  }
}

/* ── الإعدادات ── */
async function loadSettings() {
  try {
    var d = await sbGet('settings', '?id=eq.1');
    if (d && d[0]) { CFG = d[0]; applySettings(CFG); }
  } catch (e) { console.warn('settings error', e); }
}

function applySettings(s) {
  var logo = s.logo_data || (typeof LOGO !== 'undefined' ? LOGO : '');
  ['ld-img', 'nav-logo-img', 'hero-logo-img', 'ft-logo-img'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.src = logo;
  });
  if (s.school_name) {
    setTxt('nav-name', s.school_name);
    setTxt('ft-name', s.school_name);
    document.title = s.school_name + ' — كربلاء المقدسة';
    var h = document.getElementById('hero-title');
    if (h) h.innerHTML = s.school_name.includes('بقية الله')
      ? s.school_name.replace('بقية الله', '<span class="h-gold">بقية الله</span>')
      : s.school_name;
  }
  if (s.city) setTxt('nav-city', s.city);
  if (s.hero_quran !== undefined) setTxt('hero-quran', s.hero_quran);
  if (s.hero_sub) {
    var hs = document.getElementById('hero-sub');
    if (hs) hs.innerHTML = s.hero_sub.replace(/\n/g, '<br>');
  }
  ['1','2','3','4'].forEach(function (n) {
    if (s['stat' + n]) setTxt('st' + n, s['stat' + n]);
    if (s['stat' + n + '_lbl']) setTxt('st' + n + 'l', s['stat' + n + '_lbl']);
  });
  if (s.about_title) setTxt('about-title', s.about_title);
  if (s.about_p1) setTxt('about-p1', s.about_p1);
  if (s.about_p2) setTxt('about-p2', s.about_p2);
  ['1','2','3','4'].forEach(function (n) { if (s['af' + n]) setTxt('af' + n, s['af' + n]); });
  if (s.av_title) setTxt('av-title', s.av_title);
  if (s.av_sub) setTxt('av-sub', s.av_sub);
  if (s.av_addr) { var aa = document.getElementById('av-addr'); if (aa) aa.innerHTML = s.av_addr.replace(/\n/g,'<br>'); }
  if (s.av_time) { var at = document.getElementById('av-time'); if (at) at.innerHTML = s.av_time.replace(/\n/g,'<br>'); }
  if (s.reg_title) setTxt('reg-title', s.reg_title);
  if (s.reg_desc) setTxt('reg-desc', s.reg_desc);
  if (s.footer_tagline) setTxt('ft-tag', s.footer_tagline);
  if (s.footer_addr) { var fa = document.getElementById('ft-addr'); if (fa) fa.innerHTML = '📍 ' + s.footer_addr.replace(/\n/g,'<br>'); }
  if (s.footer_copy) setTxt('ft-copy', s.footer_copy);
  var wa = 'https://wa.me/' + (s.wa_number || '9647751886865');
  setHref(['lk-wa','about-wa','reg-wa','ft-wa'], wa);
  if (s.ig_link) setHref(['lk-ig','ft-ig'], s.ig_link);
  if (s.ig_handle) setTxt('ig-hd', s.ig_handle);
  if (s.fb_link) setHref(['lk-fb','ft-fb'], s.fb_link);
  if (s.fb_handle) setTxt('fb-hd', s.fb_handle);
  if (s.ig2_link) setHref(['lk-ig2'], s.ig2_link);
  if (s.ig2_handle) setTxt('ig2-hd', s.ig2_handle);
  if (s.sys_link) setHref(['nav-sys','ft-sys'], s.sys_link);
  if (s.maps_link) setHref(['lk-maps','ft-maps'], s.maps_link);
  if (s.linktree_link) setHref(['lk-linktree','ft-linktree'], s.linktree_link);
  if (s.marquee_items) buildMarquee(s.marquee_items);
  if (s.colors && s.colors !== '{}') { try { applyColors(JSON.parse(s.colors)); } catch(e){} }
  if (s.font_headings) document.documentElement.style.setProperty('--fh', "'" + s.font_headings + "',serif");
  if (s.font_body) document.documentElement.style.setProperty('--fb', "'" + s.font_body + "',sans-serif");
  if (s.bg_pattern) applyBgPattern(s.bg_pattern);
  if (s.visibility && s.visibility !== '{}') {
    try {
      var v = JSON.parse(s.visibility);
      Object.keys(v).forEach(function (k) {
        var el = document.getElementById(k);
        if (el) el.style.display = v[k] ? '' : 'none';
      });
    } catch(e) {}
  }
  if (s.sections_order && s.sections_order !== '[]') {
    try { applySectionsOrder(JSON.parse(s.sections_order)); } catch(e) {}
  }
}

/* ── الأخبار ── */
async function loadNews() {
  var g = document.getElementById('news-grid');
  if (!g) return;
  try {
    var d = await sbGet('news', '?order=created_at.desc');
    if (!d || !d.length) { g.innerHTML = '<div class="news-empty">لا توجد أخبار بعد</div>'; return; }
    g.innerHTML = d.map(function (n) {
      return '<div class="nc rv">'
        + '<div class="nc-img">' + (n.img_data ? '<img src="' + n.img_data + '" alt="' + n.title + '"><div class="nc-ov"></div>' : (n.icon || '📰')) + '</div>'
        + '<div class="nc-b">'
        + '<span class="nc-cat">' + (n.category || 'إعلان') + '</span>'
        + '<div class="nc-ttl">' + n.title + '</div>'
        + '<div class="nc-txt">' + n.body + '</div>'
        + '<div class="nc-dt">📅 ' + (n.news_date || (n.created_at || '').split('T')[0]) + '</div>'
        + '</div></div>';
    }).join('');
    initReveal();
  } catch(e) { g.innerHTML = '<div class="news-empty">تعذّر تحميل الأخبار</div>'; }
}

/* ── المعرض ── */
async function loadGallery() {
  try {
    var d = await sbGet('gallery', '?order=sort_order.asc,created_at.asc');
    if (!d || !d.length) return;
    var gg = document.getElementById('gal-grid');
    if (!gg) return;
    gg.innerHTML = d.map(function (g) {
      return '<div class="gi' + (g.is_big ? ' big' : '') + ' rv">'
        + (g.img_data ? '<img src="' + g.img_data + '" alt="' + g.title + '">' : '<div style="font-size:44px">🖼️</div>')
        + '<div class="gi-lbl">' + g.title + '</div>'
        + '</div>';
    }).join('');
    initReveal();
  } catch(e) {}
}

/* ── المنشورات ── */
async function loadPubs() {
  var g = document.getElementById('pub-grid');
  if (!g) return;
  try {
    var d = await sbGet('publications', '?order=created_at.desc');
    ALL_PUBS = d || [];
    renderPubs('all');
  } catch(e) {
    g.innerHTML = '<div class="news-empty">تعذّر تحميل المنشورات</div>';
  }
}

function renderPubs(filter) {
  var g = document.getElementById('pub-grid');
  if (!g) return;

  var list = (filter === 'all')
    ? ALL_PUBS
    : ALL_PUBS.filter(function (p) { return p.pub_type === filter; });

  if (!list.length) {
    g.innerHTML = '<div class="news-empty">لا توجد منشورات في هذه الفئة</div>';
    return;
  }

  /* نبني الـ HTML وندمج الـ data-pubid مباشرةً */
  var html = '';
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var isFile = (p.pub_type === 'file');
    var safeId = String(p.id).replace(/"/g, '');

    html += '<div class="pub-c rv" data-pubid="' + safeId + '">';

    /* الصورة */
    html += '<div class="pub-img">';
    if (p.img_data) {
      html += '<img src="' + p.img_data + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">';
    } else {
      html += '<span style="font-size:46px">' + (isFile ? '📎' : '✏️') + '</span>';
    }
    html += '</div>';

    /* النص */
    html += '<div class="pub-b">';
    html += '<span class="pub-badge ' + (isFile ? 'badge-file' : 'badge-art') + '">' + (isFile ? '📎 ملف' : '✏️ مقال') + '</span>';
    html += '<div class="pub-ttl">' + p.title + '</div>';

    /* معاينة قصيرة للنص */
    if (p.body) {
      var preview = p.body.length > 120 ? p.body.substring(0, 120) + '…' : p.body;
      html += '<div class="pub-txt">' + preview + '</div>';
    }

    html += '<div class="pub-ft">';
    html += '<span class="pub-auth">' + (p.author ? '✍️ ' + p.author : '') + '</span>';
    if (isFile && p.file_data) {
      html += '<span class="pub-dl">📎 ملف</span>';
    }
    html += '</div>';
    html += '<span class="pub-read-more">اقرأ المزيد ←</span>';
    html += '</div></div>';
  }

  g.innerHTML = html;

  /* ربط الأحداث عبر التفويض — طريقة واحدة آمنة 100% */
  g.addEventListener('click', handlePubClick);

  initReveal();
}

/* معالج نقر المنشور — يُشغَّل مرة واحدة بالتفويض */
function handlePubClick(e) {
  /* ابحث عن أقرب عنصر pub-c */
  var card = e.target;
  while (card && !card.classList.contains('pub-c')) {
    card = card.parentElement;
  }
  if (!card) return;

  var pubId = card.getAttribute('data-pubid');
  if (!pubId) return;

  /* ابحث عن المنشور بالـ id */
  var pub = null;
  for (var k = 0; k < ALL_PUBS.length; k++) {
    if (String(ALL_PUBS[k].id) === pubId) { pub = ALL_PUBS[k]; break; }
  }

  if (pub) openPubModal(pub);
}

function filterPubs(type, btn) {
  /* أزل المستمع القديم من الـ grid قبل إعادة البناء */
  var g = document.getElementById('pub-grid');
  if (g) g.removeEventListener('click', handlePubClick);

  document.querySelectorAll('.pub-tab').forEach(function (b) { b.classList.remove('on'); });
  if (btn) btn.classList.add('on');
  renderPubs(type);
}

/* ══════════════════════════════════════════
   نافذة المنشور الكاملة
══════════════════════════════════════════ */
function openPubModal(pub) {
  var ov = document.getElementById('pub-modal-ov');
  var inner = document.getElementById('pub-modal-inner');
  if (!ov || !inner) return;

  var isFile = (pub.pub_type === 'file');
  var dateStr = pub.pub_date || (pub.created_at ? pub.created_at.split('T')[0] : '') || '';

  var html = '';

  /* الصورة كاملة */
  if (pub.img_data) {
    html += '<div class="pub-modal-img-wrap">'
          + '<img src="' + pub.img_data + '" alt="' + pub.title + '" class="pub-modal-img">'
          + '</div>';
  } else {
    html += '<div class="pub-modal-img-placeholder">' + (isFile ? '📎' : '✏️') + '</div>';
  }

  /* المحتوى */
  html += '<div class="pub-modal-body">';
  html += '<span class="pub-modal-badge ' + (isFile ? 'badge-file' : 'badge-art') + '">'
       + (isFile ? '📎 ملف' : '✏️ مقال') + '</span>';
  html += '<div class="pub-modal-title">' + pub.title + '</div>';

  if (pub.author || dateStr || pub.category) {
    html += '<div class="pub-modal-meta">';
    if (pub.author)   html += '<span>✍️ ' + pub.author + '</span>';
    if (dateStr)      html += '<span>📅 ' + dateStr + '</span>';
    if (pub.category) html += '<span>🏷️ ' + pub.category + '</span>';
    html += '</div>';
  }

  /* النص الكامل */
  if (pub.body) {
    html += '<div class="pub-modal-content">' + htmlSafe(pub.body) + '</div>';
  }

  /* زر تحميل الملف */
  if (isFile && pub.file_data) {
    html += '<div class="pub-modal-actions">'
          + '<a class="btn-p" href="' + pub.file_data + '" download="' + (pub.file_name || 'ملف') + '">⬇️ تحميل الملف</a>'
          + '</div>';
  }

  html += '</div>';

  inner.innerHTML = html;
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  ov.scrollTop = 0;
}

function closePubModal() {
  var ov = document.getElementById('pub-modal-ov');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

/* تحويل النص لـ HTML آمن مع الأسطر */
function htmlSafe(t) {
  if (!t) return '';
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

/* إنشاء النافذة مرة واحدة في الـ DOM */
function createPubModalDOM() {
  if (document.getElementById('pub-modal-ov')) return;

  var ov = document.createElement('div');
  ov.id = 'pub-modal-ov';
  ov.className = 'pub-modal-ov';

  var box = document.createElement('div');
  box.className = 'pub-modal';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'pub-modal-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closePubModal();
  });

  var inner = document.createElement('div');
  inner.id = 'pub-modal-inner';

  box.appendChild(closeBtn);
  box.appendChild(inner);
  ov.appendChild(box);
  document.body.appendChild(ov);

  /* إغلاق عند الضغط خارج النافذة */
  ov.addEventListener('click', function (e) {
    if (e.target === ov) closePubModal();
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closePubModal();
});

/* ── مساعدات ── */
function buildMarquee(items) {
  var arr = items.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!arr.length) return;
  var t = document.getElementById('mq-track');
  if (!t) return;
  var dbl = arr.concat(arr);
  t.innerHTML = dbl.map(function (i) {
    return '<span>' + i + '</span><span class="mq-dot">✦</span>';
  }).join('');
}

function applyColors(c) {
  var map = { g1:'--gold', g2:'--gold2', d1:'--dark', d2:'--dark2', card:'--card', txt:'--text', txtm:'--textm' };
  Object.keys(map).forEach(function (k) {
    if (c[k]) document.documentElement.style.setProperty(map[k], c[k]);
  });
}

function applyBgPattern(p) {
  var el = document.querySelector('.h-pat');
  if (!el) return;
  var pats = {
    hexagon: "url(\"data:image/svg+xml,%3Csvg width='70' height='70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 3L67 21L67 49L35 67L3 49L3 21Z' stroke='%23c9a84c' stroke-width='0.35' fill='none' opacity='0.09'/%3E%3C/svg%3E\")",
    dots:    'radial-gradient(circle,rgba(201,168,76,.14) 1px,transparent 1px)',
    lines:   'repeating-linear-gradient(45deg,rgba(201,168,76,.06) 0,rgba(201,168,76,.06) 1px,transparent 0,transparent 50%)',
    none:    'none'
  };
  el.style.backgroundImage = pats[p] || pats.hexagon;
  el.style.backgroundSize  = p === 'dots' ? '28px 28px' : p === 'lines' ? '18px 18px' : '70px 70px';
}

function applySectionsOrder(order) {
  var secs = ['news','gallery','publications','about','contact','reg'];
  var footer = document.querySelector('footer');
  order.filter(function (s) { return secs.indexOf(s) > -1; }).forEach(function (id) {
    var el = document.getElementById(id);
    if (el && footer) document.body.insertBefore(el, footer);
  });
}

function setTxt(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setHref(ids, url) {
  (Array.isArray(ids) ? ids : [ids]).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = url;
  });
}

/* ── تهيئة عند تحميل الصفحة ── */
document.addEventListener('DOMContentLoaded', function () {
  createPubModalDOM();
  createTeacherModalDOM();
  initParticles();
  initReveal();
  loadSettings();
  loadNews();
  loadGallery();
  loadPubs();
  loadAudio();
  loadBooks();
  var nd = document.getElementById('n-date');
  if (nd) nd.value = new Date().toISOString().split('T')[0];
  var pd = document.getElementById('p-date');
  if (pd) pd.value = new Date().toISOString().split('T')[0];
  var ad = document.getElementById('au-date');
  if (ad) ad.value = new Date().toISOString().split('T')[0];
});

/* ══════════════════════════════════
   الدروس الصوتية
══════════════════════════════════ */
async function loadAudio() {
  var g = document.getElementById('audio-grid');
  if (!g) return;
  try {
    var d = await sbGet('audio_lessons', '?order=author.asc,created_at.desc');
    if (!d || !d.length) {
      g.innerHTML = '<div class="audio-empty">🎙️ لا توجد دروس صوتية بعد</div>';
      return;
    }
    // تجميع الدروس حسب الأستاذ
    var teachers = {};
    d.forEach(function(a) {
      var name = a.author || 'غير محدد';
      if (!teachers[name]) teachers[name] = [];
      teachers[name].push(a);
    });

    // عرض بطاقة لكل أستاذ
    g.innerHTML = Object.keys(teachers).map(function(name) {
      var lessons = teachers[name];
      var count = lessons.length;
      // صورة الأستاذ من أول درس عنده
      var thumb = lessons[0].img_data
        ? '<img src="' + lessons[0].img_data + '" alt="">'
        : '👤';
      // تجميع أسماء السلاسل
      var cats = [];
      lessons.forEach(function(l){ if(l.category && cats.indexOf(l.category)===-1) cats.push(l.category); });
      return '<div class="teacher-c rv" onclick="openTeacherModal(\'' + encodeURIComponent(name) + '\')">'
        + '<div class="teacher-thumb">' + thumb + '</div>'
        + '<div class="teacher-name">' + name + '</div>'
        + '<div class="teacher-count">' + count + ' درس</div>'
        + (cats.length ? '<div class="teacher-cats">' + cats.slice(0,2).join(' · ') + '</div>' : '')
        + '<div class="teacher-arrow">اضغط لعرض الدروس ←</div>'
        + '</div>';
    }).join('');
    initReveal();
  } catch(e) {
    g.innerHTML = '<div class="audio-empty">تعذّر تحميل الدروس</div>';
  }
}

// فتح نافذة دروس أستاذ معين
var ALL_AUDIO = [];

async function openTeacherModal(encodedName) {
  var name = decodeURIComponent(encodedName);
  var ov = document.getElementById('teacher-modal-ov');
  var inner = document.getElementById('teacher-modal-inner');
  var title = document.getElementById('teacher-modal-title');
  if (!ov || !inner) return;

  title.textContent = '🎙️ دروس ' + name;
  inner.innerHTML = '<div class="audio-empty">⏳ جاري التحميل...</div>';
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    var d = await sbGet('audio_lessons', '?author=eq.' + encodeURIComponent(name) + '&order=created_at.asc');
    if (!d || !d.length) {
      inner.innerHTML = '<div class="audio-empty">لا توجد دروس</div>';
      return;
    }
    inner.innerHTML = d.map(function(a) {
      var audioSrc = a.audio_url || a.audio_data || '';
      var dateStr = a.lesson_date || (a.created_at || '').split('T')[0] || '';
      return '<div class="audio-c">'
        + '<div class="audio-header">'
        + '<div class="audio-thumb">🎙️</div>'
        + '<div class="audio-info">'
        + '<div class="audio-title">' + a.title + '</div>'
        + (a.category ? '<div class="audio-cat">📚 ' + a.category + '</div>' : '')
        + '</div></div>'
        + (a.description ? '<div class="audio-desc">' + a.description + '</div>' : '')
        + (audioSrc ? '<div class="audio-player"><audio controls preload="none"><source src="' + audioSrc + '"></audio></div>' : '')
        + '<div class="audio-footer">'
        + '<span>' + (dateStr ? '📅 ' + dateStr : '') + '</span>'
        + (audioSrc ? '<a class="audio-dl" href="' + audioSrc + '" download="' + a.title + '">⬇️ تحميل</a>' : '')
        + '</div></div>';
    }).join('');
  } catch(e) {
    inner.innerHTML = '<div class="audio-empty">تعذّر تحميل الدروس</div>';
  }
}

function closeTeacherModal() {
  var ov = document.getElementById('teacher-modal-ov');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

function createTeacherModalDOM() {
  if (document.getElementById('teacher-modal-ov')) return;
  var ov = document.createElement('div');
  ov.id = 'teacher-modal-ov';
  ov.className = 'pub-modal-ov';
  ov.innerHTML =
    '<div class="pub-modal" style="max-width:860px">'
    + '<button class="pub-modal-close" id="teacher-modal-close">✕</button>'
    + '<div style="padding:24px 28px 10px;border-bottom:1px solid var(--border)">'
    + '<div id="teacher-modal-title" style="font-family:var(--fh);font-size:20px;color:var(--gold)"></div>'
    + '</div>'
    + '<div id="teacher-modal-inner" style="padding:20px;display:flex;flex-direction:column;gap:14px;max-height:75vh;overflow-y:auto"></div>'
    + '</div>';
  document.body.appendChild(ov);
  ov.addEventListener('click', function(e){ if(e.target===ov) closeTeacherModal(); });
  document.getElementById('teacher-modal-close').addEventListener('click', closeTeacherModal);
}

/* ══════════════════════════════════
   الكتب المنهجية
══════════════════════════════════ */
async function loadBooks() {
  var g = document.getElementById('books-grid');
  if (!g) return;
  try {
    var d = await sbGet('books', '?order=created_at.desc');
    if (!d || !d.length) {
      g.innerHTML = '<div class="books-empty">📚 لا توجد كتب بعد</div>';
      return;
    }
    g.innerHTML = d.map(function(b) {
      var cover = b.img_data ? '<img src="' + b.img_data + '" alt="' + b.title + '">' : '📖';
      // يدعم file_url (Storage) و file_data (base64 قديم)
      var fileSrc = b.file_url || b.file_data || '';
      return '<div class="book-c rv">'
        + '<div class="book-cover">' + cover
        + (b.level ? '<span class="book-level">' + b.level + '</span>' : '')
        + '</div>'
        + '<div class="book-body">'
        + (b.category ? '<span class="book-cat">' + b.category + '</span>' : '')
        + '<div class="book-title">' + b.title + '</div>'
        + (b.author ? '<div class="book-author">✍️ ' + b.author + '</div>' : '')
        + (b.description ? '<div class="book-desc">' + b.description + '</div>' : '')
        + (fileSrc ? '<a class="book-dl" href="' + fileSrc + '" target="_blank">📥 تحميل PDF</a>' : '')
        + '</div></div>';
    }).join('');
    initReveal();
  } catch(e) {
    g.innerHTML = '<div class="books-empty">تعذّر تحميل الكتب</div>';
  }
}
