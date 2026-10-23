// Independent local real-browser tests. No external service or credentials.
const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'..');
const pw=require(process.env.SHEETJS_PLAYWRIGHT_PATH||'/tmp/sheetjs-release-check-tools/node_modules/playwright');
const allowed=new Set(['/community/html-link-cases.js','/community/browser-check.html','/xlsx.mjs','/dist/xlsx.full.min.js','/dist/xlsx.core.min.js','/dist/xlsx.mini.min.js','/dist/cpexcel.full.mjs','/community/controls/comment-address.xlsx']);
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;if(!allowed.has(p)){res.writeHead(404).end();return}const type=p.endsWith('.html')?'text/html':p.endsWith('.xlsx')?'application/octet-stream':'text/javascript';res.setHeader('Content-Type',type);fs.createReadStream(path.join(root,p)).pipe(res)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const output={checkedAt:new Date().toISOString(),playwright:require('/tmp/sheetjs-release-check-tools/node_modules/playwright/package.json').version,browsers:[]};
 for(const [name,engine,options] of [['Chrome',pw.chromium,{channel:'chrome'}],['Firefox',pw.firefox,{}],['WebKit',pw.webkit,{}]]){
  let browser;const record={name,variants:[]};output.browsers.push(record);
  try{browser=await engine.launch({headless:true,...options});record.version=browser.version();for(const variant of ['full','core','mini','esm']){const page=await browser.newPage();page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/community/browser-check.html?variant='+variant);await page.waitForFunction(()=>window.releaseCheckDone);const result=await page.evaluate(()=>window.releaseCheck);record.variants.push({...result,pageErrors:errors});await page.screenshot({path:path.join(__dirname,'results',`browser-${name.toLowerCase()}-${variant}.png`),fullPage:true});await page.close()}}catch(e){record.blocker=String(e)}finally{if(browser)await browser.close()}
 }
 server.close();fs.writeFileSync(path.join(__dirname,'results/real-browsers.json'),JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify(output,null,2));process.exitCode=output.browsers.some(b=>b.blocker||b.variants.some(v=>v.results.some(r=>r.status==='fail')||v.pageErrors.length))?1:0;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
