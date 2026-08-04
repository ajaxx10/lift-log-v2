export const $=id=>document.getElementById(id);
export const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export const fmtDate=s=>new Date(`${s}T12:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
export const est1rm=(w,r)=>r?w*(1+r/30):0;
export const round=n=>Math.round(n);
export function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export const csv=v=>`"${String(v).replaceAll('"','""')}"`;
