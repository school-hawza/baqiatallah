let CFG={};
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('hide'),1900));
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('sc',scrollY>50));
function toggleMob(){document.getElementById('mob-nav').classList.toggle('open');}

const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.1});
function initReveal(){document.querySelectorAll('.rv').forEach(el=>ro.observe(el));}

function initParticles(){
  const c=document.getElementById('h-parts');if(!c)return;
  for(let i=0;i<16;i++){
    const p=document.createElement('div');p.className='h-part';
    p.style.cssText='left:'+Math.random()*100+'%;width:'+(Math.random()*3+1)+'px;height:'+(Math.random()*3+1)+'px;animation-duration:'+(Math.random()*14+8)+'s;animation-delay:'+(Math.random()*10)+'s;opacity:'+(Math.random()*.4+.1);
    c.appendChild(p);
  }
}

async function loadSettings(){
  try{const d=await sbGet('settings','?id=eq.1');if(d&&d[0]){CFG=d[0];applySettings(CFG);}}
  catch(e){console.warn('settings error',e);}
}

function applySettings(s){
  const logo=s.logo_data||LOGO;
  ['ld-img','nav-logo-img','hero-logo-img','ft-logo-img'].forEach(id=>{const el=document.getElementById(id);if(el)el.src=logo;});
  if(s.school_name){
    setTxt('nav-name',s.school_name);setTxt('ft-name',s.school_name);
    document.title=s.school_name+' — كربلاء المقدسة';
    const h=document.getElementById('hero-title');
    if(h)h.innerHTML=s.school_name.includes('بقية الله')?s.school_name.replace('بقية الله','<span class="h-gold">بقية الله</span>'):s.school_name;
  }
  if(s.city)setTxt('nav-city',s.city);
  if(s.hero_quran!==undefined)setTxt('hero-quran',s.hero_quran);
  if(s.hero_sub){const el=document.getElementById('hero-sub');if(el)el.innerHTML=s.hero_sub.replace(/\n/g,'<br>');}
  ['1','2','3','4'].forEach(n=>{
    if(s['stat'+n])setTxt('st'+n,s['stat'+n]);
    if(s['stat'+n+'_lbl'])setTxt('st'+n+'l',s['stat'+n+'_lbl']);
  });
  if(s.about_title)setTxt('about-title',s.about_title);
  if(s.about_p1)setTxt('about-p1',s.about_p1);
  if(s.about_p2)setTxt('about-p2',s.about_p2);
  ['1','2','3','4'].forEach(n=>{if(s['af'+n])setTxt('af'+n,s['af'+n]);});
  if(s.av_title)setTxt('av-title',s.av_title);
  if(s.av_sub)setTxt('av-sub',s.av_sub);
  if(s.av_addr){const el=document.getElementById('av-addr');if(el)el.innerHTML=s.av_addr.replace(/\n/g,'<br>');}
  if(s.av_time){const el=document.getElementById('av-time');if(el)el.innerHTML=s.av_time.replace(/\n/g,'<br>');}
  if(s.reg_title)setTxt('reg-title',s.reg_title);
  if(s.reg_desc)setTxt('reg-desc',s.reg_desc);
  if(s.footer_tagline)setTxt('ft-tag',s.footer_tagline);
  if(s.footer_addr){const el=document.getElementById('ft-addr');if(el)el.innerHTML='📍 '+s.footer_addr.replace(/\n/g,'<br>');}
  if(s.footer_copy)setTxt('ft-copy',s.footer_copy);
  const wa='https://wa.me/'+(s.wa_number||'9647751886865');
  setHref(['lk-wa','about-wa','reg-wa','ft-wa'],wa);
  if(s.ig_link)setHref(['lk-ig','ft-ig'],s.ig_link);
  if(s.ig_handle)setTxt('ig-hd',s.ig_handle);
  if(s.fb_link)setHref(['lk-fb','ft-fb'],s.fb_link);
  if(s.fb_handle)setTxt('fb-hd',s.fb_handle);
  if(s.ig2_link)setHref(['lk-ig2'],s.ig2_link);
  if(s.ig2_handle)setTxt('ig2-hd',s.ig2_handle);
  if(s.sys_link)setHref(['nav-sys','ft-sys'],s.sys_link);
  if(s.marquee_items)buildMarquee(s.marquee_items);
  if(s.colors&&s.colors!=='{}')try{applyColors(JSON.parse(s.colors));}catch(e){}
  if(s.font_headings)document.documentElement.style.setProperty('--fh',"'"+s.font_headings+"',serif");
  if(s.font_body)document.documentElement.style.setProperty('--fb',"'"+s.font_body+"',sans-serif");
  if(s.bg_pattern)applyBgPattern(s.bg_pattern);
  if(s.visibility&&s.visibility!=='{}')try{
    const v=JSON.parse(s.visibility);
    Object.entries(v).forEach(([k,show])=>{const el=document.getElementById(k);if(el)el.style.display=show?'':'none';});
  }catch(e){}
  if(s.sections_order&&s.sections_order!=='[]')try{applySectionsOrder(JSON.parse(s.sections_order));}catch(e){}
}

