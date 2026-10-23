# Security policy — angular-bootstrap/xlsx-community

This is an independent SheetJS CE fork. The repository is https://github.com/angular-bootstrap/xlsx-community. The npm package is `@angular-bootstrap/xlsx`; the currently supported prerelease is `0.1.0-rc.1`. @angular-bootstrap is the release owner. No response-time SLA or independent security audit is claimed.

GitHub private vulnerability reporting is enabled in angular-bootstrap/xlsx-community. The reporting channel is https://github.com/angular-bootstrap/xlsx-community/security/advisories/new. Do not publish working exploit details in public issues or pull requests. Reports should include affected versions, a minimal inert fixture where possible, impact and reproduction steps.

Initial support scope is prerelease 0.1.0-rc.1 only, with no stable support promise. Future supported versions and response commitments must be adopted by the maintainer. Upstream findings should be coordinated with SheetJS through its published security contact; this policy does not authorize sending reports on anyone's behalf.

## Processing untrusted files

Spreadsheet parsing is not a sandbox. Limit compressed and expanded bytes, worksheet rows/columns/cell ranges, output size and execution time. Enforce limits outside the parser in disposable workers/processes with a memory budget. `sheetRows` is not an archive/decompression, column or total CPU limit. A small workbook with a very large declared range exceeded the local conversion deadline; an explicitly bounded conversion completed. Do not infer that all other malformed inputs are safe.

The HTML link policy and rich-text escaping fixes address specific output paths. Caller-supplied `cell.h`, header/footer HTML and application HTML insertion still require trusted input or a vetted sanitizer. Applications must not treat sheet_to_html as a general sanitizer. Avoid injecting untrusted HTML into React/Angular/Next views; render text or sanitize explicitly. CSV formula interpretation in Excel is a separate workflow risk; no universal formula-neutralization policy is claimed here.

Explicit UTC roundtrips passed the timezone/DST matrix. Default local-time Date roundtrips failed wall-time preservation expectations outside UTC and remain a documented limitation. Use a tested UTC/serial/string date workflow; do not claim automatic timezone preservation.

## Current prerelease review

Two inherited CVE regression controls pass. The independent rich-text fix escapes decoded text, restricts alignment tags and emits numeric font sizes; inert workbook fixtures reproduce the old behavior and verify the fix. Additional HTML-output hardening is documented in community/UPSTREAM_DIFFERENCES.md; reports of further vulnerabilities should use the private channel. No new CVE or full vulnerability-free certification is asserted.

No token belongs in source, fixtures or CI logs. Future releases use the protected GitHub workflow and npm OIDC; verify the resulting provenance attestation under community/release/NEXT_RELEASE.md. The interactive bootstrap release has no GitHub OIDC provenance attestation. Contributor access does not grant npm publishing access.

## Contributor and maintainer access

See [CONTRIBUTING.md](CONTRIBUTING.md) for review, CI and fixture-handling requirements. Maintainers must inspect untrusted workflow/test changes before approving fork CI. Grant the minimum repository access required; npm publishing remains restricted to the release owner and approved trusted workflow. Add a second trusted reviewer before requiring independent release approval; no backup maintainer or response SLA is currently promised.
