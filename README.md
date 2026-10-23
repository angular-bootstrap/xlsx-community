# @angular-bootstrap/xlsx

Independent npm distribution based on official SheetJS CE **0.20.3**, retaining upstream history and license notices. Repository: [angular-bootstrap/xlsx-community](https://github.com/angular-bootstrap/xlsx-community). This is not an official SheetJS release and has no upstream endorsement.

Published prerelease: [**0.1.0-rc.1**](https://www.npmjs.com/package/@angular-bootstrap/xlsx/v/0.1.0-rc.1). Install the explicit version or use `@next`. This is a release candidate; no stable release has been published. npm also assigns this initial candidate to `latest`. `XLSX.version` retains the upstream runtime version `0.20.3`.

## Why this package exists

Many projects still depend on SheetJS through npm. With maintained upstream Community Edition releases distributed through the official CDN, those projects need a practical npm upgrade path away from older releases affected by known vulnerabilities. This community effort aims to provide that path: an independently maintained npm distribution, tested compatibility, transparent security regression evidence and preserved upstream credit.

Our goal is to help developers upgrade safely and support the wider spreadsheet ecosystem. SheetJS remains the upstream project; this package builds on its work and documents every additional change.

## Getting started

Install the prerelease explicitly:

```sh
npm install @angular-bootstrap/xlsx@0.1.0-rc.1
```

```js
import * as XLSX from '@angular-bootstrap/xlsx';

const sheet = XLSX.utils.aoa_to_sheet([
  ['Name', 'Quantity'],
  ['Example', 3]
]);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, 'Inventory');

const bytes = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const restored = XLSX.read(bytes, { type: 'array' });
console.log(XLSX.utils.sheet_to_json(restored.Sheets.Inventory));
```

CommonJS applications can use `const XLSX = require('@angular-bootstrap/xlsx')`. For existing direct `xlsx` imports, an npm alias can ease migration after compatibility testing:

```sh
npm install xlsx@npm:@angular-bootstrap/xlsx@0.1.0-rc.1
```

Aliases do not automatically upgrade nested dependencies. Review the encoding change and supported Node versions below before upgrading.

## What this candidate changes

| Change beyond CDN 0.20.3 | What users gain |
|---|---|
| HTML hyperlink protocol allowlist | Unsafe/unknown protocols are suppressed while cell text is retained; HTTP, HTTPS, mailto and permitted relative links remain supported. |
| Rich-text HTML escaping and formatting validation | Decoded text is escaped, alignment tags are restricted, and font sizes are numeric. Valid formatting and CRLF comment behavior are preserved. |
| Legacy CSV byte-array decoding | An explicitly requested legacy codepage is honored for CSV byte-array input. |
| Independently sourced shims and mapping inputs | Pinned source hashes and license notices replace selected provenance gaps. Codepages 620, 895 and 10008 remain supported. |

**Compatibility change:** CP895 byte `0x8D` now maps to `ĺ` rather than `Ǫ`. Read [CP895 migration guidance](community/CP895_COMPATIBILITY.md). The deprecated upstream CLI entry is omitted from this package; no CLI compatibility claim is made.

The known CVE-2023-30533 and CVE-2024-22363 fixes are **already present in official CDN 0.20.3**. We inherit and regression-test those upstream fixes; they are not new fixes authored by this fork. The added HTML changes have no assigned CVE and do not make HTML output a universal sanitizer.

See [the full upstream comparison and credit](community/UPSTREAM_DIFFERENCES.md), including the fork's corrected CRLF regression and native verification-harness corrections.

## Compatibility and verification

The native CI matrix covers Node 22.23.4, 24.22.1 and 26.12.1 on Linux x64, Windows x64 and macOS Intel. All nine final native jobs passed, with CJS and ESM each passing 37,313 tests per job and zero failures. See [release results](community/ANGULAR_BOOTSTRAP_RELEASE_RESULTS.md) and [publication verification](community/public-evidence/published-release.json).

Additional local evidence includes macOS/Linux ARM64 suites, Angular/React/Next.js production fixtures, Chrome/Firefox/WebKit checks, TypeScript checks, bundlers, restored encoding tests and byte-for-byte build reproduction. Historical matrices are labeled where they predate the latest patch. The full upstream suites retain one inherited pending CSV-date test.

On a clean checkout with a supported Node version and Python 3.12:

```sh
npm ci --prefix .ci/test-tools --ignore-scripts --no-audit --no-fund
python community/ci/fetch-corpus.py
node community/ci/run.cjs
```

The corpus download requires the pinned byte size and SHA-256 before extraction. This is a substantial fixture download. Raw results stay under ignored `community/results/`; compact public evidence is in `community/public-evidence/`.

## Inherited behavior kept unchanged

Default local-time date roundtrips and large declared worksheet ranges show the same observations as official CDN 0.20.3. They are documented limitations, excluded from the current fixing scope. Use tested explicit-UTC/serial/string date workflows and enforce application-side resource limits for untrusted files. See [SECURITY.md](SECURITY.md).

Our maintenance scope is to fix regressions introduced by this fork and retain the explicitly approved additional changes above. We do not claim absence of all vulnerabilities or an exhaustive security audit. See [SECURITY.md](SECURITY.md) for reporting and application-side guidance.

## Source and licenses

Upstream baseline: [`v0.20.3`, commit `8a7cfd47bde8258c0d91df6a737bf0136699cdf8`](https://git.sheetjs.com/sheetjs/sheetjs/src/commit/8a7cfd47bde8258c0d91df6a737bf0136699cdf8). The official remote is retained as `upstream`; `origin` points to this independent repository.

[Original README](README.upstream.md) · [Apache license](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [Mapping-data notices](MAPPING_DATA_NOTICES.md) · [Provenance record](COMMUNITY_PROVENANCE.json)
