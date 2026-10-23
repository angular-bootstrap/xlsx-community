module.exports=function(X,cp){const checks=[];const equal=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label+' differs');checks.push(label)};
 X.set_cptable(cp);
 const values=[['name','count'],['भारत',42],['café',3.5]],book=X.utils.book_new();X.utils.book_append_sheet(book,X.utils.aoa_to_sheet(values),'Data');
 for(const bookType of ['xlsx','xlsb','biff8','ods','csv','html','xlml']){const q=X.read(X.write(book,{bookType,type:'array'}),{type:'array'});equal(X.utils.sheet_to_json(q.Sheets[q.SheetNames[0]],{header:1}),values,bookType)}
 for(const [codepage,text] of [[620,'Ś╫êëτ⌡ś'],[895,'Š╫ěéτ⌡š ĺ'],[10008,'中文汉字']]){const bytes=new Uint8Array([118,97,108,117,101,10,...cp.utils.encode(codepage,text,'arr')]);const q=X.read(bytes,{type:'array',codepage});equal(q.Sheets[q.SheetNames[0]].A2.v,text,'array codepage '+codepage)}
 equal(cp.utils.decode(895,[141]),'ĺ','CP895 correction');const bad='Ǫ',encoded=cp.utils.encode(895,bad,'arr');if(cp.utils.decode(895,encoded)===bad)throw Error('CP895 unsupported character unexpectedly represented');checks.push('CP895 representability validation');
 for(const [target,allowed] of [['javascript:inert',false],['https://example.org/',true],['data:text/html,inert',false]]){const s=X.utils.aoa_to_sheet([['cell']]);s.A1.l={Target:target};equal(X.utils.sheet_to_html(s).includes('<a href='),allowed,'HTML link '+target.split(':')[0])}
 const s=X.utils.aoa_to_sheet([[new Date('2024-01-02T12:30:00Z'),42]],{UTC:true});s.C1={t:'n',v:43,f:'B1+1'};s['!ref']='A1:C1';const w=X.utils.book_new();X.utils.book_append_sheet(w,s,'Data');const q=X.read(X.write(w,{bookType:'xlsx',type:'array'}),{type:'array',cellDates:true});equal(q.Sheets.Data.A1.v.toISOString(),'2024-01-02T12:30:00.000Z','UTC date');equal(q.Sheets.Data.C1.f,'B1+1','formula');
 return {passed:true,version:X.version,checks};
};
