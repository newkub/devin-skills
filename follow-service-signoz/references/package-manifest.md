# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@opentelemetry/auto-instrumentations-node` |
| Registry | `npm` |
| Latest Version | `0.80.0` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | OpenTelemetry Authors (CNCF) |
| License | `Apache-2.0` |
| Repository | `https://github.com/open-telemetry/opentelemetry-js-contrib` |
| Website | `https://opentelemetry.io/` |
| Documentation | `https://signoz.io/docs/instrumentation/opentelemetry-nodejs/` |
| Releases / Changelog | `https://github.com/open-telemetry/opentelemetry-js-contrib/releases` |

## Install

```bash
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@opentelemetry/api` | `npm` | `1.9.1` | Stable API surface used alongside auto-instrumentation |
| SigNoz (self-hosted) | `system` | `unknown` | Deployed via Docker/Foundry (`foundryctl cast`), not a package — see `https://signoz.io/docs/install/docker/` |

## Notes

- Breaking changes in latest major: `0.x` — instrumentation config may shift between minors; Bun requires `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`
- Version pinned in SKILL.md: `0.80.0`
