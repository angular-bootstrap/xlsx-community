**Current restoration:** codepages 620, 895 and 10008 have been restored from pinned Apache-2.0, MIT and Unicode-3.0 sources. See MAPPING_DATA_NOTICES.md and community/RESTORED_CODEPAGE_RESULTS.md. Earlier omission/provenance statements below describe historical artifacts.

# Bundled-component notices and review status

**Current follow-up:** the two historical shim snippets have been replaced with independently authored Apache-2.0 code; the 29 retained mapping tables have been regenerated from current hash-locked Unicode sources, with Unicode-3.0 and source headers retained in MAPPING_DATA_NOTICES.md. Unverified mappings 620, 895 and 10008 have been removed. Historical gaps below describe the original baseline and are superseded for the current shipped artifacts. See community/PROVENANCE_REPLACEMENT_RESULTS.md.

Added October 23, 2026 for the independent local candidate. This document supplements, and does not replace, the original LICENSE and dist/LICENSE. It is an inventory and attribution record, not blanket legal clearance. Existing copyright headers and upstream notices are retained.

| Component family | Source evidence | Retained license text |
|---|---|---|
| SheetJS Community Edition | Tagged upstream source and package metadata | LICENSE and dist/LICENSE, Apache-2.0 |
| CFB | Embedded 1.2.2 identifier and SheetJS copyright in bits/18_cfb.js; upstream-adapted copy | LICENSES/cfb-Apache-2.0.txt |
| CRC32 | Embedded 1.2.0 identifier; Copyright (C) 2014-present SheetJS | LICENSES/crc32-Apache-2.0.txt |
| SSF / fraction formatter | bits/10_ssf.js; packages/ssf identifies source lineage 0.11.3 | LICENSES/ssf-Apache-2.0.txt |
| codepage / cpexcel | Bundled version 1.15.0; CJS addon matches official package artifact | LICENSES/codepage-Apache-2.0.txt |

License texts were retained verbatim from integrity-verified npm component artifacts, except SSF's text, which comes from the tagged source repository. SSF 0.11.3 is a repository version with no corresponding published npm artifact found; no registry-artifact identity is implied. Embedded copies may contain upstream modifications and are not automatically equivalent to standalone npm packages. Exact file hashes, collection sources and caveats are in community/results/component-inventory.json and component-license evidence.

## Unresolved attributed sources in the compatibility shim

The upstream shim.js, included in dist/xlsx.extendscript.js, attributes an Object.keys polyfill to:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

and a getComputedStyle polyfill to:

https://gist.github.com/8HNHoFtE/5891086

The gist returned 404 during review. MDN's published licensing policy distinguishes code added before August 20, 2010 (MIT) from later samples (CC0). The exact historical revision/date and attribution for this copied snippet have not been established. These are provenance gaps requiring resolution or replacement before release; no infringement conclusion is asserted. Preserve these references until the relevant code is replaced or its rights are documented.

Policy source: https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license

## Data/template inputs and build tools

The Numbers payload is generated from the tracked modules/test.numbers fixture; its decoded bytes match that input. It is distributed under the upstream repository's license declaration. The codepage project identifies mapping data from multiple external sources, including Unicode; their historical data-license/notice chain has not been exhaustively traced. Current package-level Apache declarations do not substitute for that provenance review.

UglifyJS and source-map are build tools, not bundled runtime libraries. Their toolchain licenses and lockfile are kept in local review evidence. This independent candidate is not endorsed by those projects or by SheetJS, and the license does not grant general trademark rights.

## Follow-up evidence

The codepage 1.15.0 source commit is 6d1f7cc2d6e58dfeca32f352864f98752728373d. Its Excel manifest contains 32 entries: 29 Unicode URLs and three entries without URLs (620, 895, 10008), requiring separate generated/local-source tracing. The bundled ESM codepage artifact exactly matches upstream commit d5f23335d5335ee7d241b6c9e7f2ea124a07f616; its generator recipe has been located. Pinned manifests, scripts and hashes are retained locally under community/results/codepage-provenance.

LICENSES/Unicode-current-reference.txt retains the current Unicode license text from https://www.unicode.org/license.txt. It is supplemental provenance evidence; it does not establish applicability to every historical mapping or clear third-party rights. The earlier historical snippet and data-source gaps remain open.
