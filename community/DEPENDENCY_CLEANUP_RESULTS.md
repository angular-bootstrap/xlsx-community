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

Three merged routine updates needed compatibility corrections: Commander 15 breaks the legacy CLI typing fixture (2.20.3 passes); Angular requires TypeScript >=6.0 <6.1 and rejects 7.0.2 (6.0.3 passes); jsdom 30 fails the upstream HTML hidden-row check (26.1.0 passes). These compatible versions have no findings in the current lockfile audits. Dependabot major-version rules document the coordinated-upgrade requirement.

The full upstream CommonJS/ESM suite is being rerun with the final compatible tool lock; hosted Linux/Windows/macOS x64 results must be checked on the cleanup commit. See the [machine-readable evidence](public-evidence/development-dependency-cleanup.json) for current status. Alert closure is verified through GitHub, never by dismissing findings.

## Remaining limits

Optional inherited whole-build targets for the Numbers CLI and otorp ES5/Deno output fail with both old and patched esbuild. The selected supported outputs above pass. These are retained developer build gaps, not failures in the shipped library artifact.

Existing timezone/resource limits remain documented. No independent comprehensive parser audit or unlimited-resource safety guarantee is claimed. The published artifact includes regression-tested upstream fixes for CVE-2023-30533 and CVE-2024-22363; renaming a package does not itself fix vulnerabilities.

Publishing remains disabled for this task. Future approved releases must use the guarded GitHub workflow and verify the actual npm OIDC provenance attestation; the bootstrap release has no GitHub OIDC provenance. Draft notes are prepared locally in `community/release/RELEASE_NOTES_DRAFT.md`.
