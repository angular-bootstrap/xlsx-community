"""Opt-in network restoration of pinned source snapshots, with SHA-256 verification.

No source code is executed. Ordinary builds use the existing snapshots offline.
"""
from pathlib import Path
import hashlib,json,urllib.request
folder=Path(__file__).resolve().parent/'mapping-inputs/restoration-sources'
for record in json.loads((folder/'sources.json').read_text()):
 url=record['repository'].replace('https://github.com/','https://raw.githubusercontent.com/')+'/'+record['commit']+'/'+record['sourceFile']
 with urllib.request.urlopen(url,timeout=30) as response:raw=response.read(3000001)
 assert len(raw)<=3000000 and hashlib.sha256(raw).hexdigest()==record['sha256'],record['file']
 (folder/record['file']).write_bytes(raw)
 print('Verified '+record['file'])
