# Local candidate verification results

October 23, 2026. **Ready for local engineering review; not ready for public publication.**

Update: the full upstream CJS/ESM suites, TypeScript fixtures/strict consumers and real Chrome/Firefox/WebKit checks have since completed. See `RELEASE_CHECKS.md` and `results/release-gates.json`; the initial-scope gaps below are retained as historical context and superseded by that report where completed.

Official baseline v0.20.3 at `8a7cfd47bde8258c0d91df6a737bf0136699cdf8`, branch `ui/community-release-candidate`. Package version: `0.20.3-community.0`; unchanged parser runtime: `0.20.3`. Node v24.16.0: **24 passing check groups, zero final failures**. Counts include affected-version controls and do not mean 24 security fixes.

## Security regressions

| Check | Affected control | Candidate |
|---|---|---|
| CVE-2023-30533, crafted XLSX comment address | 0.19.2 adds own property `c` to Object.prototype | CJS and full/core/mini builds do not mutate it |
| CVE-2024-22363, HTML internal whitespace growth | 0.20.1 takes about 320 ms at 10,000 spaces; terminated at 2.5 seconds at 30,000 | CJS and full/core complete 10,000/30,000/60,000 cases in milliseconds |

Prototype test follows the comment-address guard in `bits/56_cmntcommon.js` (commit `dca90c8`, before 0.19.3). HTML test exercises whitespace regex changes in `bits/22_xmlutils.js` (release commit `a0bed2a`, 0.20.2). Fixtures are generated independently from the source differences. Both tests use public parser APIs and affected controls; neither exhausts every manifestation of the advisory. Mini omits HTML parsing: its HTML case is untested, not passed. Separate ESM security regressions have not been run.

Primary sources: https://cdn.sheetjs.com/advisories/CVE-2023-30533 and https://cdn.sheetjs.com/advisories/CVE-2024-22363.

## Compatibility passed

- CJS, ESM, full and core: Unicode/numeric roundtrips through XLSX, XLSB, BIFF8/XLS, ODS, CSV, HTML and SpreadsheetML/XML. Codepage/filesystem dependencies are injected where needed.
- Those four variants: formulas, comments, hyperlinks, merged ranges and UTC dates using explicit `UTC: true` during worksheet creation. No formula evaluation is claimed.
- Full/core/mini browser-global bundles: Unicode XLSX roundtrip in Node VM without CommonJS globals. Not real browser-engine tests.
- CJS reconstructed byte-for-byte from tagged bits using the Makefile concatenation/annotation-stripping recipe. SHA-256 `fd159f1e2d694e12cd0709c1ec1b63c6e1f045d2c4ce857a346f9b965798cbfa`. Minified bundles are retained upstream outputs; minifier rebuild not verified.

## Initial failures and corrections

`results/initial-harness-results.json` retains the first run. Browser distributions initially failed a Node readFile assumption; the fixture now uses supported buffer input. Core legacy-format tests initially omitted codepage injection. Mini was incorrectly asked to parse HTML, which it omits; the case is now explicitly out of scope. No parser changes were made to pass these tests.

The date test initially assumed implicit UTC preservation. Default worksheet creation applied local-time semantics: the chosen 12:30Z input yielded 06:30Z in this environment. Explicit `UTC: true` preserved the intended value. Default date semantics remain a migration caveat, not a fix in this candidate; a timezone/DST matrix is pending.

## Unverified / public-release gates

1. Full upstream fixture suite and separately distributed test corpus.
2. TypeScript declaration compilation, framework/bundler builds and supported Node runtime matrix. A temporary packed consumer passed require, ESM import, full/core/mini extensionless deep imports and Unicode XLSX roundtrips. The private flag and rejecting publish guard were also verified; see `results/packed-consumer.json` in the source checkout. This does not replace framework build tests.
3. Real Chromium/Firefox/WebKit, streams, broader legacy formats/encodings and timezone/DST behavior.
4. Other malformed-file/resource cases, current advisories and bundled-component inventory. Two targeted regressions are not a complete audit.
5. All minified outputs rebuilt/reconciled with source, toolchain and bundled license/NOTICE review, final source/package version policy.
6. Repository/npm scope, maintainers, reporting channel, supported-version policy and secure publishing workflow. Publishing remains disabled.

The cloned upstream contribution rules include restrictions on AI-generated contributions. This is independent local work, not an upstream submission; a compatible process and truthful contributor attestations are needed for any future upstream PR.
