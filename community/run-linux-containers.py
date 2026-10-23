"""Linux ARM64 full suites and Linux x64-emulated consumer checks. No network in tests."""
from pathlib import Path
import json,subprocess,tempfile,os,concurrent.futures,hashlib
root=Path(__file__).resolve().parents[1];stage=root.parent/'release-review/angular-bootstrap-xlsx';out=root/'community/results'
image='node:24.22.1-bookworm-slim';records=[]
runtimeHashes={n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in ['xlsx.js','xlsx.mjs']}

checks="const X=require('/scoped'),cp=require('/scoped/dist/cpexcel.js'),check=require('/checks.cjs');console.log(JSON.stringify({platform:process.platform,arch:process.arch,node:process.version,...check(X,cp)}));"
with tempfile.TemporaryDirectory(prefix='sheetjs-linux-results-') as temp:
 temp=Path(temp);os.chmod(temp,0o777)
 def run(arch):
  base=['docker','run','--rm','--platform','linux/'+arch,'--network','none','--label','sheetjs-release-check=true','--mount','type=volume,source=sheetjs-release-corpus-20261023,target=/work/test_files,volume-subpath=test_files,readonly','--read-only','--cap-drop','ALL','--security-opt','no-new-privileges','--pids-limit','128','--memory','3g','--cpus','2','--user','1000:1000','--tmpfs','/tmp:rw,nosuid,size=256m','--tmpfs','/work/tmp:rw,nosuid,size=128m','-v',str(root)+':/work:ro','-v',str(stage)+':/scoped:ro','-v',str(root/'community/bundler-fixtures/checks.cjs')+':/checks.cjs:ro','-v','/tmp/sheetjs-release-check-tools:/tmp/sheetjs-release-check-tools:ro','-v',str(temp)+':/results:rw','-w','/work',image]
  record={'requestedPlatform':'linux/'+arch,'execution':'native ARM64 Linux VM' if arch=='arm64' else 'x64 emulation on ARM64 host','checks':[]}
  p=subprocess.run(base+['node','-e',checks],capture_output=True,text=True,timeout=180);record['checks'].append({'name':'scoped CJS consumer','exitCode':p.returncode,'output':p.stdout,'error':p.stderr})
  if p.returncode==0:
   actual=json.loads(p.stdout);assert actual['arch']==('arm64' if arch=='arm64' else 'x64')
  # Full unfiltered upstream suites on actual Linux ARM64. Native x64/Windows full jobs are prepared in CI.
  if arch=='arm64':
   for mode,entry in [('cjs','test.js'),('esm','test.mjs')]:
    filename='linux-'+arch+'-'+mode+'.json'
    cmd=base+['node','--max-old-space-size=2048','/tmp/sheetjs-release-check-tools/node_modules/mocha/bin/mocha.js',entry,'--reporter','json','--reporter-option','output=/results/'+filename,'--timeout','30000']
    with (out/('linux-'+arch+'-'+mode+'.log')).open('w') as log:p=subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT,timeout=900)
    if (temp/filename).exists():
     (out/filename).write_bytes((temp/filename).read_bytes());data=json.loads((temp/filename).read_text());record['checks'].append({'name':'full upstream '+mode,'exitCode':p.returncode,'stats':data['stats'],'failures':[{'test':x['fullTitle'],'message':x.get('err',{}).get('message')} for x in data['failures']]})
    else:record['checks'].append({'name':'full upstream '+mode,'exitCode':p.returncode,'error':'No JSON report'})
  return record
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:records=list(pool.map(run,['arm64','amd64']))
assert runtimeHashes=={n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in runtimeHashes},'Source changed during test run'
report={'runtimeHashes':runtimeHashes,'image':image,'imageDigests':json.loads(subprocess.check_output(['docker','image','inspect',image,'--format','{{json .RepoDigests}}'],text=True)),'runs':records,'limitations':['No native Windows execution','x64 consumer checks use emulation, not native x64 hardware','Full Linux suite currently ARM64; native x64 jobs prepared for CI']}
(out/'linux-containers.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(1 if any(x['exitCode'] for r in records for x in r['checks']) else 0)
