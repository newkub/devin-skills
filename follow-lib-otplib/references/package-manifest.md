# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `otplib` |
| Registry | `npm` |
| Latest Version | `13.5.0` |
| Release Date | `2026-08-21` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Gerald Yeo` |
| License | `MIT` |
| Repository | `https://github.com/yeojz/otplib` |
| Website | `https://otplib.yeojz.dev` |
| Documentation | `https://otplib.yeojz.dev` |
| Releases / Changelog | `https://github.com/yeojz/otplib/releases` |

## Install

```bash
bun add otplib @otplib/plugin-crypto-node
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@otplib/plugin-crypto-node` | `npm` | `13.5.0` | Node crypto plugin — enables sync APIs |
| `@otplib/plugin-crypto-noble` | `npm` | `13.5.0` | Noble crypto plugin — edge/portable sync APIs |
| `@otplib/v12-adapter` | `npm` | `13.5.0` | Temporary migration bridge from v12 only |

## Notes

- Breaking changes in latest major: `v13 is a full rewrite — preset-default/authenticator removed, async-first functional API, verify() returns {valid} object not boolean`
- Version pinned in SKILL.md: `13.5.0`
