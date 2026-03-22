let LOGGED=false, DRAG=null;

document.getElementById('adm-fab').onclick=()=>showPanel();
document.getElementById('adm-x').onclick=()=>closePanel();
document.getElementById('adm-ov').onclick=e=>{if(e.target===document.getElementById('adm-ov'))closePanel();};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel();});

function showPanel(){document.getElementById('adm-ov').style.display='flex';}
function closePanel(){
  document.getElementById('adm-ov').style.display='none';
  if(!LOGGED){document.getElementById('adm-pass').value='';document.getElementById('login-err').style.display='none';}
}

async function doLogin(){
  const p=document.getElementById('adm-pass').value;
  const err=document.getElementById('login-err');
  try{
    const d=await sbGet('settings','?id=eq.1&select=admin_pass');
    const stored=(d&&d[0]&&d[0].admin_pass)||'baqiat2024';
    if(p===stored){
      LOGGED=true;
      document.getElementById('adm-login').style.display='none';
      document.getElementById('adm-main').style.display='flex';
      err.style.display='none';
      fillForms();loadAdmNews();loadAdmGal();loadAdmPub();loadAdmAudio();loadAdmBooks();
    } else {err.style.display='block';}
  }catch(e){err.style.display='block';err.textContent='خطأ في الاتصال';}
}

function doLogout(){
  LOGGED=false;
  document.getElementById('adm-main').style.display='none';
  document.getElementById('adm-login').style.display='flex';
  document.getElementById('adm-pass').value='';
  closePanel();
}

function apSec(btn,id){
  document.querySelectorAll('.sb-btn').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.adm-sec').forEach(s=>s.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById(id).classList.add('on');
}

function fillForms(){
  const s=CFG;
  sv('t-name',s.school_name||'');sv('t-city',s.city||'');sv('t-quran',s.hero_quran||'');
  sv('t-sub',s.hero_sub||'');sv('t-at',s.about_title||'');sv('t-ap1',s.about_p1||'');
  sv('t-ap2',s.about_p2||'');sv('t-af1',s.af1||'');sv('t-af2',s.af2||'');
  sv('t-af3',s.af3||'');sv('t-af4',s.af4||'');sv('t-avt',s.av_title||'');
  sv('t-avs',s.av_sub||'');sv('t-addr',s.av_addr||'');sv('t-time',s.av_time||'');
  sv('t-rt',s.reg_title||'');sv('t-rd',s.reg_desc||'');
  sv('t-ftag',s.footer_tagline||'');sv('t-faddr',s.footer_addr||'');sv('t-fcopy',s.footer_copy||'');
  sv('t-mq',s.marquee_items||'');
  sv('l-ig',s.ig_link||'');sv('l-igh',s.ig_handle||'');sv('l-fb',s.fb_link||'');
  sv('l-fbh',s.fb_handle||'');sv('l-wa',s.wa_number||'');
  sv('l-ig2',s.ig2_link||'');sv('l-ig2h',s.ig2_handle||'');sv('l-sys',s.sys_link||'');
  sv('s-n1',s.stat1||'');sv('s-l1',s.stat1_lbl||'');sv('s-n2',s.stat2||'');sv('s-l2',s.stat2_lbl||'');
  sv('s-n3',s.stat3||'');sv('s-l3',s.stat3_lbl||'');sv('s-n4',s.stat4||'');sv('s-l4',s.stat4_lbl||'');
  if(s.colors&&s.colors!=='{}'){
    try{const c=JSON.parse(s.colors);
      sv('c-g1',c.g1||'#c9a84c');sv('c-g2',c.g2||'#e8c97a');sv('c-d1',c.d1||'#07090f');
      sv('c-d2',c.d2||'#0d1120');sv('c-card',c.card||'#161e32');sv('c-txt',c.txt||'#eee8df');sv('c-txtm',c.txtm||'#8a7d6b');
    }catch(e){}
  }
  updateSwatches();
  if(s.font_headings)sv('fh',s.font_headings);
  if(s.font_body)sv('fb',s.font_body);
  if(s.bg_pattern)sv('bg-pat',s.bg_pattern);
  if(s.visibility&&s.visibility!=='{}'){
    try{const v=JSON.parse(s.visibility);
      Object.entries(v).forEach(([k,show])=>{const cb=document.getElementById('v-'+k.replace('-wrap',''));if(cb)cb.checked=show;});
    }catch(e){}
  }
}

