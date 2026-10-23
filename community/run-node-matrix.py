"""Run full upstream entry suites under three isolated official Node runtimes."""
from pathlib import Path
import json,subprocess,concurrent.futures,datetime
root=Path(__file__).resolve().parents[1];out=root/'community/results';runtimes=json.loads(Path('/tmp/sheetjs-node-matrix/runtimes.json').read_text())
def run(runtime):
 version=runtime['version'];node=runtime['node'];record={'version':version,'artifact':runtime,'checks':[]}
 try:
  actual=subprocess.check_output([node,'--version'],text=True).strip();assert actual==version
  for mode,entry in [('cjs','test.js'),('esm','test.mjs')]:
   file=out/('node-'+version+'-'+mode+'.json');log=out/('node-'+version+'-'+mode+'.log')
   cmd=[node,'--max-old-space-size=4096','/tmp/sheetjs-release-check-tools/node_modules/mocha/bin/mocha.js',entry,'--reporter','json','--reporter-option','output='+str(file),'--timeout','30000']
   with log.open('w') as stream:p=subprocess.run(cmd,cwd=root,stdout=stream,stderr=subprocess.STDOUT,timeout=360)
   data=json.loads(file.read_text()) if file.exists() else {}
   record['checks'].append({'name':'full upstream '+mode,'exitCode':p.returncode,'stats':data.get('stats'),'pending':[x['fullTitle'] for x in data.get('pending',[])],'failures':[{'test':x['fullTitle'],'message':x.get('err',{}).get('message')} for x in data.get('failures',[])]})
 except Exception as e:record['blocker']=str(e)
 (out/('node-'+version+'-summary.json')).write_text(json.dumps(record,indent=2)+'\n');return record
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(run,runtimes))
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'platform':'macOS ARM64','policy':'Node 22/24 LTS proposed production targets; Node 26 Current forward compatibility. No >=0.8 or cross-platform certification.','runtimes':results,'publishingEnabled':False}
(out/'node-matrix.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
raise SystemExit(1 if any(r.get('blocker') or any(x['exitCode'] for x in r['checks']) for r in results) else 0)
