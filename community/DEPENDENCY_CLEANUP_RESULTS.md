# Development dependency security cleanup — October 23, 2026

The ten original repository alerts concern development tools and private framework fixtures. Their directories and dependencies are excluded from the published `@angular-bootstrap/xlsx@0.1.0-rc.1` archive. This cleanup does not change workbook parser bytes or publish a new version.

## Changes and validation

| Area | Result |
|---|---|
| Serializer advisories | Mocha 12.0.3 resolves serialize-javascript 7.1.4. Inert RegExp/Date injection and array-like CPU exhaustion regressions pass on Node 22/24/26. Known-affected 7.0.2 reproduces the failures in isolated controls. |
| esbuild development server | Both retained tool projects pin 0.28.2 with committed lockfiles. Makefiles now use the installed binary instead of downloading vulnerable 0.14.14. An untrusted Origin receives no permissive CORS header; old-version control reproduces permissive exposure. |
| Angular/Vite advisories | A scoped override replaces Angular's pinned Vite 8.3.0 with 8.3.5. Angular production build and Chrome development-server checks pass. |
| Dependency audits | All seven exact project lockfiles report zero known vulnerabilities from npm audit. This does not scan every vendored parser function. |
| Framework compatibility | Angular, React and Next.js production builds pass; all nine Chrome/Firefox/WebKit combinations pass, including upload/download and Next.js server checks. |
| Build reproducibility | Uglify 2.7.4 and source-map 0.8.0 reproduce all 12 generated outputs identically in two clean builds. |
| Retained developer builds | Eight standalone module outputs and both otorp Node outputs build with esbuild 0.28.2. |

Three merged routine updates needed compatibility corrections: Commander 15 breaks the legacy CLI typing fixture (2.20.3 passes); Angular requires TypeScript >=6.0 <6.1 and rejects 7.0.2 (6.0.3 passes); jsdom 30 fails the upstream HTML hidden-row check (26.1.0 passes). These compatible versions have no findings in the current lockfile audits. Pinned test/build tools now receive automatic security updates only; optional version upgrades are coordinated manually. Angular TypeScript remains constrained to its declared peer range. Optional PRs #11 and #12 were deferred and their redundant CI runs cancelled.

The full upstream CommonJS and ESM suites each passed 37,313 tests, with one pending and zero failures, using the final compatible tool lock. Runtime security and rich-text regression groups passed; strict TypeScript compilation also passed. All six Linux/Windows native jobs and the hosted developer-security job passed. Three macOS jobs remain in progress on [cleanup commit 24def9f](https://github.com/angular-bootstrap/xlsx-community/actions/runs/40022900280); final macOS results are not yet claimed. See the [machine-readable evidence](public-evidence/development-dependency-cleanup.json) for current status. GitHub readback confirms all ten original alerts fixed and zero open; no findings were dismissed.

The cleanup push used the repository's configured single-owner administrator bypass. Test results are verified separately; this is not a claim of independent code-owner review.

## Remaining limits

Complete retained-tool builds remain unverified. The isolated Numbers CLI fixture lacks root-package and `cfb` resolution prerequisites; both esbuild versions report the same dependency-resolution failures. The optional otorp ES5/Deno target reports unsupported syntax with both versions. The eight standalone module outputs and two Node otorp outputs above pass. These are development-tool validation gaps; do not treat the isolated-fixture failures as proven parser defects.

Existing timezone/resource limits remain documented. No independent comprehensive parser audit or unlimited-resource safety guarantee is claimed. The published artifact includes regression-tested upstream fixes for CVE-2023-30533 and CVE-2024-22363; renaming a package does not itself fix vulnerabilities.

Publishing remains disabled for this task. Future approved releases must use the guarded GitHub workflow and verify the actual npm OIDC provenance attestation; the bootstrap release has no GitHub OIDC provenance. Draft notes are prepared locally in `community/release/RELEASE_NOTES_DRAFT.md`.

The subsequent documentation/Dependabot-policy commit uses `[skip ci]` because it changes no executable code, dependency lock or workflow. The tested code remains commit `24def9f`; the existing final matrix continues. A future release must still satisfy its exact-commit release gates.

GitHub documents that `open-pull-requests-limit: 0` disables routine version-update PRs while retaining security updates: https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/customizing-dependabot-security-prs.
