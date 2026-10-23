"""Opt-in public metadata/license collection. No package code is executed."""
import base64
import datetime
import hashlib
import io
import json
import pathlib
import tarfile
import urllib.request
import urllib.error

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'community/results/component-licenses'
OUT.mkdir(exist_ok=True)
def fetch(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        data=r.read(15*1024*1024+1)
    if len(data)>15*1024*1024: raise ValueError('Download limit exceeded')
    return data

results=[]
for name,version in [('cfb','1.2.2'),('crc-32','1.2.0'),('ssf','0.11.3'),('codepage','1.15.0')]:
    url='https://registry.npmjs.org/'+name+'/'+version
    try:
        meta=json.loads(fetch(url))
    except urllib.error.HTTPError as error:
        if error.code != 404: raise
        results.append({'name':name,'version':version,'metadataSource':url,'status':'version not published in registry','mappingCaveat':'Embedded/source version must be reviewed from the upstream repository, not a nonexistent npm artifact'})
        continue
    blob=fetch(meta['dist']['tarball'])
    expected=meta['dist'].get('integrity')
    observed='sha512-'+base64.b64encode(hashlib.sha512(blob).digest()).decode()
    if expected and expected.startswith('sha512-') and expected!=observed: raise ValueError('Integrity mismatch')
    licenses=[]
    with tarfile.open(fileobj=io.BytesIO(blob),mode='r:gz') as tar:
        for entry in tar.getmembers():
            if entry.isfile() and pathlib.PurePosixPath(entry.name).name.upper() in ['LICENSE','LICENSE.TXT','LICENSE.MD','NOTICE','NOTICE.TXT']:
                if entry.size>256*1024: raise ValueError('License file limit exceeded')
                raw=tar.extractfile(entry).read()
                filename=name+'-'+version+'-'+entry.name.replace('/','_')
                (OUT/filename).write_bytes(raw)
                licenses.append({'path':entry.name,'savedAs':filename,'sha256':hashlib.sha256(raw).hexdigest()})
    results.append({'name':name,'version':version,'metadataSource':url,'declaredLicense':meta.get('license'),'tarball':meta['dist']['tarball'],'sha256':hashlib.sha256(blob).hexdigest(),'integrityVerified':bool(expected and expected.startswith('sha512-')),'licenses':licenses,'mappingCaveat':'Package-family/version evidence only; embedded upstream adaptations are not assumed identical to the standalone npm package'})
(OUT/'index.json').write_text(json.dumps({'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'components':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
