// Original independent helper. Uses the cloned upstream Git history; no network.
const fs=require('fs'),path=require('path'),cp=require('child_process');
process.chdir(path.resolve(__dirname,'..'));
const pins={'v0.19.2':'0577bb7a4552946116e7b10e77cd9f35792780e6','v0.20.1':'29d46c07a895bdfd948d15b5115529ae697ccb48'};
for(const tag of Object.keys(pins)) for(const file of ['xlsx.js','dist/cpexcel.js']) {
  const target=path.join('community/controls',tag,file);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,cp.execFileSync('git',['show',pins[tag]+':'+file],{maxBuffer:8*1024*1024}));
}
console.log('Affected-version controls prepared from local upstream history.');
