// Original independent test harness; not an upstream contribution or security certification.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
process.chdir(root);
const results = [];
const record = (name, pass, evidence) => results.push({name, status:pass?'pass':'fail', evidence});
const child = (code, args=[], timeout=5000) => cp.spawnSync(process.execPath,
  ['--max-old-space-size=256','-e',code,...args], {cwd:root,encoding:'utf8',timeout});
const X = require('../xlsx.js');
const wb=X.utils.book_new(), ws=X.utils.aoa_to_sheet([['hello']]);
ws.A1.c=[{a:'local regression',t:'local regression'}];
X.utils.book_append_sheet(wb,ws,'Data');
const zip=X.CFB.read(X.write(wb,{type:'buffer',bookType:'xlsx'}),{type:'buffer'});
const ci=zip.FullPaths.findIndex(p=>p.endsWith('comments1.xml'));
zip.FileIndex[ci].content=Buffer.from(zip.FileIndex[ci].content.toString().replace('ref="A1"','ref="__proto__"'));
zip.FileIndex[ci].size=zip.FileIndex[ci].content.length;
const fixture=path.join(__dirname,'controls/comment-address.xlsx');
fs.writeFileSync(fixture,X.CFB.write(zip,{type:'buffer',fileType:'zip'}));
const pollute=`const X=require(process.argv[1]);if(Object.hasOwn(Object.prototype,'c'))throw Error('dirty child');X.read(require('fs').readFileSync(process.argv[2]),{type:'buffer'});console.log(JSON.stringify({version:X.version,polluted:Object.hasOwn(Object.prototype,'c')}));`;
for(const [label,lib,expected] of [['affected-0.19.2','./community/controls/v0.19.2/xlsx.js',true],['candidate-CJS','./xlsx.js',false],['candidate-full','./dist/xlsx.full.min.js',false],['candidate-core','./dist/xlsx.core.min.js',false],['candidate-mini','./dist/xlsx.mini.min.js',false]]) {
  const r=child(pollute,[lib,fixture]);
  let evidence;try{evidence=JSON.parse(r.stdout)}catch{evidence={error:r.stderr||r.error?.message}};
  record('CVE-2023-30533 comment-address '+label,r.status===0&&evidence.polluted===expected,evidence);
}
const redos=`const X=require(process.argv[1]),n=+process.argv[2];const s='<table><tr><td>x'+' '.repeat(n)+'y</td></tr></table>';const t=performance.now();const w=X.read(s,{type:'string'});console.log(JSON.stringify({version:X.version,n,ms:performance.now()-t,hasSheet:!!w.SheetNames.length}));`;
for(const [label,lib] of [['affected-0.20.1','./community/controls/v0.20.1/xlsx.js'],['candidate-CJS','./xlsx.js'],['candidate-full','./dist/xlsx.full.min.js'],['candidate-core','./dist/xlsx.core.min.js']]) {
  const affected=label.startsWith('affected');let observedBudgetExceeded=false;
  for(const n of [10000,30000,60000,120000]) {
    const r=child(redos,[lib,''+n],2500);
    let evidence;try{evidence=JSON.parse(r.stdout)}catch{evidence={timeout:r.error?.code==='ETIMEDOUT',error:r.stderr||undefined}};
    observedBudgetExceeded ||= !!evidence.timeout;
    const pass=affected?(r.status===0&&evidence.hasSheet||!!evidence.timeout):r.status===0&&evidence.hasSheet;
    record('CVE-2024-22363 HTML whitespace '+label+' '+n,pass,evidence);
    // Fixed input lengths are not a portable timing threshold. Keep the positive
    // control mandatory, increase bounded inputs, and stop once it is observed.
    if(affected&&observedBudgetExceeded)break;
  }
  if(affected)record('CVE-2024-22363 affected positive control exceeds processing budget',observedBudgetExceeded,{budgetMs:2500,maxInputSpaces:120000,observedBudgetExceeded});
}

