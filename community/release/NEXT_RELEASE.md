# Next release: OIDC provenance attestation

The next approved version must be published through `.github/workflows/publish.yml` using npm trusted publishing and an **OIDC provenance attestation**. `0.1.0-rc.1` was the interactive bootstrap release and has no GitHub OIDC provenance attestation. Preserve that distinction in release notes.

Before publishing:

- Obtain approval for the new version; this checklist does not authorize publication.
- Verify the npm trusted publisher matches `angular-bootstrap/xlsx-community`, `publish.yml`, environment `npm-production`. The initial configuration was created October 23, 2026. npm expires configurations that do not complete their first successful OIDC publish within two days; recreate an expired configuration using account 2FA. Do not silently fall back to a stored npm token or an interactive publish.
- Require passing native/security/compatibility checks, reviewed license provenance, reproducible builds and the exact archive checksum. Refresh native evidence when runtime/types/API metadata changes.
- Use a new matching version tag and the protected environment's owner approval. Do not retry the already published bootstrap version.

After publishing:

- Verify public availability after npm's publish-time scan, the registry tarball checksum and a clean installation.
- Verify the registry's provenance attestation and npm provenance link identify the expected GitHub repository, workflow, source commit/ref and published artifact. The `--provenance` flag or a green workflow alone is insufficient evidence. Record the verified attestation link and integrity in public release evidence.
- Verify the actual dist-tags. The bootstrap was automatically assigned both `latest` and `next`; npm rejected deleting `latest` with E400. Do not describe the prerelease as stable or claim a tag change succeeded without checking the registry.
- Update README, supported-version policy and release notes with the actual results. Keep upstream CVE fixes separately credited from independent changes.

References: https://docs.npmjs.com/trusted-publishers/ and https://docs.npmjs.com/generating-provenance-statements/.
