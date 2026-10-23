# CP895 compatibility and migration

The independent candidate restores the historical SheetJS alias `895` for Kamenický / KEYBCS2 Czech/Slovak text. This alias is not IBM's Japanese codepage 895. Select it only when the file's encoding is known.

| Byte | Previous SheetJS table | Candidate table |
|---|---|---|
| `0x8D` | U+01EA `Ǫ` (LATIN CAPITAL LETTER O WITH OGONEK) | U+013A `ĺ` (LATIN SMALL LETTER L WITH ACUTE) |

This is the only decode-table difference from the original bundled 895 mapping. The new value follows the pinned, MIT-licensed KamenickyEncoding implementation. Its stated CP437 baseline is used for other ranges, including `0xDD → U+258C ▌`; this preserves SheetJS behavior and corrects a block-glyph typo in the replacement source. Exact sources and retained notices are in MAPPING_DATA_NOTICES.md.

## Impact

Reading raw CP895 byte 8D now yields `ĺ`. Encoding `ĺ` now emits 8D. U+01EA `Ǫ` is no longer representable in this CP895 table; do not assume the encoder will preserve an unrepresentable character or report an error. Validate representability before export. Do not silently substitute Ǫ for ĺ globally or add a hidden alias.

Original byte files have not changed: decoding them again with this candidate applies the corrected mapping. Already-decoded application strings, JSON, database values or cached workbook cells are not automatically repaired. A JSON roundtrip alone will not exercise the old byte mapping.

## Migration procedure

1. Identify imports/exports that explicitly use codepage 895, and file families whose metadata selects it. Review sample bytes, not just rendered text.
2. Prefer re-importing original byte files with the corrected mapping. If only decoded text remains, convert old `Ǫ` values to `ĺ` only when provenance proves those specific fields came from old CP895 byte 8D. Preserve genuine Ǫ text from other encodings.
3. Export representative Czech/Slovak text and compare bytes. For each character, encode then decode using the selected codepage and require exact equality before accepting output. Repeated or unsupported-character mappings require a policy; do not count replacement bytes as successful preservation.
4. Keep an original-input backup and compare record counts, affected fields and encoded bytes before migration. Document the adopted CP895 profile in downstream release notes.

## Explicit addon checks

```js
const cp = require('sheetjs-community-candidate/dist/cpexcel');
if (cp.utils.decode(895, [0x8D]) !== '\u013A') throw new Error('Unexpected CP895 profile');
if (cp.utils.encode(895, '\u013A', 'arr')[0] !== 0x8D) throw new Error('Unexpected encoding');
function requireRepresentable(text) {
  const bytes = cp.utils.encode(895, text, 'arr');
  if (cp.utils.decode(895, bytes) !== text) throw new Error('Text is not losslessly representable in CP895');
  return bytes;
}
```

ESM consumers can import the addon as a namespace from `sheetjs-community-candidate/dist/cpexcel.full.mjs` and inject it with `XLSX.set_cptable(cp)`. Browser/core/ESM workflows must explicitly include the encoding addon when needed. The independent package name and scope are provisional; publishing remains disabled.

Regression coverage includes the corrected byte and glyph, old/new table comparison, all 32 encoding IDs, CJS/ESM addon roundtrips, DBF fixture parsing, CSV Buffer/array/binary imports and browser builds. Broader application data migrations require downstream-specific validation; no application data was changed here.
