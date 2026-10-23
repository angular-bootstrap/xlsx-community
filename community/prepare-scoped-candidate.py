"""Prepare an explicitly non-publishable scoped candidate; no remote mutations."""
from pathlib import Path
import json,shutil,hashlib,subprocess,os
root=Path(__file__).resolve().parents[1];stage=root.parent/'release-review/angular-bootstrap-xlsx';stage.mkdir(parents=True,exist_ok=True)
manifestPath=root/'community/results/pack-manifest.json'
if not manifestPath.exists():
 (root/'.release-artifacts').mkdir(exist_ok=True);manifestPath.parent.mkdir(parents=True,exist_ok=True)
 command=['npm.cmd' if os.name=='nt' else 'npm','pack','--ignore-scripts','--json','--pack-destination',str(root/'.release-artifacts')]
 manifestPath.write_text(subprocess.check_output(command,cwd=root,text=True))
manifest=json.loads(manifestPath.read_text())[0]
for entry in manifest['files']:
 name=entry['path']
 if name=='package.json' or name=='bin/xlsx.njs':continue
 if not (root/name).exists():continue
 src=root/name;dest=stage/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dest)
 if dest.suffix=='.json':
  raw=dest.read_text()
  for old,new in [(str(root),'[source]'),(str(Path.home()),'[home]'),('/tmp/','[temporary]/')]:raw=raw.replace(old,new)
  dest.write_text(raw)
pkg=json.loads((root/'package.json').read_text());pkg.update(name='@angular-bootstrap/xlsx',version='0.1.0-rc.1',private=True,repository={'type':'git','url':'git+https://github.com/angular-bootstrap/xlsx-community.git'},bugs={'url':'https://github.com/angular-bootstrap/xlsx-community/issues'},homepage='https://github.com/angular-bootstrap/xlsx-community#readme',publishConfig={'access':'public','tag':'next','provenance':True});pkg.pop('bin',None);pkg['devDependencies']={}
pkg['files']=[x for x in pkg['files'] if x!='bin/xlsx.njs'];pkg['files']+=['SECURITY.md','community/ANGULAR_BOOTSTRAP_RELEASE_RESULTS.md','community/RELEASE_PLAN.md','community/results/rich-text-security.json','community/results/timezones.json','community/results/framework-integration.json'];
pkg['files'].append('community/public-evidence/*.json')
shutil.copytree(root/'community/public-evidence',stage/'community/public-evidence',dirs_exist_ok=True)
(stage/'package.json').write_text(json.dumps(pkg,indent=2)+'\n')
for name in ['SECURITY.md','community/ANGULAR_BOOTSTRAP_RELEASE_RESULTS.md','community/RELEASE_PLAN.md','community/results/rich-text-security.json','community/results/timezones.json','community/results/framework-integration.json']:
 if (root/name).is_file():
  target=stage/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
  if target.suffix=='.json':
   raw=target.read_text()
   for old,new in [(str(root),'[source]'),(str(Path.home()),'[home]'),('/tmp/','[temporary]/')]:raw=raw.replace(old,new)
   target.write_text(raw)
s=(root/'README.md').read_text().replace('sheetjs-community-candidate@0.20.3-community.0','@angular-bootstrap/xlsx@0.1.0-rc.1');s='**Planned independent prerelease under angular-bootstrap. The independent repository is created; npm ownership is not verified. Publishing remains disabled.**\n\n'+s;(stage/'README.md').write_text(s)
(stage/'community/block-publish.cjs').write_text("throw new Error('Publishing disabled: scoped review candidate requires verified ownership, completed release gates and explicit publication authorization.');\n")
(root/'community/release/scoped-stage.json').write_text(json.dumps({'name':pkg['name'],'version':pkg['version'],'stage':str(stage.relative_to(root.parent)),'repositoryPlanned':pkg['repository']['url'],'private':True,'publishingEnabled':False,'cli':'Deprecated upstream bin entry omitted from this independent prerelease','runtimeHashes':{p:hashlib.sha256((stage/p).read_bytes()).hexdigest() for p in ['xlsx.js','xlsx.mjs','dist/cpexcel.js','dist/cpexcel.full.mjs']}},indent=2)+'\n')
print(stage)