// NEWS
async function loadAdmNews(){
  const list=document.getElementById('news-list'),cnt=document.getElementById('news-cnt');
  try{
    const d=await sbGet('news','?order=created_at.desc');
    cnt.textContent=d?d.length:0;
    if(!d||!d.length){list.innerHTML='<p style="color:var(--textm);font-size:12px;padding:10px">لا توجد أخبار</p>';return;}
    list.innerHTML=d.map(n=>'<div class="adm-item"><div class="adm-item-t"><h4>'+(n.icon||'📰')+' '+n.title+'</h4><p>'+n.category+' · '+(n.news_date||'')+'</p></div><button class="del-btn" onclick="delNews('+n.id+')">🗑️ حذف</button></div>').join('');
  }catch(e){list.innerHTML='<p style="color:#ef4444;font-size:12px">خطأ</p>';}
}

async function addNews(){
  const ttl=gv('n-ttl').trim(),body=gv('n-body').trim();
  if(!ttl||!body){toast('news-toast','يرجى تعبئة العنوان والنص','err');return;}
  const btn=document.getElementById('add-news-btn');
  btn.disabled=true;btn.textContent='⏳ جاري النشر...';
  const item={title:ttl,body,category:gv('n-cat'),icon:gv('n-ico')||'📰',news_date:gv('n-date')||new Date().toLocaleDateString('ar-IQ')};
  try{
    const f=document.getElementById('n-img').files[0];
    if(f)item.img_data=await toB64(f);
    await sbPost('news',item);
    toast('news-toast','✅ تم نشر الخبر للجميع!','ok');
    ['n-ttl','n-body','n-ico'].forEach(id=>sv(id,''));
    document.getElementById('n-img-p').innerHTML='';
    loadNews();loadAdmNews();
  }catch(e){toast('news-toast','❌ خطأ: '+e.message,'err');}
  btn.disabled=false;btn.textContent='➕ نشر الخبر للجميع';
}

async function delNews(id){
  if(!confirm('حذف هذا الخبر؟'))return;
  try{await sbDel('news','?id=eq.'+id);loadNews();loadAdmNews();}catch(e){alert('خطأ');}
}

// GALLERY
async function loadAdmGal(){
  const list=document.getElementById('gal-list'),cnt=document.getElementById('gal-cnt');
  try{
    const d=await sbGet('gallery','?order=created_at.desc');
    cnt.textContent=d?d.length:0;
    if(!d||!d.length){list.innerHTML='<p style="color:var(--textm);font-size:12px;padding:10px">لا توجد صور</p>';return;}
    list.innerHTML=d.map(g=>'<div class="adm-item"><div class="adm-item-t"><h4>🖼️ '+g.title+'</h4><p>'+(g.is_big?'كبيرة 2×2':'عادية')+'</p></div><button class="del-btn" onclick="delGal('+g.id+')">🗑️ حذف</button></div>').join('');
  }catch(e){}
}

async function addGal(){
  const ttl=gv('g-ttl').trim();
  if(!ttl){toast('gal-toast','أدخل عنوان الصورة','err');return;}
  const btn=document.getElementById('add-gal-btn');
  btn.disabled=true;btn.textContent='⏳ جاري الرفع...';
  const item={title:ttl,is_big:gv('g-big')==='true'};
  try{
    const f=document.getElementById('g-img').files[0];
    if(f)item.img_data=await toB64(f);
    await sbPost('gallery',item);
    toast('gal-toast','✅ تمت إضافة الصورة!','ok');
    sv('g-ttl','');document.getElementById('g-img-p').innerHTML='';
    loadGallery();loadAdmGal();
  }catch(e){toast('gal-toast','❌ خطأ: '+e.message,'err');}
  btn.disabled=false;btn.textContent='➕ إضافة الصورة';
}

async function delGal(id){
  if(!confirm('حذف هذه الصورة؟'))return;
  try{await sbDel('gallery','?id=eq.'+id);loadGallery();loadAdmGal();}catch(e){alert('خطأ');}
}

