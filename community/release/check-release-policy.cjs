// Exercise actual release guards; never publish or modify the manifest.
const assert=require('node:assert/strict');
const {verify}=require('./verify-release.cjs');
const pkg=require('../../package.json');
const env={GITHUB_REPOSITORY:'angular-bootstrap/xlsx-community',GITHUB_REF_TYPE:'tag',GITHUB_REF_NAME:'v'+pkg.version,GITHUB_EVENT_NAME:'push'};
const valid=verify({publish:true,env});
assert.equal(valid.distTag,pkg.version.includes('-')?'next':'latest');
for(const [label,changes] of [
 ['wrong source repository',{GITHUB_REPOSITORY:'other/repo'}],
 ['mismatched version tag',{GITHUB_REF_NAME:'v999.0.0'}],
 ['manual publish',{GITHUB_EVENT_NAME:'workflow_dispatch'}],
 ['branch publish',{GITHUB_REF_TYPE:'branch'}],
 ['npm token',{NPM_TOKEN:'inert-test-value'}],
 ['node auth token',{NODE_AUTH_TOKEN:'inert-test-value'}]
]) assert.throws(()=>verify({publish:true,env:{...env,...changes}}),undefined,label);
console.log('Release policy: valid tag accepted; six unsafe publication contexts rejected. Channel: '+valid.distTag);
