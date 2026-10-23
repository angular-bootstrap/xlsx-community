const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{let shimAssertions=0;
for(const name of ['shim.js','dist/shim.min.js'])for(const legacy of [false,true]){
 const context=vm.createContext({window:{}});
 vm.runInContext('Object.keys=undefined;'+(legacy?'Object.prototype.propertyIsEnumerable=function(){return false};':''),context);
 vm.runInContext(fs.readFileSync(name,'utf8'),context);
 vm.runInContext(`var inherited={parent:1};function K(){};K.prototype=inherited;var obj=new K();obj.own=2;obj.toString=3;var names=Object.keys(obj);if(names.length!==2||names.indexOf('own')<0||names.indexOf('toString')<0)throw Error('keys');var thrown=false;try{Object.keys(null)}catch(e){thrown=true}if(!thrown)throw Error('null');var e={currentStyle:{backgroundColor:'red',styleFloat:'left',msTransform:'none',width:0}};var x=window.getComputedStyle(e);if(x.getPropertyValue('background-color')!=='red'||x.getPropertyValue('float')!=='left'||x.getPropertyValue('-ms-transform')!=='none'||x.getPropertyValue('width')!=='0'||x.getPropertyValue('missing')!=='')throw Error('style');var y=window.getComputedStyle({currentStyle:{backgroundColor:'blue'}});if(x===y||x.getPropertyValue('background-color')!=='red')throw Error('shared state');e.currentStyle.backgroundColor='green';if(x.getPropertyValue('background-color')!=='green')throw Error('live');if(window.el!==undefined||window.getPropertyValue!==undefined)throw Error('window mutated');`,context);shimAssertions+=10;
 const native=vm.createContext({window:{getComputedStyle:function(){return 123}}});vm.runInContext('var originalKeys=Object.keys;',native);vm.runInContext(fs.readFileSync(name,'utf8'),native);assert(vm.runInContext('Object.keys===originalKeys&&window.getComputedStyle()===123',native));shimAssertions++;
}
const cjs=require('../dist/cpexcel.js'),esm=await import(pathToFileURL(path.resolve('dist/cpexcel.full.mjs')));
const lock=JSON.parse(fs.readFileSync('community/mapping-inputs/lock.json'));let decodeChecks=0,encodeChecks=0;
for(const X of [cjs,esm])for(const entry of lock.entries){const cp=entry.codepage;if(entry.status==='removed-unverified'){assert(!X[cp]&&!X.cptable?.[cp]);assert.throws(()=>X.utils.decode(cp,[0x41]));continue}
 const expected=new Map(),encode=new Map();for(const line of fs.readFileSync('community/mapping-inputs/CP'+cp+'.TXT','utf8').split('\n')){const fields=line.split('#')[0].trim().split(/\s+/);if(fields.length!==2)continue;const [code,unicode]=fields.map(x=>parseInt(x,16));expected.set(code,unicode);encode.set(String.fromCharCode(unicode),code)}
 const table=X.cptable?X.cptable[cp]:X[cp];for(const [code,unicode] of expected){assert.equal(table.dec[code],String.fromCharCode(unicode));decodeChecks++;}for(const [char,code] of encode){assert.equal(table.enc[char],code);encodeChecks++}
}
const result={shimAssertions,mappingDecodeChecks:decodeChecks,mappingEncodeChecks:encodeChecks,restored:[620,895,10008],failures:0};fs.writeFileSync('community/results/provenance-replacements.json',JSON.stringify(result,null,2)+'\n');console.log(result);
})().catch(e=>{console.error(e);process.exitCode=1});
