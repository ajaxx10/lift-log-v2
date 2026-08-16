export const EXERCISE_LIBRARY = {
  'Bench Press': {group:'Chest', rest:180, cue:'Feet planted, shoulder blades set, controlled touch to lower chest.', guide:'Use a Smith machine if your Planet Fitness has no free barbell bench.'},
  'Incline Dumbbell Press': {group:'Chest', rest:120, cue:'Low incline, elbows slightly tucked, full controlled range.'},
  'Machine Chest Press': {group:'Chest', rest:90, cue:'Set handles near mid-chest and avoid shrugging.'},
  'Cable Fly': {group:'Chest', rest:60, cue:'Soft elbows; bring upper arms together without over-stretching.'},
  'Close-Grip Bench Press': {group:'Triceps', rest:120, cue:'Hands just inside normal grip; keep elbows under the bar.'},
  'Rope Pushdown': {group:'Triceps', rest:60, cue:'Keep upper arms still and spread the rope at lockout.'},
  'Overhead Cable Extension': {group:'Triceps', rest:60, cue:'Keep ribs down and elbows pointed forward.'},
  'Assisted Pull-Up': {group:'Back', rest:120, cue:'Lead with chest and drive elbows toward your ribs.'},
  'Lat Pulldown': {group:'Back', rest:90, cue:'Pull to upper chest without leaning far backward.'},
  'Chest-Supported Row': {group:'Back', rest:90, cue:'Pause with shoulder blades together; avoid shrugging.'},
  'Seated Cable Row': {group:'Back', rest:90, cue:'Keep torso stable and finish with elbows behind you.'},
  'Face Pull': {group:'Shoulders', rest:60, cue:'Pull toward eyebrows with thumbs moving behind you.'},
  'Dumbbell Curl': {group:'Biceps', rest:60, cue:'Keep elbows close and avoid swinging.'},
  'Hammer Curl': {group:'Biceps', rest:60, cue:'Neutral grip; control the lowering phase.'},
  'Smith Machine Squat': {group:'Legs', rest:180, cue:'Set feet slightly forward, brace, and descend under control.'},
  'Smith Romanian Deadlift': {group:'Hamstrings', rest:150, cue:'Push hips back, keep bar close, stop when hamstrings limit depth.'},
  'Bulgarian Split Squat': {group:'Legs', rest:90, cue:'Use a stable stance and drive through the whole front foot.'},
  'Leg Press': {group:'Legs', rest:120, cue:'Control depth without letting your lower back curl.'},
  'Seated Leg Curl': {group:'Hamstrings', rest:75, cue:'Keep hips down and pause at full knee flexion.'},
  'Standing Calf Raise': {group:'Calves', rest:60, cue:'Use a full stretch and pause at the top.'},
  'Plank': {group:'Core', rest:60, cue:'Squeeze glutes, ribs down, and breathe behind the brace.'},
  'Overhead Press': {group:'Shoulders', rest:150, cue:'Brace hard, keep bar path close, and finish overhead.'},
  'Lateral Raise': {group:'Shoulders', rest:60, cue:'Raise in the scapular plane and stop around shoulder height.'},
  'Farmer Carry': {group:'Core', rest:90, cue:'Stand tall, grip hard, and take controlled steps.'},
  'Dead Bug': {group:'Core', rest:45, cue:'Keep lower back gently pressed down while extending opposite limbs.'}
};

const roundTo=(v,inc=2.5)=>Math.round(v/inc)*inc;
const set=(weight,reps,rir=2)=>({weight,reps,rir,done:false});
const sets=(count,weight,reps,rir=2)=>Array.from({length:count},()=>set(weight,reps,rir));

export const DEFAULT_STARTING_WEIGHTS={
  bench:115,squat:135,hinge:115,ohp:70,pullupReps:4,
  inclineDb:35,chestPress:70,pulldown:70,row:60,legPress:180,curl:20
};

function phaseForWeek(week){return week<=8?'Foundation':week<=16?'Build':'Strength Peak'}
function deloadWeek(week){return week%4===0}
function progressWeight(base,week,weekly,deload,increment=2.5){
  const trainingWeek=week-1-Math.floor((week-1)/4);
  const raw=base+trainingWeek*weekly;
  return roundTo(deload?raw*.86:raw,increment);
}
function ex(name,setList,role='Accessory',optional=false){return {name,sets:setList,role,optional,info:EXERCISE_LIBRARY[name]}}

