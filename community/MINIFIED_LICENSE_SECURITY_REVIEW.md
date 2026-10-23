# Minified build, bundled licenses and security review

Historical pre-fix review. Subsequent shim/data replacements are documented in PROVENANCE_REPLACEMENT_RESULTS.md. See HTML_FIX_RESULTS.md for the subsequently applied HTML-output fix and current candidate status.

Reviewed October 23, 2026. **Ready for engineering review; blocked for publication.** Publishing remains disabled by `private: true` and the rejecting `prepublishOnly` hook. No parser or distributed runtime bytes were changed during this review.

## Results

| Check | Result | Evidence |
|---|---|---|
| Two fresh distribution builds | PASS: all ten outputs match each other and the candidate byte for byte | results/reproducibility.json |
| Known prototype-pollution and ReDoS regressions | Prior targeted tests pass, with affected controls reproducing the defects | results/verification.json |
| Bundled component inventory | Recorded SheetJS CE, CFB, CRC32, SSF, codepage, compatibility shim and Numbers template; incomplete provenance remains | results/component-inventory.json |
| License retention | Original licenses retained; four component license notices added verbatim | ../LICENSES/ and ../THIRD_PARTY_NOTICES.md |
| Active hyperlink schemes in HTML output | FAIL: eight safe-output assertions across CJS/full/core/mini | results/html-link-review.json |
| Current advisory queries | Two existing xlsx advisory matches; no matches for the five other queried component/tool identities | results/bundled-osv.json |
| Pinned build-tool npm audit | No reported matches for this tool installation; not a runtime security certification | results/build-tool-audit.json |

## Reproducibility scope and initial failures

`reproduce-dist.py` exports upstream commit `8a7cfd47bde8258c0d91df6a737bf0136699cdf8` into two fresh temporary directories and deletes the ten outputs before generating them. Tools are pinned to @sheetjs/uglify-js 2.7.3, codepage 1.15.0 and source-map 0.5.7, with the installation lock retained in results/repro-tools-lock.json. Node is 24.16.0.

The unmodified legacy command initially fails with ERR_INVALID_ARG_TYPE: its minifier passes a SourceMap object to fs.writeFileSync. A narrowly scoped build-only preload, legacy-sourcemap-fs.cjs, restores the historical object-to-string conversion. The next attempt exposed a missing Numbers prerequisite; generating modules/xlsx.zahl.js from the tracked modules/test.numbers resolves it. Neither adaptation changes the minifier or parser source. Logs preserve both failures and successful clean runs. The initial failed-build comparison is explicitly marked invalid evidence in results/rebuild-first.json.

Verified outputs: full/core/mini minified JavaScript and their three maps, ExtendScript, both Numbers helpers, and CJS cpexcel (ten files). The decoded Numbers payload also matches the tracked template. This does not reconstruct the standalone ESM cpexcel generator, original external Unicode mappings or original historical release environment. The unchanged ESM cpexcel artifact remains traceable to the upstream tag. Reproduce locally with `python3 community/reproduce-dist.py` after restoring its pinned tool paths.

## Security finding requiring action

The baseline retains a javascript: target in sheet_to_html output. Supplying sanitizeLinks: true has no effect because that option is absent in 0.20.3. All eight assertions against a proposed safe-output policy fail. The test inspects an inert marker string; it does not render or execute the link. Exposure depends on an application rendering untrusted workbook HTML and a user following the link; this is not execution merely from parsing a workbook, and no new CVE is claimed.

Later upstream commit [d2f2e179](https://git.sheetjs.com/sheetjs/sheetjs/commit/d2f2e179636be22f3af3c306df7783ea10a2c7e3) adds an opt-in sanitizeLinks option. That change is a starting point for review, not evidence that every unsafe URL form is handled or that defaults are safe. Before release, define the HTML URL policy, implement or backport it consistently across CJS/ESM/browser builds, and test allowed URLs, active schemes and normalization edge cases. No such patch has been applied yet.

The two [OSV](https://osv.dev/) xlsx matches are [GHSA-4r6h-8v6p-xvw6](https://osv.dev/vulnerability/GHSA-4r6h-8v6p-xvw6) and [GHSA-5pgg-2g8v-p4x9](https://osv.dev/vulnerability/GHSA-5pgg-2g8v-p4x9). Their formal npm ranges start at zero without a fixed event, while descriptive/last-known-affected fields identify boundaries below 0.19.3 and 0.20.2. Our regression evidence supports these specific fixes, but the query still flags 0.20.3. Retain upstream pedigree and explain this distribution/range mismatch; do not suppress advisories or use a new package name to claim safety. The [vendor advisory index](https://cdn.sheetjs.com/advisories/) lists those two CE advisories at review time. Source database attribution is preserved in saved records.

Queries with no matches covered cfb 1.2.2, crc-32 1.2.0, codepage 1.15.0, ssf 0.11.3 and @sheetjs/uglify-js 2.7.3. SSF 0.11.3 is an unpublished repository lineage, and embedded libraries can be modified copies. Name/version lookup is limited evidence, not a complete source audit, SBOM validation or proof of no vulnerabilities. Broader fuzzing, archive/resource exhaustion and all output-injection paths remain unverified.

## License and provenance blockers

Root LICENSE and dist/LICENSE are unchanged. Component notices were collected from integrity-verified npm tarballs, with SSF taken from the tagged source because npm has no 0.11.3 artifact. No separate NOTICE entries were found in those collected tarballs; that limited observation is not an exhaustive absence claim. CRC32's short Apache notice is retained alongside the complete Apache text already shipped.

Two compatibility-shim snippets need historical provenance: the MDN Object.keys sample has no established copied revision/date, and the attributed getComputedStyle gist returns 404. [MDN policy](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license) distinguishes pre-August-20-2010 MIT samples from later CC0 samples. Resolve the exact rights/attribution or replace the snippets before publication. No infringement conclusion is asserted. The historical external mapping-data license/notice chain in codepage also remains incomplete. Details and attribution links are retained in THIRD_PARTY_NOTICES.md.

## Release decision

The local candidate is reviewable, but publication remains blocked by HTML-output handling, unresolved snippet/data provenance, accurate advisory/pedigree records and the remaining supported-runtime, bundler and release-governance gates in RELEASE_CHECKS.md. Prior full CJS/ESM suites each passed 37,313 tests with one upstream pending case; TypeScript and the three real-browser checks also passed. Those results do not override the findings above. Runtime bytes remain unchanged, so those earlier results still apply to this local archive.
