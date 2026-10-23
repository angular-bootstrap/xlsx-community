# Release workflow

Publication of `@angular-bootstrap/xlsx@0.1.0-rc.1` was approved on October 23, 2026, conditional on passing checks. It targets public access and the `next` dist-tag.

`.github/workflows/publish.yml` runs validation on manual dispatch and version-tag pushes. Publication requires a version-tag push in `angular-bootstrap/xlsx-community`, a successful validation job and the protected `npm-production` environment. Manual dispatch cannot publish.

Validation pins Node 24.22.1, npm 12.2.1, Python 3.12 and action SHAs. It verifies metadata, native-tested runtime/type bytes, the successful native run, pinned corpus integrity, full suites/security regressions, two clean reproductions of all 12 generated outputs, and the exact packed archive, notices and SHA-256. Runtime/type/API changes require new native evidence. Development fixtures, controls and raw results are excluded from the package.

The publish job downloads that exact validated archive, rechecks its SHA-256, enforces a matching version tag and tokenless configuration, rejects existing versions and registry lookup errors, then publishes with OIDC and provenance. Only this job has `id-token: write`. The environment requires owner review.

## First-package bootstrap

npm requires an existing package before configuring its trusted publisher. For the first candidate only, use the restored interactive npm identity to publish the exact CI-validated archive after all required checks pass. This bootstrap has no GitHub OIDC provenance attestation. Never copy the login credential into GitHub or publish a placeholder package. Confirm registry integrity and installation before reporting success.

After bootstrap, configure the trusted publisher for GitHub owner `angular-bootstrap`, repository `xlsx-community`, workflow `publish.yml`, environment `npm-production`, allowing publish. Configure future releases to use that relationship. See https://docs.npmjs.com/cli/v12/commands/npm-trust/ and https://docs.npmjs.com/trusted-publishers/.

Update README publication status and public release evidence only after registry confirmation. Credit inherited upstream CVE fixes separately from additional fork changes. Preserve CP895 migration guidance and inherited date/resource limitations. A passing regression suite is not an exhaustive security audit.

## Published bootstrap result

`0.1.0-rc.1` is publicly available. Its registry tarball exactly matches the CI-reviewed archive; fresh public installation, CJS/ESM roundtrips and the documented alias passed. All nine final native jobs and the complete release validation passed. Detailed source commit, run links and hashes are in `community/public-evidence/published-release.json`.

npm assigned both `next` and `latest` to this initial release despite `--tag next`. An authenticated attempt to remove `latest` returned E400. The README identifies the default install as a prerelease. No version was republished or replaced.

The GitHub trusted publisher is configured for the exact repository/workflow/environment above. Its first actual OIDC publish remains unverified. npm requires the first successful OIDC publish within two days of creating a configuration; otherwise recreate the expired relationship before the next release. This manual bootstrap does not validate that OIDC relationship. See https://docs.npmjs.com/trusted-publishers/.

The bootstrap version is immutable. Do not trigger a tag publish for `v0.1.0-rc.1`; the existing-version guard will reject it. The next approved version will use the GitHub workflow. No new version is published just to exercise OIDC.
