# Release workflow (publication disabled)

Reference: angular-bootstrap/ngbootstrap `.github/workflows/release.yml`, blob `70c85adae5c1bab3abd3a8bb7dade5ee986272dd`. The independent workbook package uses npm tooling rather than Angular/pnpm build commands. No ngbootstrap secret or npm credential was read or copied.

`.github/workflows/publish.yml` registers **Release @angular-bootstrap/xlsx**. It reacts to version tags and manual dispatch. Manual dispatch runs validation only while the publish job remains `if: ${{ false }}`. The source and archive retain `private: true` and the rejecting prepublishOnly hook. No version tag is created as part of preparation.

The validation job pins Node 24.22.1, npm 12.2.1, Python 3.12 and action SHAs. Locked verification/build tools install with scripts disabled. It checks metadata/tag/token absence, binds runtime/type files to the recorded successful native matrix, confirms that run on GitHub, runs full suites/security controls, reproduces all 12 generated outputs twice, packs without lifecycle scripts, verifies archive contents/bytes/notices, and uploads the archive plus SHA-256 for review. Raw local reports, controls and node_modules are excluded from the package. No registry mutation occurs.

The future publish job uses the exact validated artifact, verifies its SHA-256 again, rejects a mismatched tag or legacy token, fails closed if the registry lookup is unavailable or the version exists, and uses npm OIDC with public access, provenance and the next dist-tag. It has no npm token secret and is currently skipped. Only that job has id-token:write. npm-production requires angular-bootstrap approval, matching ngbootstrap's owner-review pattern.

## Before a separately approved activation

1. Review the candidate, the exact archive hash, notices and additional HTML/CSV changes. Adopt the documented CP895/inherited-behavior scope. Independent security review is not replaced by a green workflow.
2. Verify npm identity and angular-bootstrap scope access. The first-package/bootstrap process and trusted publisher must be configured in npm; GitHub environment creation does not accomplish that.
3. Configure the npm trusted publisher for owner angular-bootstrap, repository xlsx-community, workflow publish.yml, environment npm-production. Confirm current npm requirements at activation time: https://docs.npmjs.com/trusted-publishers/.
4. In one reviewed activation change, remove private:true, replace/remove the rejecting hook appropriately, and change the publish job's false condition to an explicit version-tag/repository condition. Keep the environment approval, hash guards, tokenless checks and provenance. Do not switch this prerelease to latest.
5. Push an approved tag exactly matching the package version only after release approval. Nothing in workflow preparation authorizes that step.

Standard npm dependency auditing does not inspect vendored workbook parser code. This workflow uses the source security regression and provenance checks; it does not claim a fresh exhaustive bundled-component security audit.
