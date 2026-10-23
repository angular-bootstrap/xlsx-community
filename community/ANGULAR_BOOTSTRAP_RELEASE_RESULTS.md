# angular-bootstrap local release review

Planned identity: `@angular-bootstrap/xlsx@0.1.0-rc.1`, repository `angular-bootstrap/xlsx-community`, prerelease tag `next`. The public repository is created; the npm package remains unpublished. Publishing is disabled in both local manifests and by rejecting prepublish hooks. The publication workflow is an inert template outside active workflows.

## Executed checks against the final rich-text/CRLF build

| Check | Result |
|---|---|
| macOS ARM64, Node 24.22.1, full upstream CJS | 37,313 passed, one inherited pending CSV-date test, zero failures |
| macOS ARM64, Node 24.22.1, full upstream ESM | 37,313 passed, one inherited pending CSV-date test, zero failures |
| Linux ARM64, Node 24.22.1, full CJS + ESM | Each: 37,313 passed, one pending, zero failures. Runtime hashes recorded. |
| Linux x64 consumer | 17 checks passed under emulation; native hardware coverage remains pending. |
| Rich-text HTML | 32 groups passed: four upstream baseline controls plus four cases in each of seven candidate builds. Escapes decoded text, restricts formatting tags and numeric font size; preserves valid formatting and CRLF comments. Node 22/26 patch-specific checks also passed. |
| HTML hyperlinks | 630 assertions passed across seven builds |
| Restored encodings | 79 roundtrip/CSV groups passed; CP895 byte 8D compatibility change remains documented |
| Minified reproducibility | Two clean builds reproduced all 12 outputs byte for byte |
| Angular / React-Vite / Next.js | Three production builds passed; nine framework/browser executions passed in Chrome, Firefox and WebKit. Next SSR and workbook API passed; React upload/download passed in all three browsers. Vite reports a bundle-size warning. |
| Date handling | 175 explicit-UTC checks passed; 40 of 50 default local-wall-time cases failed outside UTC. This remains a support/compatibility limitation. |
| Resource boundaries | Unbounded conversion of a maximal declared worksheet range exceeded the enforced two-second budget; a bounded conversion completed. Application-side limits are required. |
| Prepared CI tool lock | Clean scripts-disabled install passed with no local path links. Legacy upstream test-tool dependency deprecations remain development maintenance work. |

See `public-evidence/current-candidate.json` for current runtime hashes and compact results. The earlier full Node 22/24/26 matrix and four-bundler matrix predate the rich-text change; they are historical compatibility evidence, not proof that those entire matrices were rerun on final bytes. Initial rich-text CRLF failure and an incomplete browser-installation failure were corrected and rerun; do not count those historical attempts as final successes.

## Remaining gates

1. Native Windows x64, Linux x64 and macOS Intel execution is complete. All nine jobs passed. Each full CJS and ESM suite passed 37,313 tests, with one inherited pending test and zero failures. Each job passed 29 security/compatibility groups and 32 rich-text groups. Native-tested runtime hashes match the candidate. Linux x64 local consumer checks use emulation and do not establish native hardware coverage.
2. Restore npm authentication and verify angular-bootstrap scope access. Existing authentication returned 401; GitHub identity does not establish npm ownership. The repository and private reporting channel are created. Configure reviewed protections and the trusted publisher before any npm release.
3. Review the rich-text patch independently and decide upstream disclosure before public security claims. Existing CVE regression controls and this focused review do not establish an exhaustive security audit or guarantee absence of vulnerabilities.
4. Inherited date/resource behavior matches the official CDN and is excluded from this fixing scope. Preserve the tested UTC/serial/string guidance and disclosure. Retain resource-limit guidance for untrusted files.
5. Review the final scoped archive and its notices, then make a separate publication decision. No release credential or publish command is enabled.

The local candidate is prepared for technical review. It is not approved for publication. Full setup and sequencing are in `RELEASE_PLAN.md`.

Native evidence: [successful matrix](https://github.com/angular-bootstrap/xlsx-community/actions/runs/40009099484), tested runtime commit `10c3254b9c3bea7f42ca49ed50f13e8adba4651e`, compact records in `public-evidence/native-ci-results.json`. First-run failures and their CI-only corrections are retained in `public-evidence/native-ci-initial-findings.json`.
