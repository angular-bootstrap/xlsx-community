// Build real packed-package consumers. Runtime verification is a separate stage.
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const tools='/tmp/sheetjs-bundler-tools/node_modules',consumer='/tmp/sheetjs-bundler-consumer',output=path.join(consumer,'out');fs.mkdirSync(output,{recursive:true});
(async()=>{const esbuild=require(tools+'/esbuild'),webpack=require(tools+'/webpack'),{rollup}=require(tools+'/rollup'),{nodeResolve}=require(tools+'/@rollup/plugin-node-resolve'),commonjs=require(tools+'/@rollup/plugin-commonjs'),vite=await import(pathToFileURL(tools+'/vite/dist/node/index.js'));
 const report={checkedAt:new Date().toISOString(),buildNode:process.version,tools:Object.fromEntries(['esbuild','webpack','webpack-cli','rollup','vite','@rollup/plugin-node-resolve','@rollup/plugin-commonjs'].map(p=>[p,JSON.parse(fs.readFileSync(tools+'/'+p+'/package.json')).version])),builds:[]};
 for(const name of (process.env.SHEETJS_BUNDLERS||'esbuild,webpack,rollup,vite').split(','))for(const variant of ['esm','cjs'])for(const platform of ['browser','node']){
  const id=name+'-'+variant+'-'+platform,entry=path.join(consumer,variant==='esm'?'entry.mjs':'entry.cjs'),file=path.join(output,id+'.js'),record={id,name,variant,platform,file,warnings:[]};report.builds.push(record);
  try{
   if(name==='esbuild'){const r=await esbuild.build({entryPoints:[entry],bundle:true,platform,format:platform==='browser'?'iife':'cjs',outfile:file,minify:true,logLevel:'silent'});record.warnings=r.warnings.map(x=>x.text)}
   if(name==='webpack'){await new Promise((resolve,reject)=>{const compiler=webpack({mode:'production',context:consumer,target:platform==='browser'?'web':'node22',entry,output:{path:output,filename:path.basename(file)},performance:false});compiler.run((error,stats)=>{compiler.close(()=>{});if(error)return reject(error);const data=stats.toJson({all:false,errors:true,warnings:true});record.warnings=data.warnings.map(x=>x.message);if(data.errors.length)return reject(Error(data.errors.map(x=>x.message).join('\n')));resolve()})})}
   if(name==='rollup'){const bundle=await rollup({input:entry,plugins:[nodeResolve({browser:platform==='browser',preferBuiltins:platform==='node'}),commonjs()],onwarn:w=>record.warnings.push(w.message)});await bundle.write({file,format:platform==='browser'?'iife':'cjs',name:'Consumer',inlineDynamicImports:true});await bundle.close()}
   if(name==='vite'){const r=await vite.build({root:consumer,configFile:false,logLevel:'warn',build:{ssr:platform==='node'?entry:false,lib:platform==='browser'?{entry,name:'Consumer',formats:['iife'],fileName:()=>path.basename(file)}:undefined,outDir:output,emptyOutDir:false,rolldownOptions:{output:{entryFileNames:path.basename(file),format:platform==='node'?'cjs':'iife',codeSplitting:false},onwarn:w=>record.warnings.push(w.message)}},ssr:{noExternal:true}});void r;}
   record.status='pass';record.bytes=fs.statSync(file).size;
  }catch(e){record.status='fail';record.error=String(e)}
 }
 if(process.env.SHEETJS_BUNDLERS){const previous=JSON.parse(fs.readFileSync(path.join(__dirname,'results/bundlers.json')));const replaced=new Set(report.builds.map(b=>b.name));report.builds=[...previous.builds.filter(b=>!replaced.has(b.name)),...report.builds];}
 fs.writeFileSync(path.join(__dirname,'results/bundlers.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=report.builds.some(x=>x.status==='fail')?1:0;
})().catch(e=>{console.error(e);process.exitCode=1});
