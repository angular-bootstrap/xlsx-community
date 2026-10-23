import * as X from 'sheetjs-community-candidate';
import * as cp from 'sheetjs-community-candidate/dist/cpexcel.full.mjs';
import check from './checks.cjs';
try { globalThis.compatResult=check(X,cp); } catch(e) { globalThis.compatResult={passed:false,error:String(e)};throw e; }
