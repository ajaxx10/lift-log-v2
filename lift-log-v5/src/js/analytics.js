export const round=(v,d=0)=>Number((Number(v)||0).toFixed(d));
export const est1rm=(w,r)=>r>0&&w>0?w*(1+r/30):0;
export const volumeOfSet=s=>(Number(s.weight)||0)*(Number(s.reps)||0);
export const allSets=data=>data.workouts.flatMap(w=>w.exercises.flatMap(e=>e.sets.map((s,i)=>({...s,exercise:e.name,date:w.date,workout:w.name,set:i+1}))));
export function exercisePoints(data,name){
  return data.workouts.filter(w=>w.exercises.some(e=>e.name===name)).map(w=>{
    const sets=w.exercises.filter(e=>e.name===name).flatMap(e=>e.sets).filter(s=>s.done!==false);
    return {date:w.date,best1rm:Math.max(0,...sets.map(s=>est1rm(s.weight,s.reps))),topWeight:Math.max(0,...sets.map(s=>+s.weight||0)),volume:sets.reduce((a,s)=>a+volumeOfSet(s),0)};
  }).filter(p=>p.best1rm>0||p.volume>0).sort((a,b)=>a.date.localeCompare(b.date));
}
export function exerciseHistory(data,name){
  return data.workouts.filter(w=>w.exercises.some(e=>e.name===name)).map(w=>{
    const sets=w.exercises.filter(e=>e.name===name).flatMap(e=>e.sets).filter(s=>s.done!==false);
    return {date:w.date,workout:w.name,sets,best1rm:Math.max(0,...sets.map(s=>est1rm(s.weight,s.reps))),volume:sets.reduce((a,s)=>a+volumeOfSet(s),0)};
  }).sort((a,b)=>b.date.localeCompare(a.date));
}
export function lastExerciseSession(data,name){return exerciseHistory(data,name)[0]||null}
export function weeklyVolumes(data,weeks=8){
  const now=new Date();const out=[];
  for(let i=weeks-1;i>=0;i--){const end=new Date(now);end.setDate(now.getDate()-i*7);const start=new Date(end);start.setDate(end.getDate()-6);const volume=data.workouts.filter(w=>{const d=new Date(w.date+'T12:00:00');return d>=start&&d<=end}).reduce((sum,w)=>sum+w.exercises.flatMap(e=>e.sets).reduce((s,x)=>s+volumeOfSet(x),0),0);out.push({label:`${start.getMonth()+1}/${start.getDate()}`,volume})}return out;
}
export function personalRecords(data){
  const by={};allSets(data).forEach(s=>{if(!s.weight||!s.reps)return;const x=by[s.exercise]||{exercise:s.exercise,topWeight:0,best1rm:0,bestSet:null,date:null};const e=est1rm(s.weight,s.reps);if(e>x.best1rm){x.best1rm=e;x.bestSet=`${s.weight} × ${s.reps}`;x.date=s.date}x.topWeight=Math.max(x.topWeight,+s.weight);by[s.exercise]=x});return Object.values(by).sort((a,b)=>b.best1rm-a.best1rm);
}
export function strengthScore(data){
  const prs=personalRecords(data);const get=n=>prs.find(x=>x.exercise===n)?.best1rm||0;
  const bench=Math.min(25,get('Bench Press')/215*25),squat=Math.min(18,get('Smith Machine Squat')/225*18),hinge=Math.min(15,get('Smith Romanian Deadlift')/225*15),press=Math.min(12,get('Overhead Press')/115*12);
  const pullSets=allSets(data).filter(s=>s.exercise==='Assisted Pull-Up');const pull=Math.min(10,(Math.max(0,...pullSets.map(s=>+s.reps||0))/10)*10);
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-28);const recent=data.workouts.filter(w=>new Date(w.date+'T12:00:00')>=cutoff).length;const adherence=Math.min(20,recent/12*20);
  return {total:round(bench+squat+hinge+press+pull+adherence),bench:round(bench),squat:round(squat),hinge:round(hinge),press:round(press),pull:round(pull),adherence:round(adherence)};
}
export function detectPrs(beforeData,workout){
  const old=personalRecords(beforeData);const results=[];
  workout.exercises.forEach(e=>{const oldE=old.find(x=>x.exercise===e.name);e.sets.filter(s=>s.done!==false&&s.weight>0&&s.reps>0).forEach(s=>{const value=est1rm(s.weight,s.reps);if(!oldE||value>oldE.best1rm+.5)results.push({exercise:e.name,set:`${s.weight} × ${s.reps}`,estimated1rm:round(value),date:workout.date})})});
  const best={};results.forEach(x=>{if(!best[x.exercise]||x.estimated1rm>best[x.exercise].estimated1rm)best[x.exercise]=x});return Object.values(best);
}
function performanceSummary(sets){
  const work=sets.filter(s=>(+s.weight||0)>0 || (+s.reps||0)>0);const completed=work.filter(s=>s.done);const complete=work.length>0&&completed.length===work.length;const avgRir=completed.reduce((a,s)=>a+(Number(s.rir)||0),0)/Math.max(completed.length,1);const base=Math.max(0,...work.map(s=>+s.weight||0));const reps=work[0]?.reps||8;return {complete,avgRir,base,reps,completed:completed.length,total:work.length};
}
export function nextRecommendation(exercise,sets,units='lb'){
  const p=performanceSummary(sets),upper=/Bench|Press|Curl|Pushdown|Extension|Raise|Pull-Up|Pulldown|Row/.test(exercise),inc=units==='kg'?(upper?1:2):(upper?2.5:5);
  if(!p.complete)return {weight:p.base,reps:p.reps,reason:'Repeat: not all prescribed sets were completed.',action:'repeat'};
  if(p.avgRir>=3)return {weight:p.base+inc,reps:p.reps,reason:`Increase ${inc} ${units}: all sets were completed with room to spare.`,action:'increase'};
  if(p.avgRir>=1.5)return {weight:p.base+inc,reps:p.reps,reason:`Standard progression: add ${inc} ${units}.`,action:'increase'};
  return {weight:p.base,reps:p.reps,reason:'Repeat this load: the final sets were near limit.',action:'repeat'};
}
export function adaptiveRecommendation(data,exercise,currentSets,units='lb'){
  const baseRec=nextRecommendation(exercise,currentSets,units),history=exerciseHistory(data,exercise).slice(0,3),upper=/Bench|Press|Curl|Pushdown|Extension|Raise|Pull-Up|Pulldown|Row/.test(exercise),inc=units==='kg'?(upper?1:2):(upper?2.5:5),p=performanceSummary(currentSets);
  let hardRecent=0;
  for(const h of history.slice(0,2)){
    const hp=performanceSummary(h.sets);if(!hp.complete||hp.avgRir<1.25)hardRecent++;
  }
  if((!p.complete||p.avgRir<1.0)&&hardRecent>=1){const reduced=Math.max(0,Math.round((p.base*.925)/inc)*inc);return {weight:reduced,reps:p.reps,action:'deload',reason:`Deload ~7.5% to ${reduced} ${units}: this lift has been at or beyond your limit in consecutive sessions. Rebuild with cleaner reps.`};}
  if(baseRec.action==='increase'&&history.length){const last=performanceSummary(history[0].sets);if(!last.complete)return {...baseRec,weight:p.base,action:'repeat',reason:'Repeat this load once: the prior session was incomplete, so one clean completion is preferred before progressing.'};}
  return baseRec;
}
export function coachSummary(data,next,units='lb'){
  const bench=exercisePoints(data,'Bench Press'),recent=bench.slice(-4),score=strengthScore(data),last28=data.workouts.filter(w=>{const d=new Date(w.date+'T12:00:00'),c=new Date();c.setDate(c.getDate()-28);return d>=c}).length;
  if(!data.workouts.length)return {badge:'Start',text:'Log your first core session. Lift Log will use completed sets and RIR to personalize the next target.'};
  if(recent.length>=2){const delta=recent.at(-1).best1rm-recent[0].best1rm;if(delta>=5)return {badge:'Building',text:`Bench estimated 1RM is up ${round(delta)} ${units} across your recent sessions. ${next?`Your next core workout is Week ${next.week} ${next.label}.`:''} Keep progressing while reps stay clean.`};if(delta<=-3)return {badge:'Review',text:`Bench performance is down ${Math.abs(round(delta))} ${units} from the start of the recent window. Keep RIR honest; the adaptive progression engine will hold or deload the load if fatigue persists.`};}
  if(last28<8)return {badge:'Consistency',text:`You have logged ${last28} workouts in the last four weeks. For a 3–4 day plan, consistency is the clearest lever available right now.`};
  return {badge:'On track',text:`Strength score is ${score.total}/100. Your training frequency is on plan; let the progression recommendations determine when to add load versus repeat.`};
}
