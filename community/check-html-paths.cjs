const fs=require('fs'),vm=require('vm'),cp=require('child_process'),{Readable}=require('stream'),{pathToFileURL}=require('url'),path=require('path');
(async()=>{const results=[];
const baseline=vm.createContext({console});vm.runInContext(cp.execFileSync('git',['show','8a7cfd47bde8258c0d91df6a737bf0136699cdf8:xlsx.js'],{encoding:'utf8',maxBuffer:3000000}),baseline);
const X0=baseline.XLSX,s0=X0.utils.aoa_to_sheet([['marker']]);s0.A1.l={Target:'javascript:/*inert*/void(0)'};
if(!X0.utils.sheet_to_html(s0).includes('href="javascript:'))throw Error('baseline did not reproduce');results.push({name:'unpatched upstream control',status:'pass',unsafeHrefReproduced:true});
for(const name of ['xlsx.js','xlsx.mjs']){const X=name.endsWith('mjs')?await import(pathToFileURL(path.resolve(name))):require(path.resolve(name));X.stream.set_readable(Readable);
for(const target of ['https://example.org/','javascript:/*inert*/void(0)']){const s=X.utils.aoa_to_sheet([['marker']]);s.A1.l={Target:target};const w=X.utils.book_new();X.utils.book_append_sheet(w,s,'Sheet1');
for(const [route,html] of [['write html',X.write(w,{bookType:'html',type:'string'})],['stream html',await new Promise((resolve,reject)=>{let text='';X.stream.to_html(s).on('data',x=>text+=x).on('end',()=>resolve(text)).on('error',reject)})]]){const expect=target.startsWith('https:');if(html.includes('<a href=')!==expect)throw Error(name+' '+route);results.push({name:name+' '+route,targetAllowed:expect,status:'pass'})}}
}
fs.writeFileSync('community/results/html-paths.json',JSON.stringify({results},null,2)+'\n');console.log(results.length+' path/control checks passed');})().catch(e=>{console.error(e);process.exitCode=1});