export function buildProgram(settings={}){
  const start={...DEFAULT_STARTING_WEIGHTS,...(settings.startingWeights||{})};
  const inc=settings.units==='kg'?1:2.5;
  const weeks=[];
  for(let week=1;week<=24;week++){
    const deload=deloadWeek(week),phase=phaseForWeek(week);
    const benchHeavy=progressWeight(Math.max(45,start.bench-5),week,2.5,deload,inc);
    const benchVolume=roundTo((start.bench*.80)+(week-1)*1.8,inc)*(deload?.88:1);
    const squat=progressWeight(start.squat,week,5,deload,inc);
    const hinge=progressWeight(start.hinge,week,5,deload,inc);
    const ohp=progressWeight(start.ohp,week,2.5,deload,inc);
    const heavySets=deload?3:(week<=8?5:week<=16?4:5);
    const heavyReps=deload?5:(week<=8?5:week<=16?4:3);
    const volumeSets=deload?3:4;
    const volumeReps=deload?8:(week<=16?8:6);
    const sessions=[
      {id:`w${week}-chest`,type:'chest',label:'Chest & Triceps',core:true,phase,week,deload,exercises:[
        ex('Bench Press',sets(heavySets,benchHeavy,heavyReps,deload?4:2),'Primary'),
        ex('Incline Dumbbell Press',sets(deload?2:3,roundTo(start.inclineDb+(week-1)*.5,5),8),'Secondary'),
        ex('Machine Chest Press',sets(deload?2:3,start.chestPress,10)),
        ex('Cable Fly',sets(2,20,12)),
        ex('Close-Grip Bench Press',sets(deload?2:3,roundTo(benchHeavy*.72,inc),8),'Secondary'),
        ex('Rope Pushdown',sets(3,30,12)),
        ex('Overhead Cable Extension',sets(2,25,12))
      ]},
      {id:`w${week}-back`,type:'back',label:'Back & Biceps',core:true,phase,week,deload,exercises:[
        ex('Assisted Pull-Up',sets(deload?3:4,0,Math.min(8,start.pullupReps+Math.floor((week-1)/4)),2),'Primary'),
        ex('Lat Pulldown',sets(deload?3:4,progressWeight(start.pulldown,week,2.5,deload,5),8),'Secondary'),
        ex('Chest-Supported Row',sets(deload?3:4,progressWeight(start.row,week,2.5,deload,5),8),'Secondary'),
        ex('Seated Cable Row',sets(3,start.row,10)),
        ex('Face Pull',sets(3,25,15)),
        ex('Dumbbell Curl',sets(3,start.curl,10)),
        ex('Hammer Curl',sets(3,start.curl,12)),
        ex('Dead Bug',sets(3,0,10))
      ]},
      {id:`w${week}-legs`,type:'legs',label:'Legs',core:true,phase,week,deload,exercises:[
        ex('Smith Machine Squat',sets(heavySets,squat,heavyReps,deload?4:2),'Primary'),
        ex('Smith Romanian Deadlift',sets(deload?3:4,hinge,6,2),'Primary'),
        ex('Bulgarian Split Squat',sets(3,20,8)),
        ex('Leg Press',sets(deload?2:3,progressWeight(start.legPress,week,5,deload,10),10),'Secondary'),
        ex('Seated Leg Curl',sets(3,60,12)),
        ex('Standing Calf Raise',sets(4,60,12)),
        ex('Plank',sets(3,0,45))
      ]},
      {id:`w${week}-optional`,type:'optional',label:'Optional Upper Strength',core:false,phase,week,deload,exercises:[
        ex('Bench Press',sets(volumeSets,roundTo(benchVolume,inc),volumeReps,3),'Primary',true),
        ex('Overhead Press',sets(deload?3:4,ohp,6,2),'Primary',true),
        ex('Assisted Pull-Up',sets(3,0,Math.min(8,start.pullupReps+1),2),'Secondary',true),
        ex('Incline Dumbbell Press',sets(3,roundTo(start.inclineDb+(week-1)*.5,5),10), 'Accessory',true),
        ex('Lateral Raise',sets(3,12.5,15),'Accessory',true),
        ex('Farmer Carry',sets(3,40,40),'Accessory',true),
        ex('Plank',sets(3,0,45),'Accessory',true)
      ]}
    ];
    weeks.push({week,phase,deload,sessions});
  }
  return weeks;
}

export function flattenProgram(program){return program.flatMap(w=>w.sessions)}
export function nextSession(program,completedIds=[]){
  const flat=flattenProgram(program);
  for(let week=1;week<=24;week++){
    const core=flat.filter(s=>s.week===week&&s.core);
    const nextCore=core.find(s=>!completedIds.includes(s.id));
    if(nextCore)return nextCore;
  }
  return null;
}
export function optionalSessionForCurrentWeek(program,completedIds=[]){
  const next=nextSession(program,completedIds);
  const week=next?.week || 24;
  return flattenProgram(program).find(s=>s.week===week&&!s.core&&!completedIds.includes(s.id))||null;
}
export function applyRecommendations(session,recommendations={}){
  return {...session,exercises:session.exercises.map(e=>{
    const r=recommendations[e.name];
    if(!r)return structuredClone(e);
    return {...structuredClone(e),sets:e.sets.map(s=>({...s,weight:r.weight??s.weight,reps:r.reps??s.reps}))};
  })};
}
