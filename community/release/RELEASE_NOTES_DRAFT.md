# Draft release notes — not published

The next version and release date require approval. npm remains the distribution registry; no GitHub Packages publication is planned.

This independent community distribution builds on SheetJS Community Edition 0.20.3, including upstream fixes for CVE-2023-30533 (prototype pollution) and CVE-2024-22363 (regular-expression denial of service). Credit these fixes to upstream; do not imply the development dependency cleanup introduced the parser fixes.

Since the bootstrap release, repository-only tooling was updated to address serializer, esbuild and Vite advisories. Compatibility corrections preserve supported CLI typings, HTML hidden-row tests and Angular TypeScript peer requirements. Production workbook parser bytes are unchanged by this cleanup.

Include the final native CI links, release archive checksum, documented compatibility limits and verified npm OIDC provenance attestation when preparing an approved new release. The bootstrap `0.1.0-rc.1` has no GitHub OIDC provenance attestation. See NEXT_RELEASE.md. This draft does not authorize a tag, GitHub Release or npm publication.
