# Framework release fixtures

These private fixtures test the exact published `@angular-bootstrap/xlsx@0.1.0-rc.1` package from npm. They are excluded from the library archive. Lockfiles record the registry URL and artifact integrity; no local release archive is required.

In each fixture, run `npm ci --ignore-scripts`, then build Angular with `node node_modules/@angular/cli/bin/ng.js build`, React with `node node_modules/vite/bin/vite.js build`, and Next.js with `node node_modules/next/dist/bin/next build`. The validated runtime is Node 24.22.1. Next.js provides server and client checks plus `/api/workbook`; React provides upload/download controls.

Serve production output on loopback and verify Chrome, Firefox and WebKit. Set `SHEETJS_FRAMEWORK_ROOT`, `SHEETJS_PLAYWRIGHT_PATH` and `PLAYWRIGHT_BROWSERS_PATH` to run `community/run-framework-browsers.cjs` against installed production fixtures and browser engines. These framework checks are local checks, separate from hosted native CI.

Angular 22.2.4 pins Vite 8.3.0. A scoped override selects patched Vite 8.3.5; TypeScript remains 6.0.3 within Angular's declared `>=6.0 <6.1` peer range. The Angular `serve` target binds to `127.0.0.1`; start it with `node node_modules/@angular/cli/bin/ng.js serve`. The patched development server was also exercised in Chrome. Do not bypass peer compatibility with forced installation.

Vite reports a large bundle warning for the full workbook parser. Consumers should evaluate download size and loading strategy. These fixtures and their development dependencies are excluded from the scoped npm library.