// PUBLICATIONS
async function loadAdmPub(){
  const list=document.getElementById('pub-list'),cnt=document.getElementById('pub-cnt');
  try{
    const d=await sbGet('publications','?order=created_at.desc');
    cnt.textContent=d?d.length:0;
    if(!d||!d.length){list.innerHTML='<p style="color:var(--textm);font-size:12px;padding:10px">لا توجد منشورات</p>';return;}
    list.innerHTML=d.map(p=>'<div class="adm-item"><div class="adm-item-t"><h4>'+(p.pub_type==='file'?'📎':'✏️')+' '+p.title+'</h4><p>'+(p.category||'عام')+' · '+(p.author||'')+'</p></div><button class="del-btn" onclick="delPub('+p.id+')">🗑️ حذف</button></div>').join('');
  }catch(e){}
}

async function addPub(){
  const ttl=gv('p-ttl').trim();
  if(!ttl){toast('pub-toast','أدخل عنوان المنشور','err');return;}
  const btn=document.getElementById('add-pub-btn');
  btn.disabled=true;btn.textContent='⏳ جاري النشر...';
  const item={title:ttl,body:gv('p-body'),pub_type:gv('p-type'),author:gv('p-auth'),category:gv('p-cat')||'عام',pub_date:gv('p-date')};
  try{
    const imgF=document.getElementById('p-img').files[0];
    if(imgF)item.img_data=await toB64(imgF);
    const fileF=document.getElementById('p-file').files[0];
    if(fileF){item.file_data=await toB64(fileF);item.file_name=fileF.name;}
    await sbPost('publications',item);
    toast('pub-toast','✅ تم نشر المنشور!','ok');
    ['p-ttl','p-body','p-auth','p-cat'].forEach(id=>sv(id,''));
    document.getElementById('p-img-p').innerHTML='';
    document.getElementById('p-file-name').textContent='';
    loadPubs();loadAdmPub();
  }catch(e){toast('pub-toast','❌ خطأ: '+e.message,'err');}
  btn.disabled=false;btn.textContent='➕ نشر المنشور';
}

async function delPub(id){
  if(!confirm('حذف هذا المنشور؟'))return;
  try{await sbDel('publications','?id=eq.'+id);loadPubs();loadAdmPub();}catch(e){alert('خطأ');}
}

// STATS
async function saveStats(){
  const upd={stat1:gv('s-n1'),stat1_lbl:gv('s-l1'),stat2:gv('s-n2'),stat2_lbl:gv('s-l2'),stat3:gv('s-n3'),stat3_lbl:gv('s-l3'),stat4:gv('s-n4'),stat4_lbl:gv('s-l4')};
  try{await sbPatch('settings',upd,'?id=eq.1');Object.assign(CFG,upd);applySettings(CFG);toast('stats-toast','✅ تم الحفظ!','ok');}
  catch(e){toast('stats-toast','❌ خطأ','err');}
}

// TEXTS
async function saveTexts(){
  const upd={school_name:gv('t-name'),city:gv('t-city'),hero_quran:gv('t-quran'),hero_sub:gv('t-sub'),
    about_title:gv('t-at'),about_p1:gv('t-ap1'),about_p2:gv('t-ap2'),
    af1:gv('t-af1'),af2:gv('t-af2'),af3:gv('t-af3'),af4:gv('t-af4'),
    av_title:gv('t-avt'),av_sub:gv('t-avs'),av_addr:gv('t-addr'),av_time:gv('t-time'),
    reg_title:gv('t-rt'),reg_desc:gv('t-rd'),marquee_items:gv('t-mq'),
    footer_tagline:gv('t-ftag'),footer_addr:gv('t-faddr'),footer_copy:gv('t-fcopy')};
  try{
    const lf=document.getElementById('t-logo').files[0];
    if(lf)upd.logo_data=await toB64(lf);
    await sbPatch('settings',upd,'?id=eq.1');Object.assign(CFG,upd);applySettings(CFG);
    toast('text-toast','✅ تم حفظ جميع النصوص!','ok');
  }catch(e){toast('text-toast','❌ خطأ: '+e.message,'err');}
}

