# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `jose` |
| Registry | `npm` |
| Latest Version | `6.2.12` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Filip Skokan` |
| License | `MIT` |
| Repository | `https://github.com/panva/jose` |
| Website | `https://github.com/panva/jose` |
| Documentation | `https://github.com/panva/jose/tree/main/docs` |
| Releases / Changelog | `https://github.com/panva/jose/releases` |

## Install

```bash
bun add jose
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| (none) | — | — | WebCrypto-only — no runtime deps; works on Node/Bun/Cloudflare Workers without polyfill |

## Notes

- Breaking changes in latest major: `v6 requires Node >=20, WebCrypto-only (key import/generate return CryptoKey not KeyObject), createRemoteJWKSet uses fetch, removed secp256k1 JWS and RSA1_5 JWE, PEMImportOptions → KeyImportOptions`
- Version pinned in SKILL.md: `jose@6.2.12`
