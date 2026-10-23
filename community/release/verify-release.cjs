// Independent release checks. This script never publishes or changes the manifest.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'../..');
function verify({folder=root,publish=false,env=process.env}={}){
 const pkg=JSON.parse(fs.readFileSync(path.join(folder,'package.json'))),e=JSON.parse(fs.readFileSync(path.join(folder,'community/public-evidence/native-ci-results.json')));
 assert.equal(pkg.name,'@angular-bootstrap/xlsx');assert(/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version),'Invalid release version');
 assert.equal(pkg.repository.url,'git+https://github.com/angular-bootstrap/xlsx-community.git');assert.equal(pkg.license,'(Apache-2.0 AND Unicode-3.0 AND MIT)');assert(!pkg.bin,'CLI entry must not be reintroduced without review');
 assert(!Object.keys(pkg.dependencies||{}).length,'Runtime dependency changes require a separate review');
 assert(!env.NODE_AUTH_TOKEN&&!env.NPM_TOKEN,'Tokenless publishing requires NODE_AUTH_TOKEN and NPM_TOKEN to be absent');
 if(env.GITHUB_REPOSITORY)assert.equal(env.GITHUB_REPOSITORY,'angular-bootstrap/xlsx-community');
 if(env.GITHUB_REF_TYPE==='tag')assert.equal(env.GITHUB_REF_NAME,'v'+pkg.version,'Tag must match package version');
 if(publish){assert.equal(env.GITHUB_EVENT_NAME,'push');assert.equal(env.GITHUB_REF_TYPE,'tag','Only version-tag pushes may publish');assert.equal(pkg.private,false,'Publishing remains blocked by private:true');assert(!String(pkg.scripts?.prepublishOnly).includes('block-publish'),'Rejecting publish hook remains enabled');}
 else if(pkg.private)assert(String(pkg.scripts?.prepublishOnly).includes('block-publish'),'Private candidate must retain rejecting publish hook');
 assert(e.allNineArtifactsVerified&&e.completedVerifiedJobs===9&&e.rows.length===9,'Native matrix evidence incomplete');assert(/^[a-f0-9]{40}$/.test(e.testedCommit));
 const match=/^https:\/\/github\.com\/angular-bootstrap\/xlsx-community\/actions\/runs\/([0-9]+)$/.exec(e.run);assert(match,'Unexpected native run URL');
 assert.equal(new Set(e.rows.map(r=>r.runtime.platform+'/'+r.runtime.arch+'/'+r.runtime.node)).size,9,'Duplicate native matrix rows');
 for(const row of e.rows){assert.equal(row.runtime.commit,e.testedCommit);assert.equal(row.cjs.failures,0);assert.equal(row.esm.failures,0);assert.equal(row.securityCompatibilityFailures,0);assert.equal(row.richTextFailures,0);assert.equal(row.explicitUtcFailures,0);assert(row.corpusVerified)}
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const testedPackage=JSON.parse(cp.execFileSync('git',['show',e.testedCommit+':package.json'],{cwd:folder,encoding:'utf8'}));for(const key of ['main','module','types','exports','browser','engines'])assert.deepStrictEqual(pkg[key],testedPackage[key],'API metadata differs from native-tested commit: '+key);
 const runtime=['xlsxworker.js','xlsx.js','xlsx.mjs','xlsx.mini.js','xlsx.flow.js','xlsx.mini.flow.js','shim.js',...fs.readdirSync(path.join(folder,'dist')).filter(n=>/\.(?:js|mjs|map)$/.test(n)).map(n=>'dist/'+n),'types/index.d.ts'];
 for(const n of runtime){const tested=cp.execFileSync('git',['show',e.testedCommit+':'+n],{cwd:folder,maxBuffer:20000000});assert.equal(hash(fs.readFileSync(path.join(folder,n))),hash(tested),'Runtime/type bytes differ from native-tested commit: '+n)}
 for(const n of ['LICENSE','THIRD_PARTY_NOTICES.md','MAPPING_DATA_NOTICES.md','SECURITY.md','community/UPSTREAM_DIFFERENCES.md'])assert(fs.statSync(path.join(folder,n)).size>0,'Missing notice: '+n);
 const summary={name:pkg.name,version:pkg.version,private:pkg.private,publishMode:publish,nativeRunId:match[1],nativeCommit:e.testedCommit,verifiedRuntimeFiles:runtime.length,distTag:'next'};
 if(env.GITHUB_OUTPUT)fs.appendFileSync(env.GITHUB_OUTPUT,'native_run_id='+summary.nativeRunId+'\nnative_commit='+summary.nativeCommit+'\n');return summary;
}
if(require.main===module){try{console.log(JSON.stringify(verify({publish:process.argv.includes('--publish')}),null,2))}catch(e){console.error(e.message);process.exitCode=1}}
module.exports={verify};