async function loadNews(){
  const g=document.getElementById('news-grid');
  try{
    const d=await sbGet('news','?order=created_at.desc');
    if(!d||!d.length){g.innerHTML='<div class="news-empty">لا توجد أخبار بعد</div>';return;}
    g.innerHTML=d.map(n=>'<div class="nc rv"><div class="nc-img">'+(n.img_data?'<img src="'+n.img_data+'" alt="'+n.title+'"><div class="nc-ov"></div>':(n.icon||'📰'))+'</div><div class="nc-b"><span class="nc-cat">'+(n.category||'إعلان')+'</span><div class="nc-ttl">'+n.title+'</div><div class="nc-txt">'+n.body+'</div><div class="nc-dt">📅 '+(n.news_date||(n.created_at||'').split('T')[0])+'</div></div></div>').join('');
    initReveal();
  }catch(e){g.innerHTML='<div class="news-empty">تعذّر تحميل الأخبار</div>';}
}

async function loadGallery(){
  try{
    const d=await sbGet('gallery','?order=sort_order.asc,created_at.asc');
    if(!d||!d.length)return;
    document.getElementById('gal-grid').innerHTML=d.map(g=>'<div class="gi'+(g.is_big?' big':'')+' rv">'+(g.img_data?'<img src="'+g.img_data+'" alt="'+g.title+'">':'<div style="font-size:44px;position:relative">🖼️</div>')+'<div class="gi-lbl">'+g.title+'</div></div>').join('');
    initReveal();
  }catch(e){}
}

let ALL_PUBS=[];
async function loadPubs(){
  const g=document.getElementById('pub-grid');
  try{
    const d=await sbGet('publications','?order=created_at.desc');
    ALL_PUBS=d||[];
    renderPubs('all');
  }catch(e){g.innerHTML='<div class="news-empty">تعذّر تحميل المنشورات</div>';}
}

function renderPubs(filter){
  const g=document.getElementById('pub-grid');
  const list=filter==='all'?ALL_PUBS:ALL_PUBS.filter(p=>p.pub_type===filter);
  if(!list.length){g.innerHTML='<div class="news-empty">لا توجد منشورات في هذه الفئة</div>';return;}
  g.innerHTML=list.map((p,i)=>{
    const isFile=p.pub_type==='file';
    const hasLongBody=p.body&&p.body.length>200;
    return '<div class="pub-c rv" onclick="openPubModal('+i+',\''+filter+'\')">'
      +'<div class="pub-img">'+(p.img_data?'<img src="'+p.img_data+'" alt="'+p.title+'">':(isFile?'📎':'✏️'))+'</div>'
      +'<div class="pub-b">'
      +'<span class="pub-badge '+(isFile?'badge-file':'badge-art')+'">'+(isFile?'📎 ملف':'✏️ مقال')+'</span>'
      +'<div class="pub-ttl">'+p.title+'</div>'
      +'<div class="pub-txt">'+(p.body||'')+'</div>'
      +'<div class="pub-ft">'
      +'<span class="pub-auth">'+(p.author?'✍️ '+p.author:'')+'</span>'
      +(isFile&&p.file_data?'<a class="pub-dl" href="'+p.file_data+'" download="'+(p.file_name||'ملف')+'" onclick="event.stopPropagation()">⬇️ تحميل</a>':'')
      +'</div>'
      +(hasLongBody||isFile?'<span class="pub-read-more">اقرأ المزيد ←</span>':'')
      +'</div></div>';
  }).join('');
  initReveal();
}

function filterPubs(type,btn){
  document.querySelectorAll('.pub-tab').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  renderPubs(type);
}

