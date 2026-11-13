// Bounded local checks for development-only advisory regressions.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const tools=path.resolve(__dirname,'../.ci/test-tools/node_modules');
if(process.argv[2]==='minimatch-child'){
 const {Minimatch}=require(path.join(tools,'minimatch'));
 const m=new Minimatch(('**/../a/b/').repeat(10)+'target',{optimizationLevel:2,braceExpandMax:16});
 assert(m.globParts.length<=16,'Pattern expansion exceeds configured bound');
 process.exit(0);
}
(async()=>{
 const p=spawnSync(process.execPath,['--max-old-space-size=128',__filename,'minimatch-child'],{timeout:2000,encoding:'utf8'});
 assert.equal(p.status,0,'Minimatch must bound pattern amplification within resource bounds: '+p.stderr);
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'xlsx-glob-abort-'));
 try{
  for(let a=0;a<8;a++)for(let b=0;b<8;b++)fs.mkdirSync(path.join(folder,'a'+a,'b'+b),{recursive:true});
  const {glob}=require(path.join(tools,'glob'));const controller=new AbortController();let reads=0;
  const wrapped={...fs,readdir(...args){++reads; if(reads===1)controller.abort(new Error('inert-regression-abort')); return fs.readdir(...args)}};
  await assert.rejects(glob('**/*',{cwd:folder,signal:controller.signal,fs:wrapped}),/inert-regression-abort/);
  const atReject=reads;await new Promise(r=>setTimeout(r,100));
  assert.equal(reads,atReject,'Glob continues filesystem traversal after rejection');
  assert(reads<=1,'Glob traversed after abort');
  console.log('Development security: minimatch amplification bounded; glob abort stops traversal ('+reads+' directory read).');
 }finally{fs.rmSync(folder,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
