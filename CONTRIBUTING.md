# Contributing to @angular-bootstrap/xlsx

Thank you for helping maintain a practical npm upgrade path for SheetJS users. This guide applies to the independent community fork. Upstream SheetJS has its own contribution policies; its original guide is preserved in [community/upstream-CONTRIBUTING.md](community/upstream-CONTRIBUTING.md) for historical reference.

## Report safely

Report suspected vulnerabilities through [GitHub private vulnerability reporting](https://github.com/angular-bootstrap/xlsx-community/security/advisories/new). Follow [SECURITY.md](SECURITY.md); keep working exploit files and sensitive details out of public issues and pull requests. For ordinary bugs, include the package version, runtime, expected behavior and a minimal synthetic workbook. Remove personal data, credentials, confidential documents and external resource references from fixtures.

## Submit a pull request

Fork this repository and open a focused pull request against `main`. Explain the problem, compatibility impact, tests and source of any imported code or data. Changes to parser/runtime/type files require the full native CI matrix. Security or HTML-output changes need regression coverage across affected builds. Do not skip required CI or edit evidence to turn a failing result into a pass.

Use code and fixtures you have the right to contribute under the applicable project licenses. Preserve copyright and license notices. For third-party mappings, shims or generated data, include the original source, exact version/commit, license and hashes; unverified provenance is not accepted. Explain generated or tool-assisted changes and review them as carefully as handwritten code. Do not attest that work is independently reviewed when it is not.

With a supported Node version and Python 3.12:

```sh
npm ci --prefix .ci/test-tools --ignore-scripts --no-audit --no-fund
python community/ci/fetch-corpus.py
node community/ci/run.cjs
```

The pinned fixture corpus is a substantial download. Run unfamiliar workbooks and contributor branches in a disposable environment without credentials. The corpus fetch verifies size and SHA-256 before extraction. Build reproduction and mapping provenance commands are documented in [the release workflow guide](community/release/PUBLISHING.md).

## Review and permissions

Contributor changes require a code-owner review, the nine native CI checks and resolved review conversations before merging. New commits dismiss stale approvals. External fork workflows require maintainer approval before running. CI uses read-only tokens, pinned GitHub-owned Actions and no npm credentials. Maintainers must inspect workflow and test changes before approving a fork run; workflow approval alone is not a code review.

The release owner is `@angular-bootstrap`. Contributors do not need npm publishing access. Release tags are restricted to repository administrators, and npm publishing requires the protected `npm-production` environment and owner approval. Repository administrators retain a branch-protection bypass for the current single-maintainer setup; this is a documented trust boundary. Independent review and preventing release self-review should be enabled when another trusted release maintainer is appointed.

Never add credentials to source, fixtures, artifacts or logs. Do not use `pull_request_target` to execute untrusted contributor code with elevated access. Changes to workflows, release guards, dependency locks, generated bundles and license inputs receive the same code-owner review as parser changes.

## Releases

Future releases must follow [NEXT_RELEASE.md](community/release/NEXT_RELEASE.md), including the **OIDC provenance attestation** verification. A pull request or checklist does not authorize a new npm release. The bootstrap candidate `0.1.0-rc.1` was published interactively and has no GitHub OIDC provenance attestation.
