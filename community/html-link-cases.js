/* Independent inert regression inputs: no links are followed. */
(function(g){
var cases = [
 ['https://example.org/a?b=1&c=2',true],['http://example.org/',true],['HTTPS://example.org/',true],
 ['mailto:user@example.org',true],['report.xlsx',true],['../reports/a.html',true],['/reports/a:b',true],['?sheet=1',true],
 ['javascript:/*inert*/void(0)',false],['JaVaScRiPt:/*inert*/void(0)',false],[' javaScript:foo',false],
 ['java\tscript:foo',false],['java\nscript:foo',false],['\u0000javascript:foo',false],['data:text/html,inert',false],
 ['vbscript:inert',false],['file:///tmp/inert',false],['blob:https://example.org/id',false],
 ['//example.org/',false],['\\\\example.org',false],['/\\example.org',false],['custom:thing',false],
 ['javascript&#58;inert',true],['javascript%3Ainert',true],['https://example.org/"onclick="inert',true],
 ['https://example.org/space here',false],['#Sheet1!A1',false],['',false],[null,false],[42,false]
];
function check(X, parse) {
 var count=0;
 cases.forEach(function(c){[{}, {sanitizeLinks:true},{sanitizeLinks:false}].forEach(function(opts){
  var s=X.utils.aoa_to_sheet([['marker <text>']]);s.A1.l={Target:c[0]};
  var html=X.utils.sheet_to_html(s,opts),links;
  if(parse){var d=parse(html);links=d.querySelectorAll('a');if(d.querySelector('[onclick]'))throw Error('attribute injection');}
  else links=html.match(/<a href=/g)||[];
  if((links.length===1)!==c[1])throw Error('unexpected link for '+JSON.stringify(c[0]));
  if(html.indexOf('marker &lt;text&gt;')<0)throw Error('lost cell text');
  if(parse&&c[1]){var href=links[0].getAttribute('href');if(href!==c[0])throw Error('attribute not preserved');var protocol=links[0].protocol;if(!/^(https?:|mailto:)$/.test(protocol))throw Error('active browser protocol '+protocol);}
  ++count;
 });});return count;
}
g.htmlLinkRegression={cases:cases,check:check};
})(typeof module==='object'?module.exports:globalThis);
