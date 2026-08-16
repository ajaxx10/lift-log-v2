export const $=id=>document.getElementById(id);
export const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const formatDate=s=>new Date(s+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
export function download(name,text,type='application/octet-stream'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export const csv=v=>`"${String(v??'').replace(/"/g,'""')}"`;
export function uid(){return crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`}
