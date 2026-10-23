const cp=require('child_process');
const fs=require('fs'),assert=require('assert'),path=require('path'),{pathToFileURL}=require('url'),vm=require('vm');
(async()=>{const C=require('../dist/cpexcel.js'),M=await import(pathToFileURL(path.resolve('dist/cpexcel.full.mjs'))),results=[];
const baseline=vm.createContext({console});vm.runInContext(cp.execFileSync('git',['show','8a7cfd47bde8258c0d91df6a737bf0136699cdf8:xlsx.js'],{encoding:'utf8',maxBuffer:3000000}),baseline);baseline.XLSX.set_cptable(C);const baselineText='Ś╫êëτ⌡ś',baselineBytes=new Uint8Array([118,97,108,117,101,10,...C.utils.encode(620,baselineText,'arr')]);const before=baseline.XLSX.read(baselineBytes,{type:'array',codepage:620});assert.notEqual(before.Sheets[before.SheetNames[0]].A2.v,baselineText);results.push({name:'upstream array-codepage control',originalMismatchReproduced:true});
for(const [name,X] of [['cjs',C],['esm',M]]){
 for(const [cp,text] of [[620,'Ś╫êëτ⌡ś'],[895,'Š╫ěéτ⌡š ĺ'],[10008,'中文汉字']]){const bytes=X.utils.encode(cp,text);assert.equal(X.utils.decode(cp,bytes),text);results.push({name,codepage:cp,roundtrip:true})}
 assert.equal(X.utils.decode(895,[0x8d]),'ĺ');assert.equal(X.utils.encode(895,'ĺ')[0],0x8d);assert.equal(X.utils.decode(895,[0xdd]),'▌');assert.equal(X.utils.encode(10008,'∥').join(','),'161,206');assert(!((X.cptable||X)[10008].dec[0xa1ac]));
}
for(const entry of ['xlsx.js','xlsx.mjs','dist/xlsx.full.min.js','dist/xlsx.core.min.js','dist/xlsx.mini.min.js','dist/xlsx.extendscript.js']){
 let X;if(entry.endsWith('.mjs'))X=await import(pathToFileURL(path.resolve(entry)));else if(entry.includes('extendscript')){const ctx=vm.createContext({console});vm.runInContext(fs.readFileSync(entry,'utf8'),ctx);X=ctx.XLSX}else X=require(path.resolve(entry));
 X.set_cptable(C);
 for(const [label,input,codepage,text] of [['utf8',Buffer.from('value\n中文','utf8'),65001,'中文'],['utf8 BOM overrides legacy option',Buffer.concat([Buffer.from([239,187,191]),Buffer.from('value\n中文','utf8')]),620,'中文'],['default latin1',Buffer.from('value\nplain'),undefined,'plain']]){const w=X.read(new Uint8Array(input),{type:'array',codepage});assert.equal(w.Sheets[w.SheetNames[0]].A2.v,text);results.push({entry,arrayCompatibility:label,pass:true})}
 for(const [cp,text] of [[620,'Ś╫êëτ⌡ś'],[895,'Š╫ěéτ⌡š ĺ'],[10008,'中文汉字']]){const input=Buffer.concat([Buffer.from('value\n'),Buffer.from(C.utils.encode(cp,text))]);for(const type of ['buffer','array','binary']){const data=type==='array'?new Uint8Array(input):type==='binary'?input.toString('binary'):input;const w=X.read(data,{type,codepage:cp});assert.equal(w.Sheets[w.SheetNames[0]].A2.v,text);results.push({entry,codepage:cp,inputType:type,csvImport:true})}}
}
fs.writeFileSync('community/results/restored-codepages.json',JSON.stringify({results,caseGroups:results.length,failures:0,cp895Changes:'8D is U+013A rather than upstream U+01EA; DD uses CP437 U+258C, correcting source typo',cp10008Policy:'Only |0 roundtrip entries; do not alias reverse fallback A1AC; U+2225 encodes A1CE'},null,2)+'\n');console.log(results.length+' restored encoding roundtrip/CSV groups passed');
})().catch(e=>{console.error(e);process.exitCode=1});