// LINKS
async function saveLinks(){
  const upd={ig_link:gv('l-ig'),ig_handle:gv('l-igh'),fb_link:gv('l-fb'),fb_handle:gv('l-fbh'),
    wa_number:gv('l-wa'),ig2_link:gv('l-ig2'),ig2_handle:gv('l-ig2h'),sys_link:gv('l-sys')};
  try{await sbPatch('settings',upd,'?id=eq.1');Object.assign(CFG,upd);applySettings(CFG);toast('links-toast','✅ تم حفظ الروابط!','ok');}
  catch(e){toast('links-toast','❌ خطأ','err');}
}

// COLORS
function updateSwatches(){
  const ids=['c-g1','c-g2','c-d1','c-d2','c-card','c-txt','c-txtm'];
  const prev=document.getElementById('clr-prev');if(!prev)return;
  prev.innerHTML=ids.map(id=>{const el=document.getElementById(id);return '<div class="swatch" style="background:'+(el?el.value:'#000')+'" title="'+id+'"></div>';}).join('');
}

async function saveColors(){
  const colors={g1:gv('c-g1'),g2:gv('c-g2'),d1:gv('c-d1'),d2:gv('c-d2'),card:gv('c-card'),txt:gv('c-txt'),txtm:gv('c-txtm')};
  try{
    await sbPatch('settings',{colors:JSON.stringify(colors)},'?id=eq.1');
    CFG.colors=JSON.stringify(colors);applyColors(colors);
    toast('clr-toast','✅ تم تطبيق الألوان للجميع!','ok');
  }catch(e){toast('clr-toast','❌ خطأ','err');}
}

async function resetColors(){
  sv('c-g1','#c9a84c');sv('c-g2','#e8c97a');sv('c-d1','#07090f');sv('c-d2','#0d1120');
  sv('c-card','#161e32');sv('c-txt','#eee8df');sv('c-txtm','#8a7d6b');
  updateSwatches();await saveColors();
}

function previewFonts(){
  document.documentElement.style.setProperty('--fh',"'"+gv('fh')+"',serif");
  document.documentElement.style.setProperty('--fb',"'"+gv('fb')+"',sans-serif");
}

async function saveFonts(){
  const upd={font_headings:gv('fh'),font_body:gv('fb')};
  try{await sbPatch('settings',upd,'?id=eq.1');Object.assign(CFG,upd);toast('font-toast','✅ تم حفظ الخطوط!','ok');}
  catch(e){toast('font-toast','❌ خطأ','err');}
}

async function saveBg(){
  const p=gv('bg-pat');
  try{await sbPatch('settings',{bg_pattern:p},'?id=eq.1');CFG.bg_pattern=p;applyBgPattern(p);toast('bg-toast','✅ تم!','ok');}
  catch(e){toast('bg-toast','❌ خطأ','err');}
}

// LAYOUT
function toggleSec(id,show){const el=document.getElementById(id);if(el)el.style.display=show?'':'none';}

async function saveVisibility(){
  const secs=['news','gallery','publications','stats','about','contact','reg','mq-wrap'];
  const vis={};
  secs.forEach(s=>{
    const cbId='v-'+(s==='mq-wrap'?'mq':s);
    const cb=document.getElementById(cbId);
    vis[s]=cb?cb.checked:true;
  });
  try{await sbPatch('settings',{visibility:JSON.stringify(vis)},'?id=eq.1');toast('vis-toast','✅ تم الحفظ!','ok');}
  catch(e){toast('vis-toast','❌ خطأ','err');}
}

// SORT
const sortList=document.getElementById('sort-list');
if(sortList){
  sortList.addEventListener('dragstart',e=>{DRAG=e.target;e.target.classList.add('dragging');});
  sortList.addEventListener('dragend',e=>e.target.classList.remove('dragging'));
  sortList.addEventListener('dragover',e=>{
    e.preventDefault();
    const after=[...sortList.querySelectorAll('.sort-item:not(.dragging)')].reduce((cl,ch)=>{
      const box=ch.getBoundingClientRect();const offset=e.clientY-box.top-box.height/2;
      if(offset<0&&offset>(cl.offset||-Infinity))return{offset,element:ch};return cl;
    },{}).element;
    if(after==null)sortList.appendChild(DRAG);else sortList.insertBefore(DRAG,after);
  });
}

