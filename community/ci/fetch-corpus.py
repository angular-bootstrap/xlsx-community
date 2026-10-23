"""Fetch the pinned corpus; a bad download is never extracted or accepted."""
from pathlib import Path
import urllib.request,hashlib,zipfile,tempfile,json,time
ROOT=Path(__file__).resolve().parents[2]
URL='https://test-files.sheetjs.com/test_files.zip'
DIGEST='a786d4f1a80adf9447997b6f3b30b2593c776c27e0b075e3971627c17205f220'
SIZE=341452051

def download_verified(destination,url=URL,digest=DIGEST,size=SIZE):
 attempts=[]
 for attempt in range(1,3):
  h=hashlib.sha256();total=0
  try:
   request=urllib.request.Request(url,headers={'User-Agent':'xlsx-community-corpus-verifier/1.0'})
   with urllib.request.urlopen(request,timeout=120) as response,destination.open('wb') as out:
    while True:
     data=response.read(1048576)
     if not data:break
     total+=len(data)
     if total>size:raise ValueError('Corpus exceeded pinned byte size')
     h.update(data);out.write(data)
   valid=total==size and h.hexdigest()==digest
   attempts.append({'attempt':attempt,'bytes':total,'sha256':h.hexdigest(),'verified':valid})
   if valid:return attempts
  except (OSError,ValueError) as error:
   attempts.append({'attempt':attempt,'bytes':total,'sha256':h.hexdigest(),'verified':False,'errorType':type(error).__name__})
  destination.unlink(missing_ok=True)
  if attempt==1:time.sleep(1)
 raise ValueError('No corpus download matched pinned size/SHA-256: '+json.dumps(attempts))

def main():
 results=ROOT/'community/results';results.mkdir(parents=True,exist_ok=True)
 report={'url':URL,'expectedBytes':SIZE,'expectedSha256':DIGEST,'verified':False}
 try:
  with tempfile.TemporaryDirectory(prefix='xlsx-corpus-') as folder:
   archive=Path(folder)/'test_files.zip';report['attempts']=download_verified(archive);report['verified']=True
   with zipfile.ZipFile(archive) as zip:
    assert sum(x.file_size for x in zip.infolist())<2100000000
    for e in zip.infolist():
     assert not e.filename.startswith(('/', '\\')) and '..' not in Path(e.filename).parts and ((e.external_attr>>16)&0o170000)!=0o120000
    zip.extractall(ROOT)
  print('Verified fixture corpus extracted')
 except Exception as error:
  report['error']=str(error);raise
 finally:
  (results/'ci-corpus-fetch.json').write_text(json.dumps(report,indent=2)+'\n')

if __name__=='__main__':main()
