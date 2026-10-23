"""Two clean, isolated reconstructions of the pinned upstream distribution.

Requires Node 24, GNU/BSD make, bash, sed, base64, unzip and pinned tools under
/tmp/sheetjs-repro-tools. No candidate runtime files are overwritten.
"""
import shutil
import sys
import hashlib
import json
import os
import pathlib
import posixpath
import subprocess
import tarfile
import tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'community/results'
TOOLS=pathlib.Path('/tmp/sheetjs-repro-tools')
NODE=pathlib.Path(os.environ.get('SHEETJS_NODE') or shutil.which('node') or 'node')
COMMIT='8a7cfd47bde8258c0d91df6a737bf0136699cdf8'
OUTPUTS=['dist/xlsx.core.min.js','dist/xlsx.full.min.js','dist/xlsx.mini.min.js',
         'dist/xlsx.core.min.map','dist/xlsx.full.min.map','dist/xlsx.mini.min.map',
         'dist/xlsx.extendscript.js','dist/xlsx.zahl.js','dist/xlsx.zahl.mjs','dist/cpexcel.js','dist/cpexcel.full.mjs','dist/shim.min.js']
sha=lambda b:hashlib.sha256(b).hexdigest()
versions={name:json.loads((TOOLS/'node_modules'/name/'package.json').read_text())['version']
          for name in ['@sheetjs/uglify-js','codepage','source-map']}
assert versions['@sheetjs/uglify-js']=='2.7.3' and versions['codepage']=='1.15.0'
env=os.environ.copy()
env['PATH']=str(NODE.parent)+':'+str(TOOLS/'node_modules/.bin')+':/usr/bin:/bin:/usr/sbin:/sbin'
env['NODE_OPTIONS']='--require='+str(ROOT/'community/legacy-sourcemap-fs.cjs')
patched='--patched' in sys.argv
runs=[]
with tempfile.TemporaryDirectory(prefix='sheetjs-repro-') as directory:
    directory=pathlib.Path(directory)
    archive=directory/'source.tar'
    subprocess.run(['git','archive','--format=tar','--output='+str(archive),COMMIT],cwd=ROOT,check=True)
    for run in [1,2]:
        dest=directory/str(run);dest.mkdir()
        with tarfile.open(archive) as tar:
            for entry in tar.getmembers():
                assert not entry.name.startswith('/') and '..' not in pathlib.PurePosixPath(entry.name).parts
                if entry.issym():
                    target=posixpath.normpath(posixpath.join(posixpath.dirname(entry.name),entry.linkname))
                    assert not entry.linkname.startswith('/') and not target.startswith('../')
                assert not entry.islnk()
            tar.extractall(dest)
        if patched:
            for name in ['bits/79_html.js','bits/40_harb.js','bits/42_sstxml.js','shim.js','Makefile','community/build-codepages.py','community/restore-mapping-inputs.py']:
                target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes((ROOT/name).read_bytes())
            for name in ['mapping-inputs','codepage-tools']:
                shutil.copytree(ROOT/'community'/name,dest/'community'/name)
        (dest/'node_modules').symlink_to(TOOLS/'node_modules',target_is_directory=True)
        # Removing outputs prevents copied Git artifacts being mistaken for builds.
        for name in OUTPUTS:
            (dest/name).unlink()
        log=[]
        commands=[['make','-C',str(dest/'modules'),'xlsx.zahl.js']]
        if patched:
            for name in ['xlsx.js','xlsx.flow.js','xlsx.mjs','xlsx.mini.js','xlsx.mini.flow.js']:
                (dest/name).unlink(missing_ok=True)
            commands.append(['make','-C',str(dest),'-o','bits/01_version.js','all'])
        commands.append(['make','-C',str(dest),'-o','bits/01_version.js','dist'])
        for command in commands:
            result=subprocess.run(command,env=env,capture_output=True,text=True,timeout=90)
            log.append(result.stdout+result.stderr)
            if result.returncode:
                (OUT/('reproduce-run-'+str(run)+'.log')).write_text('\n'.join(log))
                raise RuntimeError('Distribution build failed: '+str(result.returncode))
        (OUT/('reproduce-run-'+str(run)+'.log')).write_text('\n'.join(log))
        files=[]
        for name in OUTPUTS:
            built=(dest/name).read_bytes();original=(ROOT/name).read_bytes()
            files.append({'file':name,'bytes':len(built),'sha256':sha(built),
                          'candidateArtifactSha256':sha(original),'equalToCandidate':built==original})
        runs.append({'run':run,'exitCode':0,'allEqual':all(x['equalToCandidate'] for x in files),'files':files})
report={'sourceCommit':COMMIT,'node':subprocess.check_output([str(NODE),'--version'],text=True).strip(),
        'toolVersions':versions,'toolLockSha256':sha((TOOLS/'package-lock.json').read_bytes()),
        'adapterSha256':sha((ROOT/'community/legacy-sourcemap-fs.cjs').read_bytes()),
        'adaptations':['Build-only SourceMap-to-string compatibility preload for modern Node',
                       'Generate modules/xlsx.zahl.js from tracked modules/test.numbers before make dist'],
        'runs':runs,'runsIdentical':runs[0]['files']==runs[1]['files'],
        'notCovered':['Original historical runtime/toolchain attestation','Independent legal clearance of all repository components','Native legacy-browser/Adobe-host certification']}
report['patched']=patched
report['sourceOverlayHashes']={name:sha((ROOT/name).read_bytes()) for name in ['bits/79_html.js','bits/40_harb.js','bits/42_sstxml.js','shim.js','Makefile','community/build-codepages.py','community/mapping-inputs/lock.json']} if patched else None
(OUT/('reproducibility-patched.json' if patched else 'reproducibility.json')).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'runsIdentical':report['runsIdentical'],'runs':[{'run':r['run'],'allEqual':r['allEqual'],'files':len(r['files'])} for r in runs]},indent=2))
raise SystemExit(0 if report['runsIdentical'] and all(r['allEqual'] for r in runs) else 1)
