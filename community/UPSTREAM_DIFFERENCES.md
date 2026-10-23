# Differences from official SheetJS CDN 0.20.3

Our maintenance scope is to fix regressions introduced by this fork and retain the independently approved changes below. We will not expand this release into repairs for inherited timezone/resource behavior. A failing test is classified against the official baseline before scheduling a parser fix.

Official CDN: https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz. Retrieved October 23, 2026; SHA-256 `8dc73fc3b00203e72d176e85b50938627c7b086e607c682e8d3c22c02bb99fe8`. The CJS, ESM and full minified runtime hashes match the pinned upstream commit used by the existing regression controls. Evidence: `public-evidence/cdn-baseline.json` and `public-evidence/cdn-comparison.json`.

| Finding/change | Official CDN behavior | Candidate behavior | Credit and scope |
|---|---|---|---|
| CVE-2023-30533 prototype pollution | Selected regression case already fixed | Same case passes | Upstream fix inherited, not a new fork security fix |
| CVE-2024-22363 HTML ReDoS | Selected regression case already fixed | Same case passes | Upstream fix inherited, not a new fork security fix |
| Unsafe HTML hyperlink protocols | Inert javascript URL retained in exported anchor | Default URL allowlist suppresses unsafe anchor and preserves text | Additional fork hardening beyond CDN; previously requested and regression tested |
| Rich-text HTML text/alignment/font size | Inert markers demonstrate decoded markup/formatting injection | Escaped text, validated alignment tags and numeric font size | Additional fork security change beyond CDN; not an assigned CVE or exhaustive sanitizer |
| CRLF comments after initial rich-text patch | Upstream comment representation passes | Initial fork regression corrected; final full suites pass | A regression caused by our change, now fixed |
| CSV byte-array input with explicit legacy codepage | Inherited decoding problem reproduced in earlier controls | Explicit codepage honored | Additional compatibility fix beyond CDN; not a CVE |
| CP895 byte 8D | Maps to U+01EA (Ǫ) | Verified replacement maps to U+013A (ĺ) | Intentional compatibility change from licensed mapping replacement; not an accidental regression. See CP895_COMPATIBILITY.md |
| Shim and mapping provenance | Selected source/provenance gaps in vendored components | Independently authored shims and pinned licensed mapping inputs | Supply-chain/license documentation work, not a claim of new runtime vulnerabilities |
| Default local-time date roundtrips | 40/50 wall-time expectations fail; 175 explicit UTC cases pass | Identical observed dates and counts | Inherited behavior, documented and excluded from current fixing scope |
| Maximal declared worksheet range | Unbounded conversion exceeds 2-second child budget; bounded conversion completes | Same observation | Inherited resource boundary, documented and excluded from current fixing scope |

Package wording may say: “Independent npm distribution based on SheetJS CE 0.20.3, retaining upstream CVE fixes, with additional tested HTML output hardening, legacy CSV decoding corrections, and independently sourced license notices/mapping data.” Do not say we discovered or fixed the upstream CVEs, that all vulnerabilities are fixed, or that HTML output is a universal sanitizer. Preserve the CP895 migration note and UTC/resource guidance.

The added HTML patches were already explicitly requested during candidate preparation. This scope decision retains them and adds no new fixes for inherited date/resource behavior. Broader security review and upstream coordination remain separate maintenance work.

## Native CI harness corrections

The first native run identified a test assumption: affected 0.20.1 did not always exceed 2.5 seconds at exactly 30,000 spaces on x64. The harness now increases bounded control inputs up to 120,000 spaces, requires an observed budget overrun, and requires every candidate input to complete. No runtime parser code changed. One Windows corpus download failed its pinned hash; the fetcher now retries once, checks the exact byte size and SHA-256, records diagnostics, and never extracts a mismatched archive. These are corrections to our verification infrastructure.
