"""Offline build from current Unicode sources recorded by refresh-mapping-inputs.py."""
from pathlib import Path
import hashlib,json,subprocess,tempfile,os,sys
root=Path(__file__).resolve().parents[1];inputs=root/'community/mapping-inputs';tools=root/'community/codepage-tools'
subprocess.run([sys.executable,str(root/'community/restore-mapping-inputs.py'),'--check'],check=True)
lock=json.loads((inputs/'lock.json').read_text());chunks=[];node=os.environ.get('SHEETJS_BUILD_NODE','node')
with tempfile.TemporaryDirectory(prefix='sheetjs-mappings-') as folder:
 folder=Path(folder);(folder/'codepages').mkdir()
 for e in lock['entries']:
  if e['status'] not in ['fresh-unicode-source','verified-derived-source']:continue
  cp=e['codepage'];raw=(inputs/('CP'+str(cp)+'.TXT')).read_bytes();assert hashlib.sha256(raw).hexdigest()==e['sha256']
  rows=[]
  for line in raw.decode('utf8').splitlines():
   fields=line.split('#',1)[0].split()
   if len(fields)==2:
    a,b=map(lambda x:int(x,16),fields)
    assert 0<=a<=65535 and 0<=b<=65535
    rows.append(hex(a)+'\t'+hex(b))
  assert rows
  (folder/'codepages'/(str(cp)+'.TBL')).write_text('\n'.join(rows)+'\n')
  chunks.append(subprocess.check_output([node,str(tools/'make.njs'),str(cp),'cptable'],cwd=folder).decode())
header='/*! Independent fork: regenerated Unicode mapping data; see MAPPING_DATA_NOTICES.md and LICENSES/Unicode-3.0.txt. */\n'
cjs=header+'var cptable = {version:"1.15.0-community-unicode"};\n'+''.join(chunks)+'\nif(typeof module !== "undefined" && module.exports && typeof DO_NOT_EXPORT_CODEPAGE === "undefined") module.exports = cptable;\n'+(tools/'cputils.js').read_text().replace("require('./cptable')",'cptable')
esm=header+'export const version = "1.15.0-community-unicode";\nconst cptable = {};\n'+''.join(chunks)+'\nexport { cptable };\n'+(tools/'cputils.mjs').read_text()
(root/'dist/cpexcel.js').write_text(cjs);(root/'dist/cpexcel.full.mjs').write_text(esm)
print('Built 32 codepage tables from hash-locked licensed inputs')
