# Historical release plan: @angular-bootstrap/xlsx

**Current status:** `0.1.0-rc.1` is published and verified. This document preserves the initial prepublication plan; statements below about disabled publishing or missing authentication describe that earlier stage. See [current release results](ANGULAR_BOOTSTRAP_RELEASE_RESULTS.md), [publication evidence](public-evidence/published-release.json) and [the current release workflow guide](release/PUBLISHING.md).

Agreed target: npm `@angular-bootstrap/xlsx`, repository `angular-bootstrap/xlsx-community`, first proposed version `0.1.0-rc.1`, npm tag `next`. This is an independent SheetJS CE fork, not an official SheetJS release. The public repository has been created at https://github.com/angular-bootstrap/xlsx-community; no npm package was published. Both the source candidate and scoped review artifact remain private/non-publishable, with rejecting prepublishOnly hooks.

## Ownership and first-release setup

The connected GitHub account is angular-bootstrap. The agreed public repository has now been created; private vulnerability reporting is enabled. npm's existing user configuration returned 401 Unauthorized, so npm identity and scope access are not verified. The scoped package lookup returned 404; that neither reserves its name nor establishes ownership.

Before any publication:

1. The agreed public repository is created, the candidate is pushed, and upstream history/licenses are retained. The official remote is named upstream; origin is angular-bootstrap/xlsx-community. Source and curated evidence were uploaded; raw local corpus/results and credentials were excluded. Never push the fork's changes to the official upstream remote.
2. Private vulnerability reporting is enabled and SECURITY.md is in place. Assign angular-bootstrap as release owner; identify a backup maintainer when available. Do not claim a response SLA that has not been adopted. Enable branch/release protections and require independent review when a second maintainer is available.
3. Run the prepared read-only CI matrix on native Windows x64, Linux x64 and macOS Intel, across Node 22.23.4/24.22.1/26.12.1. All nine native jobs have now passed; see public-evidence/native-ci-results.json. Review failures and support claims before removing any gate.
4. Restore npm authentication interactively and verify that the account controls the angular-bootstrap scope. Do not put tokens in source or request them in chat. Configure account 2FA and package access. Bootstrap the first package using npm's supported first-package process; do not assume a trusted publisher can be configured for a package that does not yet exist.
5. Configure trusted publishing for owner angular-bootstrap, repository xlsx-community, exact workflow filename publish.yml, and the reviewed npm-production environment. Pin the toolchain. npm currently requires a supported modern Node/npm CLI for OIDC; verify the documented requirements at activation time. Prefer staged publication and owner approval when available. A publish token is not part of this plan.
6. Review the exact scoped archive hash, contents, notices and upstream pedigree. Use public access and the next dist-tag for an approved release candidate; do not move latest. Activate publication only in a separate explicit release decision after the review. The active publish.yml has an explicitly disabled publish job; its validation job can run without publishing. private:true and the rejecting hook remain in place.

References: https://docs.npmjs.com/trusted-publishers/, https://docs.npmjs.com/staged-publishing/, https://docs.npmjs.com/generating-provenance-statements/.

## Work completed or prepared

| Area | Evidence/status |
|---|---|
| Existing Node/bundler matrix | Node 22/24/26 full CJS/ESM suites passed before the new rich-text fix; current patch-specific reruns are recorded separately. Four common bundlers and actual browser executions passed. Do not conflate historical bytes with the final artifact. |
| Scope/profile | Local @angular-bootstrap/xlsx@0.1.0-rc.1 review profile, preserving runtime origin/license notices. Deprecated upstream CLI bin entry omitted; no fake CLI support claim. |
| Frameworks | Angular 22.2.3 with CLI/build 22.2.4 + TypeScript 6.0.3, React 19.3.1/Vite 8.3.5, Next.js 16.4.3/Turbopack production fixtures. Actual runtime, SSR/client and API results are in framework-integration.json. |
| Browser file flows | React file-picker import and workbook download verified in Chrome, Firefox and WebKit, with saved files parsed again. Next server XLSX route checked. |
| Timezones | Five zones and DST-boundary cases: 175 explicit-UTC checks pass; 40 of 50 default local-wall-time checks fail. Default date preservation is not a supported claim for the prerelease. |
| Security review | Existing CVE controls; newly reproduced rich-text HTML issue fixed with escaping and formatting validation; inert baseline/candidate cases and full-suite reruns retained. CRLF comment formatting regression was corrected and the comments subset passed. |
| Resource limits | A 15,839-byte workbook with a maximal declared range exceeded a two-second conversion budget; a bounded conversion completed. Parser-wide archive/CPU limits are not provided. Document and enforce application/worker limits. |
| Linux/x64 | Docker ARM64 Linux full-suite results and x64-emulated consumer results are recorded in linux-containers.json. Final Linux ARM64 CJS and ESM reruns each passed 37,313 tests, one pending, zero failures. The x64-emulated consumer passed 17 checks. All nine native Windows/Linux/macOS Intel jobs have now passed. |
| CI source | Pinned read-only workflow prepared; inherited privileged/unpinned workflows archived under community/upstream-workflows. CI configuration preparation is not evidence of Windows execution. |

## Prerelease scope and remaining gates

- **Security patch review:** inspect the independent rich-text change and regression evidence, decide coordinated upstream disclosure before making public security claims. No report was sent and no new CVE was claimed. Broader fuzzing and independent review remain ongoing work.
- **Date behavior:** document explicit UTC/serial/string date workflows and the observed local-time failures. These observations match CDN 0.20.3 and are excluded from current parser fixing scope. Preserve tested workflow guidance and disclose inherited behavior.
- **Native platforms:** native Windows/Linux x64/macOS Intel CI has passed on the recorded Node versions. Docker x64 is emulation, not native hardware validation. macOS ARM64 results cannot substitute for Windows.
- **Reproducibility and final bytes:** Clean builds after the final rich-text/CRLF change reproduced all 12 outputs byte for byte. Final macOS Node 24 CJS and ESM suites each passed 37,313 tests, with one inherited pending test and zero failures. Compare the final scoped archive's runtime files, not only the earlier unscoped archive. Preserve source/input hashes and current advisory pedigree; a renamed scope must not conceal upstream advisories.
- **Ownership/setup:** npm reauthentication/scope verification, security settings, release protections and publisher configuration remain unperformed external setup. No npm permission was inferred from GitHub identity.
- **Known compatibility:** CP895 byte 8D now maps to ĺ; use CP895_COMPATIBILITY.md. The inherited single pending CSV-date test remains pending. Historical Node >=0.8 and universal legacy-host claims are removed.

A public release candidate may carry clearly disclosed noncritical limitations, but requires an explicit maintainer decision on these concrete findings and ownership gates. A stable release needs the broader advertised platform/workflow coverage. There is no automated bypass to private:true or the publish guard.

## Current scope decision

Timezone and resource-budget observations were reproduced on the official CDN artifact with identical date outputs. They are inherited limitations, not fork regressions and not required parser fixes for this release. Preserve their documentation. Additional HTML/CSV/mapping changes and upstream credit are enumerated in UPSTREAM_DIFFERENCES.md. Native CI will identify fork regressions; npm publishing stays disabled.

## Release workflow preparation

The ngbootstrap pattern is implemented in .github/workflows/publish.yml: version tags, pinned Node/npm, tests and reproducible builds, tag/package checks, exact archive inspection, OIDC/provenance and the npm-production environment. The environment requires angular-bootstrap approval. Publication is still hard-disabled and npm trust is not configured. See community/release/PUBLISHING.md for validation-only use and the separate activation checklist.
