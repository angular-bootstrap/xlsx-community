"""Offline derivation of three restored tables from pinned, licensed source snapshots.

Run after explicit upstream source refresh/review. Never reads old SheetJS tables.
"""
from pathlib import Path
import json,re,hashlib,sys
root=Path(__file__).resolve().parent;inputs=root/'mapping-inputs';src=inputs/'restoration-sources'
check='--check' in sys.argv
records=json.loads((src/'sources.json').read_text())
for record in records:assert hashlib.sha256((src/record['file']).read_bytes()).hexdigest()==record['sha256']
def parse_txt(name):
 out={}
 for line in (inputs/name).read_text().splitlines():
  f=line.split('#',1)[0].split()
  if len(f)==2:out[int(f[0],16)]=int(f[1],16)
 return out
base=parse_txt('CP437.TXT')
s=(src/'mazovia-MazoviaCharset.java').read_text()
patch={int(b):int(a,16) for a,b in re.findall(r"\{'\\u([0-9a-fA-F]+)',\s*(\d+)\}",s)}
assert len(patch)==18
mazovia={**base,**patch} # README explicitly describes CP437 with Polish substitutions.
s=(src/'kamenicky-CharMapping.cs').read_text(encoding='utf-8-sig').split('new char[256]',1)[1].split('};',1)[0];s=re.sub(r'//[^\n]*','',s)
tokens=re.findall(r"'((?:\\.|[^'\\])*)'",s)
def decode(x):
 if not x.startswith('\\'):return ord(x)
 if x.startswith(('\\u','\\x')):return int(x[2:],16)
 return {'\\0':0,'\\a':7,'\\b':8,'\\t':9,'\\n':10,'\\v':11,'\\f':12,'\\r':13,"\\'":39,'\\\\':92}[x]
chars=[decode(x) for x in tokens];assert len(chars)==256
# Source labels 176-255 CP437: regenerate that range from the licensed Unicode base,
# correcting the implementation's U+258B typo at DD to the stated CP437 U+258C.
kamenicky={**base,**{i:chars[i] for i in range(128,176)}}
s=(src/'icu-windows-10008-2000.ucm').read_text();chinese={};excluded=[]
for a,bs,flag in re.findall(r'<U([0-9A-Fa-f]+)>\s+((?:\\x[0-9A-Fa-f]{2})+)\s+\|([0-3])',s):
 code=int(''.join(re.findall(r'\\x([0-9A-Fa-f]{2})',bs)),16)
 if flag!='0':excluded.append({'code':code,'unicode':int(a,16),'flag':int(flag)});continue
 assert code not in chinese
 chinese[code]=int(a,16)
assert len(chinese)==7613
lock=json.loads((inputs/'lock.json').read_text())
licenses={620:'Apache-2.0 AND Unicode-3.0',895:'MIT AND Unicode-3.0',10008:'Unicode-3.0'}
for cp,mapping in [(620,mazovia),(895,kamenicky),(10008,chinese)]:
 text='# Independent derived table; see restoration-sources/sources.json and MAPPING_DATA_NOTICES.md\n'+''.join(hex(a)+'\t'+hex(b)+'\n' for a,b in sorted(mapping.items()))
 raw=text.encode();name='CP'+str(cp)+'.TXT'
 if check:assert (inputs/name).read_bytes()==raw
 else:(inputs/name).write_bytes(raw)
 entry=next(e for e in lock['entries'] if e['codepage']==cp);entry.clear();entry.update(codepage=cp,status='verified-derived-source',file=name,sha256=hashlib.sha256(raw).hexdigest(),bytes=len(raw),license=licenses[cp],derivation='community/restore-mapping-inputs.py',sources=[r for r in records if r['file'].startswith({620:'mazovia-',895:'kamenicky-',10008:'icu-'}[cp])])
lock['restoration']={'codepages':[620,895,10008],'cp895Policy':'CP437 baseline plus Czech substitutions 128-175 from pinned MIT implementation; correct its DD block-glyph typo to CP437; 8D uses U+013A, differs from old SheetJS U+01EA','cp10008Policy':'Only ICU |0 roundtrip rows; exclude fallback/substitution rows','excludedUcmRows':excluded}
serialized=json.dumps(lock,indent=2)+'\n'
if check:assert (inputs/'lock.json').read_text()==serialized
else:(inputs/'lock.json').write_text(serialized)
print('Restored 620/895/10008 from independently verified source snapshots')