const compat = `const assert=require('assert'),fs=require('fs');(async()=>{
const X=process.argv[1]==='esm'?await import(require('url').pathToFileURL(process.cwd()+'/xlsx.mjs')):require(process.argv[1]);
if(X.set_fs)X.set_fs(fs);
if(X.set_cptable)X.set_cptable(require('./dist/cpexcel.js'));
const values=[['name','count'],['भारत',42],['café',3.5]];
const w=X.utils.book_new();X.utils.book_append_sheet(w,X.utils.aoa_to_sheet(values),'Data');
const formats=['xlsx','xlsb','biff8','ods','csv','html','xlml'];let checked=[];
for(const bookType of formats){const b=X.write(w,{type:'buffer',bookType});const q=X.read(b,{type:'buffer'});assert.deepStrictEqual(X.utils.sheet_to_json(q.Sheets[q.SheetNames[0]],{header:1}),values);checked.push(bookType)}
const s=w.Sheets.Data;s.C1={t:'n',v:45.5,f:'SUM(B2:B3)'};s['!ref']='A1:C3';s['!merges']=[{s:{r:4,c:0},e:{r:4,c:1}}];s.A5={t:'s',v:'Merged'};s['!ref']='A1:C5';s.A2.c=[{a:'test',t:'comment'}];s.A3.l={Target:'https://example.org/'};
const q=X.read(X.write(w,{type:'buffer',bookType:'xlsx'}),{type:'buffer',cellFormula:true});assert.equal(q.Sheets.Data.C1.f,'SUM(B2:B3)');assert.equal(q.Sheets.Data.A2.c[0].t,'comment');assert.equal(q.Sheets.Data.A3.l.Target,'https://example.org/');assert.equal(q.Sheets.Data['!merges'].length,1);
const dw=X.utils.book_new();X.utils.book_append_sheet(dw,X.utils.aoa_to_sheet([[new Date('2024-01-02T12:30:00Z')]],{UTC:true}),'Dates');const dq=X.read(X.write(dw,{type:'buffer',bookType:'xlsx'}),{type:'buffer',cellDates:true});assert.equal(dq.Sheets.Dates.A1.v.toISOString(),'2024-01-02T12:30:00.000Z');
console.log(JSON.stringify({formats:checked,formula:true,comments:true,hyperlinks:true,merges:true,dates:true,version:X.version}));})().catch(e=>{console.error(e);process.exitCode=1});`;
for(const lib of ['./xlsx.js','esm','./dist/xlsx.full.min.js','./dist/xlsx.core.min.js']){
 const r=child(compat,[lib],10000);let evidence;try{evidence=JSON.parse(r.stdout)}catch{evidence={error:r.stderr||r.error?.message}};record('compatibility '+lib,r.status===0,evidence);
}
const browser=`const fs=require('fs'),vm=require('vm'),assert=require('assert');const ctx=vm.createContext({console});vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),ctx);vm.runInContext("var w=XLSX.utils.book_new();XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet([['भारत',42]]),'Data');var b=XLSX.write(w,{type:'array',bookType:'xlsx'});var q=XLSX.read(b,{type:'array'});var out=JSON.stringify(XLSX.utils.sheet_to_json(q.Sheets.Data,{header:1}));",ctx);assert.equal(ctx.out,JSON.stringify([['भारत',42]]));console.log(JSON.stringify({globalExport:true,roundtrip:true}));`;
for(const lib of ['dist/xlsx.full.min.js','dist/xlsx.core.min.js','dist/xlsx.mini.min.js']){const r=child(browser,[lib]);record('browser-global VM '+lib,r.status===0,r.status===0?JSON.parse(r.stdout):{error:r.stderr})}
const allbits=fs.readdirSync('bits').filter(f=>f.endsWith('.js')).sort().map(f=>fs.readFileSync('bits/'+f,'utf8')).join('').replace(/[\r\x1a]/g,'');
const built=allbits.replace(/^[ \t]*\/\*[:#][^*]*\*\/\s*(\n)?/gm,'').replace(/\/\*[:#][^*]*\*\//gm,'');
record('CJS source reconstruction',built===fs.readFileSync('xlsx.js','utf8'),{sha256:crypto.createHash('sha256').update(built).digest('hex'),method:'Makefile concatenation/annotation stripping; no minification rebuild'});
const output={node:process.version,checkedAt:new Date().toISOString(),upstreamCommit:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),results,limitations:['Targeted public-path regressions, not exhaustive vulnerability proof','Browser-global tests run in Node VM, not real browser engines','See release-gates.json for full-suite, TypeScript and browser reruns; bundler checks remain open','V8 heap cap is not an OS memory sandbox','See reproducibility-patched.json for rebuilt distribution verification']};
output.notApplicable=['Mini build omits HTML parser: HTML ReDoS path not tested on mini'];
fs.writeFileSync('community/results/verification.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').map(r=>({name:r.name,error:r.evidence.error?.slice(-1500)})),report:'community/results/verification.json'},null,2));process.exitCode=results.some(r=>r.status==='fail')?1:0;
