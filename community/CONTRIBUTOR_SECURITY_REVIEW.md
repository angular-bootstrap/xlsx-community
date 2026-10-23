# Contributor security review — October 23, 2026

The review covered GitHub contributor/release permissions and contribution guidance for the independent fork. The settings below were applied and read back through the GitHub API. No parser/runtime change or new npm release was made. This is not a new bundled-code vulnerability audit.

## Findings resolved

| ID | Priority | Finding and resulting control |
|---|---|---|
| CS-01 | High | `main` was unprotected. Contributor changes now require one code-owner review, stale-approval dismissal, approval after the latest push, all nine GitHub Actions native checks against an up-to-date base, and resolved conversations. Force pushes and branch deletion are blocked. |
| CS-02 | High | Release tags had no rules and the environment allowed any ref/admin bypass. Version-tag creation/update/deletion is restricted with an active ruleset and administrator-only bypass. `npm-production` accepts only `v*` tags, requires the owner reviewer and disallows environment administrator bypass. |
| CS-03 | Medium | Fork workflow approval covered only first-time contributors, and any Action was allowed. All external fork contributors now require workflow approval; only GitHub-owned Actions are allowed, with full commit-SHA pinning enforced. Default tokens remain read-only and cannot approve PRs. |
| CS-04 | Medium | Dependabot security updates were disabled. Dependency alerts/security updates are enabled, with weekly update configuration for Actions, isolated npm tools, retained upstream tool manifests and the affected Angular fixture. Secret scanning and push protection remain enabled. |
| CS-05 | Medium | Inherited contribution/security documents described upstream contacts and unpublished status. The independent fork now has current private-reporting guidance, safe synthetic-fixture requirements, provenance/license expectations and contributor/release boundaries. The original upstream contribution guide is retained as historical reference. |
| CS-06 | Release requirement | The first release lacked GitHub OIDC provenance. The next-release checklist explicitly requires OIDC publication, checking publisher expiry and verifying the actual registry attestation's source/artifact identity. No replacement attestation is claimed for the bootstrap release. |

## Open dependency findings

**CS-07 — High/Medium/Low, unresolved:** enabling alerts surfaced ten findings: two high, seven medium and one low. Two `serialize-javascript` alerts affect `.ci/test-tools/package-lock.json`; six Vite/launch-editor alerts affect the Angular fixture lock; two esbuild alerts affect retained upstream tool manifests. Patched versions are identified in the [alert snapshot](public-evidence/contributor-dependency-alerts.json). Locks were not modified and alerts were not dismissed. Updates require compatibility verification before merging.

The exact published archive was checked: these manifests/directories and their dependencies are excluded, and its runtime/dev dependency maps are empty. GitHub may label some fixture dependencies “runtime” within those separate projects; they are development fixtures relative to this npm library. This does not establish that every vendored parser component is vulnerability-free.

## Remaining trust boundaries

- There is one release owner. Repository administrators can bypass branch/tag protection; release self-review remains allowed so the owner is not locked out. Appoint a second trusted maintainer before enforcing two-person release approval. Other contributors receive no npm publishing access through these changes.
- CI approval is permission to execute untrusted code, not an assertion that it is safe. Review workflow/test changes first; fork CI has no npm credentials or protected release environment access.
- The configured trusted publisher has not yet completed an OIDC publish. Follow its two-day initial validation/expiry rule before the next approved release. No new version was published to test that configuration.

## Verification and locations

API assertions verified all nine required check names and GitHub Actions app bindings, review settings, tag ruleset, environment tag policy/reviewer/no-admin-bypass, Actions restrictions, dependency alerts/updates, private reporting, secret scanning and push protection. Both new YAML configuration files parsed successfully; `git diff --check` passed. Existing workflow Action references remain pinned. No runtime tests were repeated for documentation/settings-only changes.

- [Live settings snapshot](public-evidence/contributor-security-settings.json)
- [Contributor permissions and review guidance](../CONTRIBUTING.md#review-and-permissions), lines 25–31
- [Private security reporting](../SECURITY.md), line 5
- [Next-release OIDC requirement](release/NEXT_RELEASE.md), lines 3–15
- [Dependency update configuration](../.github/dependabot.yml), line 1
