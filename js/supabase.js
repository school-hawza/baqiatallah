async function sbReq(m,t,b,f=''){
  const h={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json'};
  if(m==='POST')h['Prefer']='return=representation';
  const r=await fetch(SB_URL+'/rest/v1/'+t+f,{method:m,headers:h,body:b?JSON.stringify(b):undefined});
  if(!r.ok)throw new Error(await r.text());
  return m==='DELETE'?null:r.json();
}
const sbGet=(t,f)=>sbReq('GET',t,null,f||'');
const sbPost=(t,b)=>sbReq('POST',t,b);
const sbPatch=(t,b,f)=>sbReq('PATCH',t,b,f||'');
const sbDel=(t,f)=>sbReq('DELETE',t,null,f||'');
function toB64(file){
  return new Promise((res,rej)=>{
    if(file.size>3*1024*1024){rej(new Error('الملف أكبر من 3MB'));return;}
    const r=new FileReader();
    r.onload=e=>res(e.target.result);
    r.onerror=()=>rej(new Error('فشل'));
    r.readAsDataURL(file);
  });
}
