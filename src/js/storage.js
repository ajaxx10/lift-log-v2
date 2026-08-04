export const DATA_KEY='liftLogData_v2';
export const SETTINGS_KEY='liftLogSettings_v2';
export function loadJson(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
export function saveJson(key,value){localStorage.setItem(key,JSON.stringify(value))}
export function migrateLegacy(){
  if(localStorage.getItem(DATA_KEY)) return;
  const legacy=loadJson('liftLogPwa_v1',null);
  if(Array.isArray(legacy)) saveJson(DATA_KEY,{version:2,workouts:legacy,program:{startDate:new Date().toISOString().slice(0,10),completedSessionIds:[]}});
}
export function defaultData(){return{version:2,workouts:[],program:{startDate:new Date().toISOString().slice(0,10),completedSessionIds:[]}}}
export function defaultSettings(){return{rest:90,increment:2.5}}
