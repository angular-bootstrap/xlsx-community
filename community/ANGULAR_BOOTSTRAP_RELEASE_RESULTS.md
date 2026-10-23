# angular-bootstrap local release review

Published identity: `@angular-bootstrap/xlsx@0.1.0-rc.1`, repository `angular-bootstrap/xlsx-community`. Publication was approved conditional on passing checks. All nine final native jobs and the complete release-validation job passed before the exact reviewed archive was published. Registry bytes, fresh public installation, CommonJS/ESM roundtrips and the documented npm alias were verified afterward. npm assigned both `next` and `latest`; removing automatic `latest` was rejected with E400. This remains a prerelease.

Source commit: `2c7f08a670174f81a9a67b0d83e0bfd9039436c7`. Archive SHA-256: `81ae0350faf7423fec571e474818464ba47550f43d5649b3d57f8fb3fde1916f`. See `public-evidence/published-release.json`.

## Executed checks against the final rich-text/CRLF build

| Check | Result |
|---|---|
| macOS ARM64, Node 24.22.1, full upstream CJS | 37,313 passed, one inherited pending CSV-date test, zero failures |
| macOS ARM64, Node 24.22.1, full upstream ESM | 37,313 passed, one inherited pending CSV-date test, zero failures |
| Linux ARM64, Node 24.22.1, full CJS + ESM | Each: 37,313 passed, one pending, zero failures. Runtime hashes recorded. |
| Linux x64 consumer | 17 checks passed under emulation; full suites also passed on native GitHub-hosted Linux x64. |
| Rich-text HTML | 32 groups passed: four upstream baseline controls plus four cases in each of seven candidate builds. Escapes decoded text, restricts formatting tags and numeric font size; preserves valid formatting and CRLF comments. Node 22/26 patch-specific checks also passed. |
| HTML hyperlinks | 630 assertions passed across seven builds |
| Restored encodings | 79 roundtrip/CSV groups passed; CP895 byte 8D compatibility change remains documented |
| Minified reproducibility | Two clean builds reproduced all 12 outputs byte for byte |
| Angular / React-Vite / Next.js | Three production builds passed; nine framework/browser executions passed in Chrome, Firefox and WebKit. Next SSR and workbook API passed; React upload/download passed in all three browsers. Vite reports a bundle-size warning. |
| Date handling | 175 explicit-UTC checks passed; 40 of 50 default local-wall-time cases failed outside UTC. This remains a support/compatibility limitation. |
| Resource boundaries | Unbounded conversion of a maximal declared worksheet range exceeded the enforced two-second budget; a bounded conversion completed. Application-side limits are required. |
| Prepared CI tool lock | Clean scripts-disabled install passed with no local path links. Legacy upstream test-tool dependency deprecations remain development maintenance work. |

See `public-evidence/current-candidate.json` for current runtime hashes and compact results. The earlier full Node 22/24/26 matrix and four-bundler matrix predate the rich-text change; they are historical compatibility evidence, not proof that those entire matrices were rerun on final bytes. Initial rich-text CRLF failure and an incomplete browser-installation failure were corrected and rerun; do not count those historical attempts as final successes.

## Results and follow-up

1. Final native matrix: all nine Linux x64, Windows x64 and macOS Intel jobs passed on Node 22.23.4, 24.22.1 and 26.12.1. CJS and ESM each passed 37,313 tests per job, with one inherited pending test and zero failures. Security/compatibility groups passed: 28–29 per job because the adaptive affected-version ReDoS control stops after observing a timeout. The mandatory positive control passed in every job, and every candidate input size completed. All 32 rich-text groups and explicit-UTC checks passed in every job.
2. Complete release validation passed: metadata/native-evidence guards, pinned fixtures, full suites/security regressions, two reproducible builds of 12 outputs, archive inspection and artifact upload.
3. npm identity and organization owner access were verified. The exact validated archive was published through authenticated bootstrap, without a GitHub OIDC provenance attestation. The trusted publisher is now configured; its first OIDC publish remains unverified and subject to npm's two-day activation limit.
4. Inherited date/resource behavior matches the official CDN and remains outside the approved fixing scope. Preserve UTC/serial/string guidance and application-side resource limits. An independent security audit remains useful follow-up; regression tests do not prove absence of all vulnerabilities.
5. Registry checksum, fresh public install, CJS/ESM roundtrips and npm alias passed. The automatic `latest` tag could not be removed (E400); both tags and prerelease status are disclosed.

Native evidence: [final successful matrix](https://github.com/angular-bootstrap/xlsx-community/actions/runs/40015756667). [Successful release validation](https://github.com/angular-bootstrap/xlsx-community/actions/runs/40015756744). Compact records are in `public-evidence/native-ci-results.json` and `public-evidence/published-release.json`. Historical initial failures and their corrections remain in Git history and `public-evidence/native-ci-initial-findings.json` / `release-workflow-checks.json`.
