// Independent reproducible typecheck wrapper; compiler installations remain test-only.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..');
const checks=[
 ['upstream fixtures','/tmp/sheetjs-release-check-tools/node_modules/typescript','types/tsconfig.json'],
 ['strict CJS and ESM consumers','/tmp/sheetjs-modern-typecheck/node_modules/typescript','community/types/tsconfig.json']
];
const results=checks.map(([name,tool,config])=>{
 const run=cp.spawnSync(process.execPath,[path.join(tool,'bin/tsc'),'-p',config],{cwd:root,encoding:'utf8',timeout:30000});
 return {name,compiler:require(path.join(tool,'package.json')).version,config,exitCode:run.status,status:run.status===0?'pass':'fail',diagnostics:run.stdout+run.stderr,error:run.error?.message};
});
fs.writeFileSync(path.join(__dirname,'results/typescript.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));process.exitCode=results.some(r=>r.status!=='pass')?1:0;
