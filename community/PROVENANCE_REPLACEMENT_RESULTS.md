**Subsequent restoration:** see RESTORED_CODEPAGE_RESULTS.md for restored codepages 620/895/10008 and current full-suite results. Omission-related failures below are historical.

# Shim and mapping-data replacements — October 23, 2026

**The two identified shim provenance gaps and the shipped mapping-data input gap have been addressed by replacement/removal.** The candidate remains local, publishing is disabled, and this is an engineering provenance record rather than blanket legal clearance of the entire repository. Historical baseline records remain preserved and are superseded by this report for the current shipped files.

## Changes

- Replaced the MDN-attributed Object.keys snippet with an independently authored Apache-2.0 implementation for the ES3/ES5 compatibility path. It enumerates own properties and handles legacy shadow-name enumeration behavior.
- Replaced the unavailable-gist getComputedStyle snippet with an independently authored Apache-2.0 currentStyle adapter. It returns a separate object per call, handles property-name conversion and float, preserves native implementations, and does not attach per-element state to window. Missing properties return an empty string; pseudo-elements explicitly throw. This is a minimal legacy adapter, not a complete CSS engine.
- Regenerated 29 bundled mapping tables from freshly downloaded Unicode files. Every input URL, retrieval time, byte size and SHA-256 is recorded in community/mapping-inputs/lock.json. The build verifies hashes and performs no network access. Source headers, including attribution, are retained in MAPPING_DATA_NOTICES.md, alongside LICENSES/Unicode-3.0.txt.
- Removed mappings 620, 895 and 10008 because their historical local/generated inputs could not be verified. No allegedly equivalent replacement was substituted. Direct addon decode requests for these codepages now throw. Applications depending on them need verified replacement tables before migration; parser-wide handling of unsupported encodings has not been exhaustively certified.
- Retained Apache-2.0 generator/utility code from pinned js-codepage commit d5f23335d5335ee7d241b6c9e7f2ea124a07f616, with hashes and license in community/codepage-tools/ORIGIN.json. The regenerated addon identifies itself as 1.15.0-community-unicode. Package license metadata now describes the Apache-2.0 code and Unicode-3.0 data together.

The fresh data is governed by the current published Unicode terms: computer data files under Public are Unicode Data Files and use Unicode License v3 unless otherwise indicated. The input headers were retained and inspected for source-specific terms. This avoids relying on an unproven historical acquisition chain. It is not a claim that Unicode has relicensed every historical or unrelated third-party artifact. The mapping directory itself warns that these tables are archival and may not match modern platform behavior.

Sources: [Unicode terms](https://www.unicode.org/copyright.html), [Unicode License v3](https://www.unicode.org/license.txt), [mapping directory notes](https://www.unicode.org/Public/MAPPINGS/ReadMe.txt). Local snapshots and raw inputs are retained for review and offline rebuilds. No unverified mapping bytes remain in the newly shipped addon or full bundle; original upstream Git history and historical evidence are retained locally for traceability.

## Verification

- All 29 retained tables match the prior bundled tables exactly. The only mapping-table compatibility changes are the three omitted codepages; see results/mapping-compatibility-diff.json.
- 133,848 decode-table and 133,032 encode-table checks passed across CJS and ESM addons, comparing against the new raw inputs. Removed-codepage addon calls throw.
- 44 shim assertions passed against source and minified forms, including simulated legacy shadow enumeration, native preservation, property lookup, live values and isolation between elements. Real IE and Adobe/ExtendScript hosts are not certified by these VM checks.
- Existing security/compatibility harness: 24 groups passed. HTML hyperlink checks: 630 assertions plus nine writer/stream/control checks passed.
- Real Chrome, Firefox and WebKit: each passed 23 groups with zero failures and one not-applicable case; each includes 360 inert hyperlink assertions.
- TypeScript fixture and strict CJS/ESM consumer projects passed.
- Two isolated offline builds reproduce all 12 checked outputs, including the new CJS/ESM addons and minified shim, byte for byte. Inputs are hash-locked; only the explicit refresh script uses the network.

**Full unmodified upstream suites: each has 37,312 passes, one pending and one failure.** The failing DBF test (Ś╫êëτ⌡ś and Š╫ěéτ⌡š) requires omitted codepage 620 and now throws `Unrecognized CP: 620`. This expected compatibility loss is retained as a failing test and a publication blocker, not suppressed or counted as passed.

Full upstream suite results and the final archive verification are recorded in results/release-gates.json and results/packed-consumer.json. The exact candidate runtime hashes are recorded there and in component-inventory.json. Tests do not establish the absence of unrelated security defects.

## Remaining blockers

1. The full upstream suites are not green: the CP620 DBF case fails in both. Reduced support for codepages 620, 895 and 10008 needs an explicit supported-encoding/migration policy. Reintroduce them only from a verified licensed source, with compatibility tests. Never silently alias them to other encodings.
2. Actual legacy IE/Adobe-host behavior and the inherited Node >=0.8 claim are unverified. Framework/bundler builds, timezone/DST coverage and some browser integration paths also remain open.
3. Upstream advisory pedigree/scanner mapping, broader resource-exhaustion/rich-HTML review, independent identity, maintainers, security reporting and protected publishing/provenance setup remain required.
4. The focused shim and mapping work is complete for the current artifacts; it does not replace a comprehensive legal/component audit of every unrelated source or bundled template.

No content was published or submitted upstream. private:true and the rejecting prepublishOnly hook remain enabled.
