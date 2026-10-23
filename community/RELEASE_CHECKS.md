**Latest review:** NODE_BUNDLER_RESULTS.md records the current Node and bundler matrix, export-map fix and remaining publication gates. CP895 migration guidance is in CP895_COMPATIBILITY.md.

**Current results:** RESTORED_CODEPAGE_RESULTS.md supersedes the omission-related CP620 failure described below; all three legacy codepages have licensed replacements.

# Expanded release checks — October 23, 2026

**Current status:** see PROVENANCE_REPLACEMENT_RESULTS.md. The later data replacement omits 620/895/10008; both full suites now retain one failing CP620 DBF case. Earlier pass counts below are historical baseline results. Publication remains blocked.

**Engineering review: ready. Public release: still blocked by the remaining gates below.** The initial checks used unchanged parser code. The subsequent HTML-output modification and reruns are documented in HTML_FIX_RESULTS.md. Publishing remains disabled. Machine-readable summary: `results/release-gates.json`.

## Completed results

| Gate | Result |
|---|---|
| Full unchanged upstream CommonJS `test.js` | 37,313 passed, 1 pending, 0 failed; 121.4 seconds |
| Full unchanged upstream ESM `test.mjs` | 37,313 passed, 1 pending, 0 failed; 125.6 seconds |
| Upstream TypeScript fixture project | Passed TS 5.6.3, legacy Node 8 declarations and commander 2.20.3; no skipLibCheck |
| Strict CJS/ESM consumer samples | Passed TS 5.9.3, NodeNext resolution, strict checking, no skipLibCheck; invalid option modes rejected using expect-error assertions |
| Real Chrome 155.0.8059.85 | 19 passed, 0 failed, 1 not applicable |
| Real Firefox 142.0.1 | 19 passed, 0 failed, 1 not applicable |
| Real Playwright WebKit 26.0 | 19 passed, 0 failed, 1 not applicable |

The single pending case in each upstream run is the same upstream-skipped test: **“corner cases should parse CSV date values with preceding space.”** It is not counted as passed and was not enabled or silently removed. Neither suite used a test filter. These runs execute the full upstream default test entry files; they do not claim that npm's pretest lint or every optional repository target was run. The 12,415-entry official corpus expands to about 1.8 GiB; its source and SHA-256 are recorded in `results/fixture-corpus.json`. Fixtures are not bundled in the candidate package.

Browser checks use isolated headless browser processes, not a VM or jsdom. Each engine loads full, core, mini and ESM variants over a loopback-only server. Coverage: supported format roundtrips, Unicode/numeric cells, formulas, comments, hyperlinks, merges, explicit UTC date behavior, real DOM table import, and security regressions in disposable workers with a 5-second deadline. Mini runs XLSX/CSV roundtrips and omits the unsupported HTML/ReDoS path (one not-applicable result per engine). Core/ESM receive codepage injection. The ESM security-worker gap from the initial report is now covered in all three real engines. Worker tests exercise candidate behavior; affected-version controls remain in the separate Node regression harness.

WebKit here is Playwright's engine build, not a claim about every shipping Safari version. This is a macOS ARM64, headless, version-specific browser matrix. It is not every browser's full upstream fixture suite, mobile coverage or cross-OS certification.

## Failures encountered and resolved

1. ESM suite initially could not resolve jsdom through NODE_PATH (ESM does not use that CommonJS lookup). A local node_modules symlink to the temporary test tools resolved it; neither source nor package dependencies changed.
2. Initial TypeScript run lacked upstream dev-only Node/commander declarations. TypeScript 5.9 with Node 8 declarations then failed inside NodeBuffer; modern Node declarations conflicted with commander's legacy EventEmitter type. The complete upstream project passes with TS 5.6.3 and its legacy declarations. Independent strict TS 5.9 consumer samples pass without those CLI-only dependencies. The legacy CLI tooling remains a modernization task; no declaration errors were suppressed.
3. Follow-up npm installs initially used saved caret ranges and changed the Playwright version. The entire temporary toolchain was then pinned with save-exact; actual versions are recorded. Initial browser attempts with mismatched/incomplete engines failed to launch. These are setup failures, not candidate security passes.
4. The Playwright archive extractor stalled after downloading Firefox. Stalled processes were stopped; official Firefox/WebKit archives were downloaded directly, validated for unsafe paths/symlink escapes and extracted using macOS ditto. The final matching Playwright 1.56.1 engines launched successfully. No security warnings or host validation were bypassed. Archive hashes are recorded.

Initial diagnostics remain in the results logs. Browser screenshots and detailed per-variant results are retained locally. The runtime candidate contains no test tools, browser binaries, vulnerable controls or corpus files.

## Remaining blockers before public publication

- Ten distribution outputs now reproduce byte for byte in two fresh builds. Standalone ESM codepage generation and original external mapping inputs remain unverified. See MINIFIED_LICENSE_SECURITY_REVIEW.md.
- The active HTML hyperlink scheme finding is fixed in this local candidate (see HTML_FIX_RESULTS.md). Resolve compatibility-shim and mapping-data provenance gaps, and advisory/pedigree mapping documented in MINIFIED_LICENSE_SECURITY_REVIEW.md. The component inventory and retained notices are review evidence, not complete legal/security clearance.
- Define and verify the supported Node/platform matrix. Both full suites currently cover Node 24.16.0 on macOS ARM64; the inherited Node >=0.8 engine claim is not validated.
- Framework/bundler consumer builds, real-browser file-picker/download integration, stream cases and a timezone/DST matrix remain outside these targeted checks.
- Resolve or explicitly document the upstream pending CSV-date case and the default local-time migration caveat. Explicit UTC behavior passed; no default-timezone correction is claimed.
- Select independent package identity/repository, maintainers, reporting channel, version/build policy and protected publishing/provenance workflow. Upstream contribution restrictions must be addressed separately before proposing upstream code.

## Reproduce

Tools are installed outside the fork under `/tmp/sheetjs-release-check-tools` with lifecycle scripts disabled: mocha 10.8.2, jsdom 26.1.0, playwright 1.56.1, typescript 5.6.3, @types/node 8.10.66, commander 2.20.3. The strict consumer compiler is separately pinned to typescript 5.9.3 under `/tmp/sheetjs-modern-typecheck`. A temporary node_modules symlink points to the former; it is not a runtime dependency or part of the package.

From the checkout, using Node 24.16.0:

```sh
node /tmp/sheetjs-release-check-tools/node_modules/mocha/bin/mocha.js test.js --reporter json --reporter-option output=community/results/upstream-cjs.json --timeout 30000
node /tmp/sheetjs-release-check-tools/node_modules/mocha/bin/mocha.js test.mjs --reporter json --reporter-option output=community/results/upstream-esm.json --timeout 30000
node community/run-types.cjs
PLAYWRIGHT_BROWSERS_PATH=/tmp/sheetjs-browser-manual node community/run-browsers.cjs
```

Both full runs used a 4 GiB V8 heap ceiling. The browser script can use the normal Playwright browser cache instead if engines are installed there; Chrome uses the locally installed Chrome channel. Temporary tools/engines must be restored if the OS cleans /tmp. Their install lockfile is retained locally as `results/test-tools-lock.json` for exact dependency restoration; inspect test-tool security separately from runtime dependencies.