async function saveOrder(){
  const order=[...sortList.querySelectorAll('.sort-item')].map(i=>i.dataset.sec);
  try{
    await sbPatch('settings',{sections_order:JSON.stringify(order)},'?id=eq.1');
    CFG.sections_order=JSON.stringify(order);applySectionsOrder(order);
    toast('order-toast','✅ تم حفظ الترتيب!','ok');
  }catch(e){toast('order-toast','❌ خطأ','err');}
}

// SECURITY
async function changePass(){
  const old=gv('sec-old'),nw=gv('sec-new'),cf=gv('sec-cf');
  if(!old||!nw){toast('sec-toast','أدخل كلمة المرور الحالية والجديدة','err');return;}
  if(nw!==cf){toast('sec-toast','كلمتا المرور الجديدتان لا تتطابقان','err');return;}
  try{
    const d=await sbGet('settings','?id=eq.1&select=admin_pass');
    const stored=(d&&d[0]&&d[0].admin_pass)||'baqiat2024';
    if(old!==stored){toast('sec-toast','كلمة المرور الحالية غير صحيحة','err');return;}
    await sbPatch('settings',{admin_pass:nw},'?id=eq.1');
    CFG.admin_pass=nw;
    toast('sec-toast','✅ تم تغيير كلمة المرور!','ok');
    ['sec-old','sec-new','sec-cf'].forEach(id=>sv(id,''));
  }catch(e){toast('sec-toast','❌ خطأ: '+e.message,'err');}
}

// UTILS
function gv(id){const el=document.getElementById(id);return el?el.value:'';}
function sv(id,val){const el=document.getElementById(id);if(el)el.value=val;}
function prevF(inp,pid){
  const prev=document.getElementById(pid);if(!prev||!inp.files[0])return;
  const r=new FileReader();
  r.onload=e=>{prev.innerHTML='<img src="'+e.target.result+'" style="max-height:120px;border-radius:9px;margin-top:7px;border:1px solid var(--border)">';};
  r.readAsDataURL(inp.files[0]);
}
function showFileName(inp){
  const el=document.getElementById('p-file-name');
  if(el&&inp.files[0])el.textContent='📎 الملف: '+inp.files[0].name;
}
function toast(id,msg,type){
  const el=document.getElementById(id);if(!el)return;
  el.textContent=msg;el.className='toast '+type;el.style.display='block';
  setTimeout(()=>el.style.display='none',4000);
}

// ══════════════════════════════════
// الدروس الصوتية
// ══════════════════════════════════
async function loadAdmAudio(){
  const list=document.getElementById('audio-list'),cnt=document.getElementById('audio-cnt');
  if(!list)return;
  try{
    const d=await sbGet('audio_lessons','?order=created_at.desc');
    if(cnt)cnt.textContent=d?d.length:0;
    if(!d||!d.length){list.innerHTML='<p style="color:var(--textm);font-size:12px;padding:10px">لا توجد دروس</p>';return;}
    list.innerHTML=d.map(a=>'<div class="adm-item"><div class="adm-item-t"><h4>🎙️ '+a.title+'</h4><p>'+(a.author||'')+(a.category?' · '+a.category:'')+'</p></div><button class="del-btn" onclick="delAudio('+a.id+')">🗑️ حذف</button></div>').join('');
  }catch(e){}
}

async function addAudio(){
  const ttl=gv('au-ttl').trim(),auth=gv('au-auth').trim();
  if(!ttl){toast('audio-toast','أدخل اسم الدرس','err');return;}
  if(!auth){toast('audio-toast','أدخل اسم الأستاذ','err');return;}
  const audioF=document.getElementById('au-file').files[0];
  if(!audioF){toast('audio-toast','أدخل الملف الصوتي','err');return;}
  if(audioF.size>10*1024*1024){toast('audio-toast','حجم الملف أكبر من 10MB','err');return;}
  const btn=document.getElementById('add-audio-btn');
  btn.disabled=true;btn.textContent='⏳ جاري الرفع...';
  const item={title:ttl,author:auth,category:gv('au-cat'),description:gv('au-desc'),lesson_date:gv('au-date')};
  try{
    item.audio_data=await toB64(audioF);
    item.audio_name=audioF.name;
    const imgF=document.getElementById('au-img').files[0];
    if(imgF)item.img_data=await toB64(imgF);
    await sbPost('audio_lessons',item);
    toast('audio-toast','✅ تم نشر الدرس!','ok');
    ['au-ttl','au-auth','au-cat','au-desc'].forEach(id=>sv(id,''));
    document.getElementById('au-img-p').innerHTML='';
    document.getElementById('au-audio-p').innerHTML='';
    document.getElementById('au-file').value='';
    document.getElementById('au-img').value='';
    loadAudio();loadAdmAudio();
  }catch(e){toast('audio-toast','❌ خطأ: '+e.message,'err');}
  btn.disabled=false;btn.textContent='➕ نشر الدرس';
}

