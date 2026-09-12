# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@aws-sdk/client-s3` |
| Registry | `npm` |
| Latest Version | `3.1131.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | AWS |
| License | `Apache-2.0` |
| Repository | `https://github.com/aws/aws-sdk-js-v3` |
| Website | `https://aws.amazon.com/` |
| Documentation | `https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/` |
| Releases / Changelog | `https://github.com/aws/aws-sdk-js-v3/releases` |

## Install

```bash
bun add @aws-sdk/client-s3
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@aws-sdk/client-*` | `npm` | `3.1131.x` | Other modular v3 service clients (DynamoDB, Lambda, etc.) share the same release train |
| `aws-sdk` | `npm` | deprecated | v2 monolith — end-of-support, do not install |

## Notes

- Breaking changes in latest major: v3 is fully modular — install only the `@aws-sdk/client-*` packages needed; `aws-sdk` v2 is deprecated
- Version pinned in SKILL.md: `3.1131.0`
