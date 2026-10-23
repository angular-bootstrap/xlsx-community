// Inert output tests, including real DOM URL normalization through jsdom.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {pathToFileURL}=require('url');
const {JSDOM}=require('/tmp/sheetjs-release-check-tools/node_modules/jsdom');
const {htmlLinkRegression:suite}=require('./html-link-cases.js');
const root=path.resolve(__dirname,'..');
(async()=>{
 const entries=['xlsx.js','xlsx.mini.js','dist/xlsx.full.min.js','dist/xlsx.core.min.js','dist/xlsx.mini.min.js','dist/xlsx.extendscript.js','xlsx.mjs'];
 const results=[];
 for(const entry of entries){try{
  let X;if(entry.endsWith('.mjs'))X=await import(pathToFileURL(path.join(root,entry)));
  else if((entry.includes('extendscript')||entry==='xlsx.mini.js')){const context={console};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,entry),'utf8'),context,{timeout:10000});X=context.XLSX;}
  else X=require(path.join(root,entry));
  const assertions=suite.check(X,html=>new JSDOM(html,{url:'https://consumer.example/base/'}).window.document);
  results.push({entry,status:'pass',assertions});
 }catch(e){results.push({entry,status:'fail',error:String(e)})}}
 const report={policy:'Default allowlist: http, https, mailto, relative; reject controls/space/backslash, protocol-relative and other schemes. No bypass option.',results,failed:results.filter(r=>r.status==='fail').length};
 fs.writeFileSync(path.join(__dirname,'results/html-link-review.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=report.failed?1:0;
})().catch(e=>{console.error(e);process.exitCode=1});
