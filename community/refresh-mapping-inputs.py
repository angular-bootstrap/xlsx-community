"""Explicit network refresh. Build steps consume only the resulting hash-locked inputs."""
from pathlib import Path
import urllib.request,json,hashlib,concurrent.futures,datetime
root=Path(__file__).resolve().parent
rows=[x.split(',') for x in (root/'mapping-inputs/manifest.csv').read_text().splitlines()]
def fetch(row):
 cp,url,width=row
 if not url:return {'codepage':int(cp),'status':'removed-unverified','reason':'No public source URL in upstream manifest; no historical input-rights chain verified'}
 url=url.replace('http:','https:')
 with urllib.request.urlopen(url,timeout=40) as r:b=r.read(3000000)
 assert len(b)<3000000
 (root/'mapping-inputs'/('CP'+cp+'.TXT')).write_bytes(b)
 return {'codepage':int(cp),'url':url,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'status':'fresh-unicode-source','width':int(width),'license':'Unicode-3.0; preserve any source-specific notices'}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:entries=list(pool.map(fetch,rows))
for name,url in [('Unicode-3.0.txt','https://www.unicode.org/license.txt'),('unicode-terms.html','https://www.unicode.org/copyright.html'),('mapping-readme.txt','https://www.unicode.org/Public/MAPPINGS/ReadMe.txt')]:
 with urllib.request.urlopen(url,timeout=30) as r:b=r.read()
 (root/'mapping-inputs'/name).write_bytes(b)
report={'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'entries':entries,'terms':'https://www.unicode.org/copyright.html','policy':'Current Unicode terms identify Public computer data files as Unicode Data Files under Unicode License v3 unless otherwise indicated. Source-specific notices retained with raw inputs; no blanket historic rights claim.'}
(root/'mapping-inputs/lock.json').write_text(json.dumps(report,indent=2)+'\n')
print('Retrieved',sum(x['status']=='fresh-unicode-source' for x in entries),'inputs; removed', [x['codepage'] for x in entries if x['status']=='removed-unverified'])

# Reapply the independently pinned non-Unicode replacements after a network refresh.
import subprocess,sys
subprocess.run([sys.executable,str(root/"restore-mapping-inputs.py")],check=True)
