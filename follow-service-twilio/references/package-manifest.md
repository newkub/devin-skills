# Package manifest

## Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

### Primary Package

| Field | Value |
|-------|-------|
| Package | `twilio` |
| Registry | `npm` |
| Latest Version | `6.1.1` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Twilio |
| License | `MIT` |
| Repository | `https://github.com/twilio/twilio-node` |
| Website | `https://www.twilio.com/` |
| Documentation | `https://www.twilio.com/docs/libraries/reference/twilio-node/` |
| Releases / Changelog | `https://github.com/twilio/twilio-node/releases` |

### Install

```bash
bun add twilio
```

### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `twilio-cli` | `npm` | `unknown` | Optional CLI for local webhook testing / dev |

### Notes

- Breaking changes in latest major: none documented for 6.x; use Verify API (`verify.v2`) instead of self-managed OTP
- Version is live-checked via `/deep-research` before install — do not treat this table as a pin