/* ===== نافذة المنشور الكاملة ===== */
function openPubModal(index, filter){
  const list=(filter==='all'||!filter)?ALL_PUBS:ALL_PUBS.filter(p=>p.pub_type===filter);
  const p=list[index];
  if(!p)return;

  const isFile=p.pub_type==='file';
  const ov=document.getElementById('pub-modal-ov');

  // الصورة أو الأيقونة
  const imgHtml=p.img_data
    ?'<img class="pub-modal-img" src="'+p.img_data+'" alt="'+p.title+'">'
    :'<div class="pub-modal-img-placeholder">'+(isFile?'📎':'✏️')+'</div>';

  // التاريخ
  const dateStr=p.pub_date||(p.created_at||'').split('T')[0]||'';

  // محتوى الملف
  const fileHtml=isFile&&p.file_data
    ?'<a class="btn-p" href="'+p.file_data+'" download="'+(p.file_name||'ملف')+'">⬇️ تحميل الملف</a>'
    :'';

  document.getElementById('pub-modal-inner').innerHTML=
    imgHtml
    +'<div class="pub-modal-body">'
    +'<span class="pub-modal-badge '+(isFile?'badge-file':'badge-art')+'">'+(isFile?'📎 ملف':'✏️ مقال')+'</span>'
    +'<div class="pub-modal-title">'+p.title+'</div>'
    +'<div class="pub-modal-meta">'
    +(p.author?'<span>✍️ '+p.author+'</span>':'')
    +(dateStr?'<span>📅 '+dateStr+'</span>':'')
    +(p.category?'<span>🏷️ '+(p.category||'عام')+'</span>':'')
    +'</div>'
    +(p.body?'<div class="pub-modal-content">'+escHtml(p.body)+'</div>':'')
    +(fileHtml?'<div class="pub-modal-actions">'+fileHtml+'</div>':'')
    +'</div>';

  ov.classList.add('open');
  document.body.style.overflow='hidden';
}

function closePubModal(){
  document.getElementById('pub-modal-ov').classList.remove('open');
  document.body.style.overflow='';
}

function escHtml(t){
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* إنشاء النافذة المنبثقة عند تحميل الصفحة */
function createPubModalDOM(){
  const ov=document.createElement('div');
  ov.id='pub-modal-ov';
  ov.className='pub-modal-ov';
  ov.innerHTML='<div class="pub-modal"><button class="pub-modal-close" onclick="closePubModal()">✕</button><div id="pub-modal-inner"></div></div>';
  // إغلاق عند الضغط خارج النافذة
  ov.addEventListener('click',function(e){if(e.target===ov)closePubModal();});
  document.body.appendChild(ov);
}

// إغلاق بزر Escape
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    const ov=document.getElementById('pub-modal-ov');
    if(ov&&ov.classList.contains('open'))closePubModal();
  }
});

function buildMarquee(items){
  const arr=items.split(',').map(s=>s.trim()).filter(Boolean);
  if(!arr.length)return;
  const t=document.getElementById('mq-track');
  if(!t)return;
  const dbl=[...arr,...arr];
  t.innerHTML=dbl.map(i=>'<span>'+i+'</span><span class="mq-dot">✦</span>').join('');
}

function applyColors(c){
  const r=document.documentElement;
  const map={g1:'--gold',g2:'--gold2',d1:'--dark',d2:'--dark2',card:'--card',txt:'--text',txtm:'--textm'};
  Object.entries(map).forEach(([k,v])=>{if(c[k])r.style.setProperty(v,c[k]);});
}

function applyBgPattern(p){
  const el=document.querySelector('.h-pat');if(!el)return;
  const pats={
    hexagon:"url(\"data:image/svg+xml,%3Csvg width='70' height='70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 3L67 21L67 49L35 67L3 49L3 21Z' stroke='%23c9a84c' stroke-width='0.35' fill='none' opacity='0.09'/%3E%3C/svg%3E\")",
    dots:'radial-gradient(circle,rgba(201,168,76,.14) 1px,transparent 1px)',
    lines:'repeating-linear-gradient(45deg,rgba(201,168,76,.06) 0,rgba(201,168,76,.06) 1px,transparent 0,transparent 50%)',
    none:'none'
  };
  el.style.backgroundImage=pats[p]||pats.hexagon;
  el.style.backgroundSize=p==='dots'?'28px 28px':p==='lines'?'18px 18px':'70px 70px';
}

function applySectionsOrder(order){
  const secs=['news','gallery','publications','about','contact','reg'];
  const valid=order.filter(s=>secs.includes(s));
  const container=document.querySelector('body');
  const footer=document.querySelector('footer');
  valid.forEach(id=>{const el=document.getElementById(id);if(el&&footer)container.insertBefore(el,footer);});
}

function setTxt(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}
function setHref(ids,url){(Array.isArray(ids)?ids:[ids]).forEach(id=>{const el=document.getElementById(id);if(el)el.href=url;});}

document.addEventListener('DOMContentLoaded',()=>{
  initParticles();initReveal();
  createPubModalDOM();  // إنشاء نافذة المنشورات
  loadSettings();loadNews();loadGallery();loadPubs();
  const nd=document.getElementById('n-date');if(nd)nd.value=new Date().toISOString().split('T')[0];
  const pd=document.getElementById('p-date');if(pd)pd.value=new Date().toISOString().split('T')[0];
});