async function delAudio(id){
  if(!confirm('حذف هذا الدرس؟'))return;
  try{await sbDel('audio_lessons','?id=eq.'+id);loadAudio();loadAdmAudio();}catch(e){alert('خطأ');}
}

function previewAudio(inp){
  const prev=document.getElementById('au-audio-p');
  if(!prev||!inp.files[0])return;
  const url=URL.createObjectURL(inp.files[0]);
  prev.innerHTML='<audio controls style="width:100%;margin-top:8px"><source src="'+url+'"></audio><div style="font-size:10px;color:var(--gold);margin-top:4px">🎵 '+inp.files[0].name+'</div>';
}

// ══════════════════════════════════
// الكتب المنهجية
// ══════════════════════════════════
async function loadAdmBooks(){
  const list=document.getElementById('books-list'),cnt=document.getElementById('books-cnt');
  if(!list)return;
  try{
    const d=await sbGet('books','?order=created_at.desc');
    if(cnt)cnt.textContent=d?d.length:0;
    if(!d||!d.length){list.innerHTML='<p style="color:var(--textm);font-size:12px;padding:10px">لا توجد كتب</p>';return;}
    list.innerHTML=d.map(b=>'<div class="adm-item"><div class="adm-item-t"><h4>📖 '+b.title+'</h4><p>'+(b.author||'')+(b.level?' · '+b.level:'')+'</p></div><button class="del-btn" onclick="delBook('+b.id+')">🗑️ حذف</button></div>').join('');
  }catch(e){}
}

async function addBook(){
  const ttl=gv('bk-ttl').trim();
  if(!ttl){toast('books-toast','أدخل اسم الكتاب','err');return;}
  const fileF=document.getElementById('bk-file').files[0];
  if(!fileF){toast('books-toast','أدخل ملف PDF','err');return;}
  const btn=document.getElementById('add-book-btn');
  btn.disabled=true;btn.textContent='⏳ جاري الرفع...';
  const item={title:ttl,author:gv('bk-auth'),level:gv('bk-level'),category:gv('bk-cat'),description:gv('bk-desc')};
  try{
    item.file_data=await toB64(fileF);
    item.file_name=fileF.name;
    const imgF=document.getElementById('bk-img').files[0];
    if(imgF)item.img_data=await toB64(imgF);
    await sbPost('books',item);
    toast('books-toast','✅ تم إضافة الكتاب!','ok');
    ['bk-ttl','bk-auth','bk-level','bk-cat','bk-desc'].forEach(id=>sv(id,''));
    document.getElementById('bk-img-p').innerHTML='';
    document.getElementById('bk-file-name').textContent='';
    document.getElementById('bk-file').value='';
    document.getElementById('bk-img').value='';
    loadBooks();loadAdmBooks();
  }catch(e){toast('books-toast','❌ خطأ: '+e.message,'err');}
  btn.disabled=false;btn.textContent='➕ إضافة الكتاب';
}

async function delBook(id){
  if(!confirm('حذف هذا الكتاب؟'))return;
  try{await sbDel('books','?id=eq.'+id);loadBooks();loadAdmBooks();}catch(e){alert('خطأ');}
}

function previewImg(inp,pid){
  const prev=document.getElementById(pid);if(!prev||!inp.files[0])return;
  const r=new FileReader();
  r.onload=e=>{prev.innerHTML='<img src="'+e.target.result+'" style="max-height:100px;border-radius:8px;margin-top:6px;border:1px solid var(--border)">';};
  r.readAsDataURL(inp.files[0]);
}

function showFileName(inp,pid){
  const el=document.getElementById(pid);
  if(el&&inp.files[0])el.textContent='📎 '+inp.files[0].name;
}
