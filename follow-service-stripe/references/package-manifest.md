# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `stripe` |
| Registry | `npm` |
| Latest Version | `22.6.2` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Stripe |
| License | `MIT` |
| Repository | `https://github.com/stripe/stripe-node` |
| Website | `https://stripe.com/` |
| Documentation | `https://docs.stripe.com/api?lang=node` |
| Releases / Changelog | `https://github.com/stripe/stripe-node/releases` |

## Install

```bash
bun add stripe
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@stripe/stripe-js` | `npm` | `9.16.0` | Client-side SDK for checkout redirects and elements |
| `stripe` (CLI) | `system` | `unknown` | Webhook forwarding in dev — install via `mise use -g stripe` or `scoop install stripe` |

## Notes

- Breaking changes in latest major: each major tracks a Stripe API version — pin the API version in account settings; webhook signature verification via `constructEvent` is mandatory
- Version pinned in SKILL.md: `stripe@22.6.2`, `@stripe/stripe-js@9.16.0`
