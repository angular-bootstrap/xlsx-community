**Subsequent restoration:** see RESTORED_CODEPAGE_RESULTS.md for restored codepages 620/895/10008 and current full-suite results. Omission-related failures below are historical.

# HTML hyperlink fix and follow-up review — October 23, 2026

Subsequent shim/data replacements and current results are documented in PROVENANCE_REPLACEMENT_RESULTS.md.

**Local engineering review: ready. Publication: blocked and disabled.** This supersedes the pre-fix HTML finding in MINIFIED_LICENSE_SECURITY_REVIEW.md. The independently modified source is bits/79_html.js. CommonJS, ESM, mini, minified bundles, maps and ExtendScript were regenerated. Parsing behavior was not intentionally changed. Runtime version remains upstream 0.20.3; independent package version is 0.20.3-community.0.

## Behavior change

HTML export now applies an unconditional URL allowlist before escaping the href attribute. HTTP, HTTPS, mailto and relative references are allowed. Other explicit schemes, protocol-relative URLs, backslashes, ASCII whitespace/control characters and C1 controls are rejected. Blocked links become ordinary cell content; cell text is preserved. Existing fragment-only references remain unlinked, matching upstream behavior. sanitizeLinks true/false cannot disable the policy and is not added as a supported API option.

Compatibility impact: file:, ftp:, custom application schemes, URLs with literal spaces, and protocol-relative links no longer produce anchors. Encode spaces or provide an explicit allowed URL where appropriate. This is intentionally stricter than upstream's later opt-in javascript-only filter. Allowed destinations are not certified trustworthy; consumers still own navigation policy. Rich cell.h markup and caller-supplied header/footer HTML remain outside this fix and must be trusted or sanitized by the application. This is not a general HTML sanitizer.

## Verified results

| Check | Result |
|---|---|
| Inert URL regressions | 630 assertions passed: 30 cases × three option combinations × seven build variants |
| Variants | CJS, browser-global unminified mini, full/core/mini minified, ExtendScript in a VM, ESM |
| Output path coverage | 9 checks passed: unpatched upstream reproducer plus CJS/ESM write-to-HTML and stream-to-HTML with safe/blocked targets |
| Real Chrome / Firefox / WebKit | Each: 23 groups passed, zero failed, one not applicable; includes 360 hyperlink assertions per engine |
| Existing targeted regression harness | 24 groups passed, zero failed, including affected controls for the two known CVEs |
| Full upstream CJS suite after patch | 37,313 passed, one pending, zero failed; 130.4 seconds |
| Full upstream ESM suite after patch | 37,313 passed, one pending, zero failed; 130.7 seconds |
| TypeScript | Upstream TS 5.6.3 and strict TS 5.9.3 CJS/ESM consumer checks passed |
| Patched clean builds | Two isolated source-plus-patch reconstructions: all ten distribution outputs match the candidate byte for byte |

Cases cover mixed-case active schemes, leading whitespace, embedded tabs/newlines/NUL, data/vbscript/file/blob/custom schemes, backslashes, protocol-relative paths, allowed URLs and relative paths, encoded/entity-looking strings, attribute escaping and invalid target types. Real browsers inspect the inert emitted DOM and resolved link protocols; no unsafe URL is followed or executed. The unpatched upstream control confirms the original active href was emitted. ExtendScript is tested in a JS VM, not an Adobe host. Mini source is a browser-global target: directly requiring it under Node fails in unchanged upstream code (set_readable absent); its global loading path passes.

One upstream CSV-date case remains pending in both full suites, as before. Browser results are engine/version-specific on macOS ARM64. This does not validate all legacy hosts or every Node version. Detailed evidence: results/html-link-review.json, html-paths.json, real-browsers.json, verification.json, typescript.json, upstream-*-patched.json and reproducibility-patched.json. Large suite logs/corpus and test toolchains are excluded from the runtime archive.

## Build issues encountered

The checkout's temporary test-tool symlink did not contain codepage; the dist target initially failed copying it. Copying the exact pinned 1.15.0 artifact from the separate build tool installation resolved that prerequisite. The Numbers helper prerequisite was generated from the tracked template. Modern Node still needs the documented build-only SourceMap compatibility adapter. Both fresh reproductions restore the complete pinned build tool directory and generate prerequisites; these failures are retained in patched-build.log, not counted as successful builds. The upstream 0.20.3 runtime version bit was explicitly held fixed while building; independent version policy remains a release gate.

## License provenance progress and open items

The exact codepage release commit was located: [6d1f7cc2](https://github.com/SheetJS/js-codepage/commit/6d1f7cc2d6e58dfeca32f352864f98752728373d). There is no v1.15.0 tag on the queried GitHub remote. Saved manifests/documentation are pinned to that commit, with hashes. The 32-entry Excel mapping manifest identifies 29 Unicode URLs and three local/generated entries (620, 895, 10008), narrowing the data-source tracing work.

The bundled ESM cpexcel bytes exactly match [d5f23335](https://github.com/SheetJS/js-codepage/commit/d5f23335d5335ee7d241b6c9e7f2ea124a07f616), which introduced its ESM generator and recipe. This closes the artifact-origin uncertainty; end-to-end regeneration from original external mapping data remains unverified. The current Unicode license text is retained verbatim as a supplemental reference, not retroactive clearance for every historical or third-party input.

Historical input rights/notice applicability still need confirmation, particularly local/generated mapping sources. The deleted getComputedStyle gist and exact historical MDN Object.keys sample revision are still unresolved. No infringement is asserted. Existing attributions and licenses remain intact. Resolve those rights/attributions, or replace the affected snippets with documented independently authored implementations and validate legacy compatibility before publication.

## Remaining publication blockers

- Historical shim and mapping-data provenance/notice chain.
- Upstream advisory pedigree and accurate scanner mapping; renaming does not establish safety.
- Supported Node/platform claims (inherited >=0.8 is unverified), bundler/framework builds and outstanding browser integration/timezone coverage.
- Independent identity, repository, responsible maintainers, security reporting and protected release/provenance process.
- Broader parser/resource-exhaustion and rich-HTML security review; targeted passes are not a vulnerability-free claim.

private:true and the rejecting prepublishOnly hook remain in place. Nothing was published, uploaded or submitted upstream. Upstream's contributor restrictions remain preserved; this independent patch has not been offered under anyone's contributor attestation.
