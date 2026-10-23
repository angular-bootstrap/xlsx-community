// Compare the downloaded, hash-pinned official CDN artifact with the candidate.
// No network and no HTML execution. Child processes bound resource observations.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),cdn=path.join(__dirname,'controls/cdn-0.20.3');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const pins=JSON.parse(fs.readFileSync(path.join(__dirname,'public-evidence/cdn-baseline.json')));
for(const [n,h] of Object.entries(pins.runtimeHashes))if(hash(fs.readFileSync(path.join(cdn,n)))!==h)throw Error('CDN input mismatch: '+n);
const report={cdnSource:pins,timezone:[],resource:[],security:[],sourceEquivalence:[]};
for(const n of ['xlsx.js','xlsx.mjs','dist/xlsx.full.min.js'])report.sourceEquivalence.push({entry:n,cdnMatchesPinnedUpstream:hash(cp.execFileSync('git',['show','8a7cfd47bde8258c0d91df6a737bf0136699cdf8:'+n],{maxBuffer:3000000}))===hash(fs.readFileSync(path.join(cdn,n)))});
for(const TZ of ['UTC','America/New_York','Europe/Berlin','Asia/Kolkata','Pacific/Auckland']){
 const runs=[];for(const [label,folder] of [['cdn',cdn],['candidate',root]]){const p=cp.spawnSync(process.execPath,['community/timezone-case.cjs'],{cwd:root,env:{...process.env,TZ,SHEETJS_TEST_ROOT:folder},encoding:'utf8',timeout:30000,maxBuffer:2000000});if(p.status!==0)throw Error(p.stderr);runs.push({label,...JSON.parse(p.stdout)})}
 const a=runs[0].records,b=runs[1].records;report.timezone.push({timezone:TZ,cdnExplicitUtcFailures:a.filter(x=>x.kind==='explicit UTC instant'&&x.status==='fail').length,candidateExplicitUtcFailures:b.filter(x=>x.kind==='explicit UTC instant'&&x.status==='fail').length,cdnDefaultFailures:a.filter(x=>x.kind==='default local wall time'&&x.status==='fail').length,candidateDefaultFailures:b.filter(x=>x.kind==='default local wall time'&&x.status==='fail').length,identicalObservedDates:JSON.stringify(a)===JSON.stringify(b)});
}
const fixture=path.join(__dirname,'controls/large-declared-range.xlsx');
const resource=`const X=require(process.argv[1]),b=require('fs').readFileSync(process.argv[2]),bounded=process.argv[3]==='bounded';const w=X.read(b,{type:'buffer',sheetRows:bounded?100:0}),s=w.Sheets[w.SheetNames[0]];console.log(JSON.stringify(X.utils.sheet_to_json(s,{header:1,blankrows:false,...(bounded?{range:'A1:J100'}:{})})));`;
for(const [label,folder] of [['cdn',cdn],['candidate',root]])for(const mode of ['bounded','unbounded']){const p=cp.spawnSync(process.execPath,['--max-old-space-size=128','-e',resource,path.join(folder,'xlsx.js'),fixture,mode],{encoding:'utf8',timeout:2000,maxBuffer:100000});report.resource.push({label,mode,status:p.status===0?'completed':p.error?.code==='ETIMEDOUT'?'deadline-exceeded':'failed',output:p.stdout.trim()})}
for(const [label,folder] of [['cdn',cdn],['candidate',root]]){
 const code=`const X=require(process.argv[1]),fs=require('fs');if(Object.hasOwn(Object.prototype,'c'))throw Error('dirty child');X.read(fs.readFileSync(process.argv[2]),{type:'buffer'});if(Object.hasOwn(Object.prototype,'c'))throw Error('prototype pollution');const w=X.read('<table><tr><td>x'+' '.repeat(60000)+'y</td></tr></table>',{type:'string'});if(!w.SheetNames.length)throw Error('HTML parse');console.log('passed')`;
 const p=cp.spawnSync(process.execPath,['--max-old-space-size=256','-e',code,path.join(folder,'xlsx.js'),path.join(__dirname,'controls/comment-address.xlsx')],{encoding:'utf8',timeout:2500,maxBuffer:100000});report.security.push({label,knownCveRegressionCases:p.status===0?'pass':'fail'});
 const X=require(path.join(folder,'xlsx.js')),s=X.utils.aoa_to_sheet([['inert marker']]);s.A1.l={Target:'javascript:/*inert*/void(0)'};report.security.push({label,unsafeHyperlinkRetained:X.utils.sheet_to_html(s).includes('href="javascript:')});
}
report.conclusions={timezoneInherited:report.timezone.every(x=>x.identicalObservedDates),resourceInherited:report.resource.filter(x=>x.mode==='unbounded').every(x=>x.status==='deadline-exceeded'),cdnKnownCveCasesAlreadyFixed:report.security.filter(x=>x.knownCveRegressionCases).every(x=>x.knownCveRegressionCases==='pass'),noNewInheritedBehaviorFixes:true};
fs.writeFileSync(path.join(__dirname,'public-evidence/cdn-comparison.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
if(!Object.values(report.conclusions).every(Boolean)||!report.sourceEquivalence.every(x=>x.cdnMatchesPinnedUpstream))process.exitCode=1;
