"""Inspect the exact packed archive without executing it. Never publishes."""
from pathlib import Path
import json,tarfile,hashlib,os,sys,re
root=Path(__file__).resolve().parents[2]
pkg=json.loads((root/'package.json').read_text())
pack=json.loads((root/'.release-artifacts/pack.json').read_text())
# npm 12 keys pack output by package name; npm 11 used a single-item array.
if isinstance(pack,list):
 assert len(pack)==1,'Expected exactly one packed package'
 manifest=pack[0]
else:
 assert isinstance(pack,dict) and list(pack)==[pkg['name']],'Unexpected pack output'
 manifest=pack[pkg['name']]
assert manifest['name']==pkg['name'] and manifest['version']==pkg['version']
archive=root/'.release-artifacts'/manifest['filename']
assert archive.parent==root/'.release-artifacts' and archive.name.startswith('angular-bootstrap-xlsx-')
with tarfile.open(archive) as tar:
 entries={m.name:m for m in tar.getmembers()}
 assert all(n.startswith('package/') and '..' not in Path(n).parts for n in entries)
 assert not any(m.issym() or m.islnk() for m in entries.values())
 packed=json.load(tar.extractfile('package/package.json'))
 assert packed==pkg,'Packed manifest differs from reviewed source'
 for name in ['LICENSE','THIRD_PARTY_NOTICES.md','MAPPING_DATA_NOTICES.md','SECURITY.md','community/UPSTREAM_DIFFERENCES.md','community/block-publish.cjs','xlsx.js','xlsx.mjs','types/index.d.ts']:
  assert tar.extractfile('package/'+name).read()==(root/name).read_bytes(),name
 for name in (root/'dist').iterdir():
  if name.suffix in ['.js','.mjs','.map']:assert tar.extractfile('package/dist/'+name.name).read()==name.read_bytes(),name.name
 assert 'package/bin/xlsx.njs' not in entries
 assert not any('/node_modules/' in n or '/controls/' in n or n.startswith('package/community/results/') for n in entries)
 for name in (root/'LICENSES').glob('*.txt'):assert tar.extractfile('package/LICENSES/'+name.name).read()==name.read_bytes(),name.name
 for name,m in entries.items():
  if m.isfile() and name.endswith(('.json','.md')):assert str(Path.home()).encode() not in tar.extractfile(m).read(),name
sha=hashlib.sha256(archive.read_bytes()).hexdigest()
if '--require-sha' in sys.argv:assert re.fullmatch('[a-f0-9]{64}',os.getenv('EXPECTED_ARCHIVE_SHA256','')),'Missing validated archive SHA-256'
if os.getenv('EXPECTED_ARCHIVE_SHA256'):assert sha==os.environ['EXPECTED_ARCHIVE_SHA256'],'Archive changed after validation'
result={'filename':archive.name,'sha256':sha,'bytes':archive.stat().st_size,'private':pkg['private'],'runtimeMatchesSource':True}
(root/'.release-artifacts/archive-verification.json').write_text(json.dumps(result,indent=2)+'\n')
if os.getenv('GITHUB_OUTPUT'):
 with open(os.environ['GITHUB_OUTPUT'],'a') as out:out.write('filename='+archive.name+'\nsha256='+sha+'\n')
print(json.dumps(result,indent=2))
