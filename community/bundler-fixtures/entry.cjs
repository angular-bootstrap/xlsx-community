const X=require('sheetjs-community-candidate');
const cp=require('sheetjs-community-candidate/dist/cpexcel');
const check=require('./checks.cjs');
try { globalThis.compatResult=check(X,cp); } catch(e) { globalThis.compatResult={passed:false,error:String(e)};throw e; }
