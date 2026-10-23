const fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert'),{Readable}=require('stream'),{pathToFileURL}=require('url');
(async()=>{const pkg=process.argv[2]||'/tmp/sheetjs-bundler-consumer/node_modules/sheetjs-community-candidate',cjs=require(pkg),esm=await import(pathToFileURL(path.join(pkg,'xlsx.mjs')));let count=0;const folder=fs.mkdtempSync(path.join(os.tmpdir(),'sheetjs-node-io-'));
try{for(const [name,X] of [['cjs',cjs],['esm',esm]]){if(X.set_fs)X.set_fs(fs);X.stream.set_readable(Readable);const values=[['name','count'],['भारत',42]],s=X.utils.aoa_to_sheet(values),w=X.utils.book_new();X.utils.book_append_sheet(w,s,'Data');const file=path.join(folder,name+'.xlsx');X.writeFile(w,file);assert.deepEqual(X.utils.sheet_to_json(X.readFile(file).Sheets.Data,{header:1}),values);count++;
const rows=[];for await(const row of X.stream.to_json(s,{header:1}))rows.push(row);assert.deepEqual(rows,values);count++;
s.A1.l={Target:'javascript:inert'};let html='';for await(const chunk of X.stream.to_html(s))html+=chunk;assert(!html.includes('<a href='));count++;
let csv='';for await(const chunk of X.stream.to_csv(s))csv+=chunk;assert(csv.includes('भारत,42'));count++;
}console.log(JSON.stringify({node:process.version,passed:count,failed:0,esmSetup:'explicit set_fs and stream.set_readable'}));}finally{fs.rmSync(folder,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
