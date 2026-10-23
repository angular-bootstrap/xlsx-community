from pathlib import Path
import urllib.request,hashlib,zipfile,tempfile,shutil
root=Path(__file__).resolve().parents[2];digest='a786d4f1a80adf9447997b6f3b30b2593c776c27e0b075e3971627c17205f220'
with tempfile.TemporaryDirectory(prefix='xlsx-corpus-') as folder:
 archive=Path(folder)/'test_files.zip';h=hashlib.sha256();total=0
 with urllib.request.urlopen('https://test-files.sheetjs.com/test_files.zip',timeout=60) as response,archive.open('wb') as out:
  while True:
   data=response.read(1048576)
   if not data:break
   total+=len(data);assert total<=350000000;h.update(data);out.write(data)
 assert h.hexdigest()==digest
 with zipfile.ZipFile(archive) as zip:
  assert sum(x.file_size for x in zip.infolist())<2100000000
  for e in zip.infolist():
   assert not e.filename.startswith(('/', '\\')) and '..' not in Path(e.filename).parts and ((e.external_attr>>16)&0o170000)!=0o120000
  zip.extractall(root)
print('Verified fixture corpus extracted')
