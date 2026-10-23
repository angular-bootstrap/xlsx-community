> Historical matrix before the rich-text/CRLF patch. See [current release results](ANGULAR_BOOTSTRAP_RELEASE_RESULTS.md) for final-byte reruns and remaining gates.

# Node and bundler compatibility — October 23, 2026

**Local review: ready. Publication: disabled and blocked by the remaining gates below.** Runtime parser/exporter bytes did not change in this stage. Package metadata changed: types conditions now precede runtime import/require conditions, and the unverified Node >=0.8 claim was removed. CP895 migration guidance is in CP895_COMPATIBILITY.md.

## Node scope and results

| Runtime | Upstream CJS suite | Upstream ESM suite | Additional coverage |
|---|---|---|---|
| 22.23.4 | 37,313 passed; one pending; zero failed | 37,313 passed; one pending; zero failed | Packed CJS/ESM, bundled Node consumers, targeted security controls, file I/O and streams |
| 24.22.1 | 37,313 passed; one pending; zero failed | 37,313 passed; one pending; zero failed | Same |
| 26.12.1 | 37,313 passed; one pending; zero failed | 37,313 passed; one pending; zero failed | Same |

All six full upstream entry runs are unfiltered. The single pending test is the same unchanged upstream CSV-date case in each run; it is never counted as passed. Runtime artifacts were downloaded from the official Node distribution directory and checked against its published SHA-256 checksums; exact URLs/hashes are retained in results/node-runtime-artifacts.json. Tests ran on macOS ARM64, with a 4 GiB per-process V8 heap cap. This is not cross-OS or native-addon certification.

As of this review, Node lists 22/24 as LTS and 26 as Current. Proposed production support is the two LTS lines; 26 is a tested Current compatibility target, not a recommendation to use Current in production. Engine ranges are deliberately bounded to tested floors: `^22.23.4 || ^24.22.1 || ^26.12.1`. This does not certify older minor/patch releases or future major versions. Older unsupported/EOL majors are outside this local candidate's support policy. See [official release status](https://nodejs.org/en/about/previous-releases) and [official artifacts](https://nodejs.org/dist/index.json).

The file/stream check passes eight checks per runtime: CJS and ESM XLSX file roundtrip, JSON stream, CSV stream, and safe HTML stream. ESM explicitly injects fs and Readable using set_fs and stream.set_readable. Core/browser entry points do not imply filesystem APIs. Security regression controls are separately run under each runtime. Full suite results are in results/node-matrix.json; the packed consumer and bundle runtime results are in results/compat-runtime-final.json.

**Final runtime matrix:** all 16 builds passed with zero final warnings; all 30 Node consumer executions and 24 browser consumer executions passed. The targeted 24-group security harness passed on each runtime, and all 24 file/stream checks passed.

## Bundler configurations

Pinned toolchain: esbuild 0.28.2, webpack 5.112.2 (webpack-cli 7.2.3), Rollup 4.65.0 with node-resolve 16.0.3/commonjs 29.0.3, and Vite 8.3.5. Install scripts were disabled and tools remain outside the runtime package. Exact transitive lockfile is retained locally in results/bundler-tools-lock.json.

Each bundler builds two packed-package consumer entries (root ESM import and root CommonJS require), each for browser and Node targets: 16 builds total. esbuild/webpack/Vite use production/minified output; Rollup uses its standard resolve/commonjs pipeline without an extra minifier. Browser Node builtins are handled by the package's browser mappings and each tool's normal resolution. No package API was externalized as a substitute for bundling it. Vite's Node build uses noExternal:true; Node builtins remain host-provided where appropriate.

Each emitted consumer performs 17 assertions: seven format roundtrips, restored CP620/895/10008 CSV array imports, CP895 byte and representability checks, three hyperlink-policy checks, UTC date and formula preservation. Node executes all eight Node-target bundles plus direct packed CJS/ESM consumers on each runtime. Browser outputs are served as UTF-8 over loopback and executed in Chrome, Firefox and WebKit. These are actual runtime tests, not compilation-only checks. Results are detailed in results/bundlers.json and results/compat-runtime-final.json.

These generic consumers do not certify Angular, Next.js, React SSR hydration or every framework's plugin configuration. Browser outputs target modern engines; bundlers are not a promise of IE compatibility. Downstream distribution must also retain required license/attribution material (LICENSES/, MAPPING_DATA_NOTICES.md and THIRD_PARTY_NOTICES.md); default bundler comment extraction is not a substitute for all package-level notices.

Configuration references: [esbuild](https://esbuild.github.io/api/), [webpack targets](https://webpack.js.org/configuration/target/), [Rollup node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve), [Vite build options](https://vite.dev/config/build-options).

## Failures and warnings encountered

1. Esbuild warned that the types conditions were unreachable because they followed import/require. All export-map entries now place types first. The affected esbuild builds were repeated with zero warnings; TypeScript fixtures and strict CJS/ESM consumers still pass. Baseline warnings are preserved in results/bundlers-before-export-fix.json.
2. The Vite fixture used a legacy inlineDynamicImports option. It was updated to the current rolldownOptions/codeSplitting configuration and rebuilt. This was a test configuration warning, not a parser defect.
3. The initial HTTP fixture omitted a UTF-8 document charset and JavaScript charset header. Literal-Unicode bundles then produced syntax errors or incorrect values, while direct UTF-8 execution passed. The server now declares UTF-8 for both HTML and JavaScript. The unnecessary animation-frame result wait was removed; final checks read the synchronous test result after script load. Initial failures and diagnostics are retained in compat-browser-final-run.log; they are not reported as passing runs.

No security behavior was disabled to pass tests. Updated package metadata does not disable private:true or the rejecting prepublishOnly hook.

## Remaining release blockers

- Linux/Windows and x64 CI, actual supported legacy browser/Adobe-host decisions, and automated ongoing coverage. This matrix covers macOS ARM64 only and exact tool/runtime versions.
- Framework-specific builds, file-picker/download integration, timezone/DST matrix, and a policy for the one upstream pending CSV-date case.
- Downstream adoption of the documented CP895 correction and a version/support/migration policy. The lossless encoding guard is guidance, not automatic rewriting of application data.
- Broader parser/resource-exhaustion and rich-HTML review, accurate upstream advisory/pedigree mapping, and final component/license review. Passing these checks is not a vulnerability-free claim.
- Independent package identity/repository, responsible maintainers and reporting channel, release version policy and protected publishing/provenance workflow. Decide how to handle the inherited deprecated CLI before any public release.

Nothing was published or submitted upstream. Publishing remains disabled.
