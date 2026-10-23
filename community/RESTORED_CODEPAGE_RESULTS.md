**Follow-up compatibility matrix:** see NODE_BUNDLER_RESULTS.md for Node 22/24/26 full suites, common bundler execution and the documented support policy. CP895 migration guidance is in CP895_COMPATIBILITY.md. Earlier runtime/bundler gaps below are superseded for this tested matrix.

# Restored legacy codepages — October 23, 2026

**All 32 original bundled codepage IDs are present again. Publishing remains disabled.** The restoration uses pinned licensed sources instead of the original untraceable local/generated inputs. The historical omission and CP620-failure reports are preserved, but superseded for the current candidate.

## Sources and compatibility

| Codepage | Verified source | License and behavior |
|---|---|---|
| 620 (Mazovia) | VitaliyOliynyk/mazovia-charset commit 0603a6fad2abc568bd49fd9cce3636838a6a032a, MazoviaCharset.java substitutions and README's CP437 definition | Apache-2.0 substitutions over Unicode-3.0 CP437; all 256 decode entries match old SheetJS exactly |
| 895 (Kamenický / KEYBCS2) | jceska/KamenickyEncoding commit 854abe0cd8bdc3f04dfdffe96fca7e752e56a964, CharMapping.cs | MIT substitutions over Unicode-3.0 CP437; byte 8D intentionally changes from old U+01EA to the source's U+013A (ĺ) |
| 10008 (Windows-compatible Mac Simplified Chinese) | unicode-org/icu-data commit bae5ca647fa41703393dbf00240ec1b807a9c353, windows-10008-2000.ucm | Unicode-3.0; 7,613 exact roundtrip mappings match the old table |

For 895, the replacement implementation labels its remaining ranges CP437 but contains a block-glyph typo at DD. Those ranges are regenerated from the authoritative Unicode CP437 input, giving U+258C at DD. This preserves the old SheetJS value rather than importing that typo. Its 8D correction is a real behavior change and needs a migration note. This project uses 895 as the historical Czech alias; it is not IBM's unrelated Japanese codepage 895.

For 10008, only UCM `|0` roundtrip rows are imported. The single reverse fallback (`|3`) from A1AC to U+2225 is not imported; U+2225 retains its exact A1CE encoding. No best-fit alias is silently added. This is the Windows-compatible mapping profile used by the old SheetJS addon, not a claim that every Apple-specific encoding variant is identical.

Licenses and source notices are retained in LICENSES/Mazovia-Apache-2.0.txt, Kamenicky-MIT.txt and ICU-data-Unicode-3.0.txt, with source-specific attributions in MAPPING_DATA_NOTICES.md. Snapshot commits, file names and SHA-256 values are in community/mapping-inputs/restoration-sources/sources.json. Package metadata includes Apache-2.0, Unicode-3.0 and MIT. This verifies the explicit source/license grants used for these replacements; it is not blanket legal clearance of every repository component.

## Additional compatibility fix

The browser import test exposed a pre-existing CSV path defect: `type:'array'` data was converted to a string without applying the requested legacy codepage. Buffer imports already decoded it. The independent change in bits/40_harb.js decodes those array bytes using the loaded codepage addon, after the existing UTF-8/BOM handling. An unpatched upstream control reproduces the mismatch. The fix is rebuilt into CJS, ESM, mini, full/core/mini minified and ExtendScript outputs.

Initial browser failures and diagnostic logs remain preserved. Requesting explicit encode output format did not resolve the parser defect; it was fixed in the parser. The final real-browser runs use explicit byte arrays and test actual decoded cell values.

## Test evidence

- 150,098 decode-table checks and 149,282 encode-table checks passed across CJS and ESM addons, against the licensed raw/derived inputs.
- 79 focused groups passed: restored encoding roundtrips, six parser builds using Buffer/array/binary CSV inputs, UTF-8/BOM/default-path checks, and an unpatched upstream control. CP895 correction and 10008 fallback policy are asserted explicitly.
- The existing 24 security/compatibility groups, 630 HTML hyperlink assertions and nine HTML writer/stream/control checks pass.
- Real Chrome, Firefox and WebKit each pass 27 groups with zero failures and one not-applicable case. Restored encodings are imported through all four browser variants (12 restored-encoding imports per engine).
- TypeScript upstream fixture and strict CJS/ESM consumer checks pass.
- Two fresh isolated builds reproduce all 12 checked distribution outputs, including CJS/ESM mapping addons and minified shim, byte for byte.

**Final full upstream suites: CJS and ESM each passed 37,313 tests, with one unchanged pending CSV-date test and zero failures.** Durations: 139.3 seconds CJS and 143.6 seconds ESM. The previous CP620 DBF failure is resolved. These final runs include the CSV array-input fix. Machine-readable counts are in results/release-gates.json. Detailed records are in results/restored-codepages.json, provenance-replacements.json, mapping-compatibility-diff.json, real-browsers.json, upstream-*-restored-final.json and reproducibility-patched.json. Large fixture corpora, tools and full logs are excluded from the local runtime archive.

## Reproduce and maintain

Ordinary builds are offline: build-codepages.py checks the independent source derivation, then validates the hashes of all 32 table inputs before generating addons. restore-mapping-inputs.py --check verifies the derived 620/895/10008 tables without rewriting the inputs. fetch-restoration-sources.py is an explicit network operation that restores only pinned snapshots and rejects hash mismatches. refresh-mapping-inputs.py refreshes the 29 public Unicode inputs and reapplies the separately pinned replacements. Do not update source commits or hashes without repeating license and compatibility review.

The remaining publication gates are the CP895 migration/support policy, actual legacy-host and supported Node/platform coverage, bundler/framework builds, outstanding timezone/browser integration checks, advisory/pedigree mapping, broader security/component review, independent maintainers/repository/reporting arrangements and protected publishing/provenance configuration. The inherited Node >=0.8 claim remains unverified. Neither targeted mapping verification nor the full fixture suite proves absence of unrelated defects.

private:true and the rejecting prepublishOnly hook remain enabled. No npm publication or upstream submission was performed.
