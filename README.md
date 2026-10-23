# Independent SheetJS CE local review candidate

Modified October 23, 2026 for independent local preparation. **Not an official SheetJS release.** The selected release targets are `angular-bootstrap/xlsx-community` and `@angular-bootstrap/xlsx`; the repository is created and the npm package remains unpublished. Publishing is disabled by `private: true` and a rejecting `prepublishOnly` hook.

Candidate: `@angular-bootstrap/xlsx@0.1.0-rc.1`. Parser reports unchanged upstream `0.20.3`. The candidate inherits upstream security fixes, adds an independent default URL allowlist to the HTML exporter, and corrects CSV array input decoding for explicitly requested legacy codepages. Generated builds include this modification. Baseline: official `v0.20.3`, commit `8a7cfd47bde8258c0d91df6a737bf0136699cdf8`, from https://git.sheetjs.com/sheetjs/sheetjs.git. History is retained locally. Original README is in `README.upstream.md`; Apache-2.0 and distribution license notices are unchanged.

## Verify locally

Validated on Node 24.16.0, from this source checkout:

```sh
node community/prepare-controls.cjs
node community/verify.cjs
```

The tests generate a crafted comment fixture and run affected controls/candidate variants in fresh children with deadlines and a 256 MiB V8 heap cap. This is not a full OS sandbox. No npm install or lifecycle execution is needed. Source-only tests and affected controls are excluded from the runtime package payload.

See `community/RELEASE_CHECKS.md` for the expanded full-suite, TypeScript and real Chrome/Firefox/WebKit results, and `community/REVIEW_RESULTS.md` for initial regression details. Ready for local engineering review, not approved for public release. See `community/PROVENANCE_REPLACEMENT_RESULTS.md` for independently replaced shims and freshly sourced mapping data. **Codepages 620, 895 and 10008 are restored from pinned licensed sources; CP895 byte 0x8D now maps to ĺ.** See `community/RESTORED_CODEPAGE_RESULTS.md`. Patched distribution outputs now reproduce byte for byte in two clean builds. See `community/HTML_FIX_RESULTS.md` for the HTML fix and current results; `community/MINIFIED_LICENSE_SECURITY_REVIEW.md` preserves the pre-fix findings. The focused shim/data gaps are addressed by replacement/removal; both full upstream suites now pass 37,313 tests each, with one unchanged pending test and zero failures. See the provenance replacement report for remaining blockers. See `community/ANGULAR_BOOTSTRAP_RELEASE_RESULTS.md` for subsequent runtime/framework results and current ownership/platform gates.

The local candidate now targets Node ^22.23.4, ^24.22.1 or ^26.12.1. Node 22/24 are the proposed LTS production targets; Node 26 is a tested Current compatibility target. See `community/NODE_BUNDLER_RESULTS.md` for the precise matrix and platform limits. The inherited Node >=0.8 claim has been removed. Standard upstream Makefile tasks derive runtime version from package.json; settle independent versioning/build policy before rebuilding distributions for publication.

The upstream CONTRIBUTING.md is retained. Its AI-generated-code and contributor-attestation restrictions must be addressed before any upstream submission. This independent harness has not been submitted upstream; no personal contributor declarations have been made on anyone's behalf.

CP895 migration details and lossless export validation: `community/CP895_COMPATIBILITY.md`.

## Planned angular-bootstrap release

The proposed package is `@angular-bootstrap/xlsx@0.1.0-rc.1` in `angular-bootstrap/xlsx-community`. See [the release plan](community/RELEASE_PLAN.md) for executed checks, known timezone/resource limits, ownership setup and remaining review gates. This local candidate remains non-publishable.

See [upstream differences and credit](community/UPSTREAM_DIFFERENCES.md) for inherited behavior, additional fixes and our scope policy. Timezone and resource-limit observations reproduce on CDN 0.20.3 and are not scheduled for behavioral changes in this candidate.
