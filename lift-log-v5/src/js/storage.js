export const DATA_KEY='liftLogDataV4';
export const SETTINGS_KEY='liftLogSettingsV4';
export const SAFETY_BACKUP_KEY='liftLogDataV4PreCustomUpdateBackup';
export const defaultData=()=>({
  schemaVersion:5,
  workouts:[],
  program:{completedSessionIds:[],skippedSessionIds:[]},
  recommendations:{},
  activeWorkout:null,
  prs:[],
  bodyWeights:[]
});
export const defaultSettings=()=>({
  rest:120,units:'lb',theme:'dark',programStartDate:new Date().toISOString().slice(0,10),
  startingWeights:{bench:115,squat:135,hinge:115,ohp:70,pullupReps:4,inclineDb:35,chestPress:70,pulldown:70,row:60,legPress:180,curl:20}
});
export function loadJson(key,fallback){try{return {...fallback,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{return fallback}}
export function saveJson(key,value){localStorage.setItem(key,JSON.stringify(value))}
export function migrateLegacy(){
  if(localStorage.getItem(DATA_KEY))return;
  for(const key of ['liftLogDataV2','liftLogData','workoutTrackerData']){
    try{
      const old=JSON.parse(localStorage.getItem(key)||'null');
      if(!old)continue;
      const d=defaultData();d.workouts=old.workouts||[];d.program.completedSessionIds=old.program?.completedSessionIds||[];
      localStorage.setItem(DATA_KEY,JSON.stringify(d));return;
    }catch{}
  }
}

export function ensureSafetyBackup(){
  try{
    const current=localStorage.getItem(DATA_KEY);
    if(current&&!localStorage.getItem(SAFETY_BACKUP_KEY))localStorage.setItem(SAFETY_BACKUP_KEY,current);
  }catch{}
}
