# Stable 0.1.0 release review

Requested by the release owner on November 13, 2026. Publication remains conditional on passing checks and the protected release environment approval.

## Changes

The library, browser distributions and TypeScript declarations are byte-identical to the tested 0.1.0-rc.1 source. This promotes that runtime to stable; it does not introduce new spreadsheet parser fixes. SheetJS deserves credit for the inherited fixes for CVE-2023-30533 and CVE-2024-22363. Independent HTML-output hardening and licensed mapping replacements remain documented in UPSTREAM_DIFFERENCES.md.

Two newly disclosed medium development-only alerts are addressed through narrow Mocha overrides: glob 14.0.2 (GHSA-3g3m-2fjr-6pw4) and minimatch 11.0.1 (GHSA-g3hv-75wg-m249). These are major-version overrides because the currently published Mocha 12.0.3 dependency ranges exclude the patched releases. Full CJS/ESM suites must pass before acceptance. Dedicated regressions check cancellation stops filesystem reads and pattern amplification stays bounded.

Angular fixture peers are aligned to 22.2.5. The previous main branch failed a clean install (compiler 22.2.4 versus compiler-cli 22.2.3); PR #14's isolated platform-browser update would introduce another peer mismatch. This change includes that update with matching peers. The fixture is now built against the local packed candidate in CI.

Stable manifests require npm tag `latest`; prereleases require `next`. Publication still requires an exact version tag, successful archive validation, tokenless OIDC and owner approval of `npm-production`. Manual workflow dispatch validates only and cannot publish.

## Before publication

- Require the complete native matrix and development security checks on this change.
- Require the Angular production build against the local archive.
- Require release validation and two byte-identical reproductions of all 12 distribution outputs.
- Confirm the npm trusted publisher is valid; the old unverified bootstrap relationship may have expired. Do not fall back to interactive or token publishing.
- Publish only a new `v0.1.0` tag from accepted source after all gates pass.

## After publication

Verify registry integrity, clean installation, `latest` and the actual OIDC provenance attestation. Then update README and SECURITY.md to reflect verified stable availability and create the GitHub release with matching source/artifact checksums.

## Limits

A stable version is not a claim that all possible vulnerabilities are eliminated. No independent parser audit has been performed. Untrusted files still require external CPU/memory/archive limits. Existing local-time roundtrip limitations and the documented CP895 mapping correction remain unchanged.
