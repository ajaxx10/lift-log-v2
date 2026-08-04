const roundTo=(value,increment)=>Math.round(value/increment)*increment;
export function buildProgram(increment=2.5){
  const weeks=[];
  for(let week=1;week<=24;week++){
    const deload=week%4===0;
    const phase=week<=8?'Base':week<=16?'Build':'Peak';
    const strengthBase=110+(week-1)*2.5;
    const volumeBase=100+(week-1)*2.5;
    const strength=roundTo(deload?strengthBase*.88:strengthBase,increment);
    const volume=roundTo(deload?volumeBase*.88:volumeBase,increment);
    weeks.push({week,phase,deload,sessions:[
      {id:`w${week}-a`,label:'Upper Strength',focus:'Bench Press',sets:deload?3:(week<=8?5:4),reps:deload?5:(week<=8?5:week<=16?4:3),weight:strength,accessories:['Chest-Supported Row','Overhead Press','Close-Grip Bench Press','Face Pull']},
      {id:`w${week}-b`,label:'Upper Volume',focus:'Bench Press',sets:deload?3:4,reps:deload?8:(week<=16?8:6),weight:volume,accessories:['Incline Dumbbell Press','Lat Pulldown','Lateral Raise','Triceps Pushdown']}
    ]});
  }
  return weeks;
}
export function flattenProgram(program){return program.flatMap(w=>w.sessions.map(s=>({...s,week:w.week,phase:w.phase,deload:w.deload})))}
export function nextSession(program,completedIds){return flattenProgram(program).find(s=>!completedIds.includes(s.id))||null}
export function sessionToWorkout(session){
  const focusSets=Array.from({length:session.sets},()=>({weight:session.weight,reps:session.reps,done:false}));
  return {name:`Week ${session.week} · ${session.label}`,programSessionId:session.id,exercises:[{name:session.focus,sets:focusSets},...session.accessories.map(name=>({name,sets:[{weight:0,reps:10,done:false},{weight:0,reps:10,done:false},{weight:0,reps:10,done:false}]}))]};
}
