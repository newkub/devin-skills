| key | value |
|---|---|
| package | `@argos-ci/playwright` (dev dependency; `@argos-ci/core` is its transitive engine) |
| install | `bun add -d @argos-ci/playwright` |
| version | 7.7.1 (npm latest, verified 2026-10-20) |
| license | MIT |
| engines | Node >= 22 |
| docs | https://argos-ci.com/docs/reference/playwright |
| repo | https://github.com/argos-ci/argos-javascript (SDK) · https://github.com/argos-ci/argos (platform, MIT) |
| auth | `ARGOS_TOKEN` CI secret; GitHub Actions can use OIDC tokenless auth |

| api | description | signature/example |
|---|---|---|
| `argosScreenshot(page, name)` | capture + register a screenshot from a test | `await argosScreenshot(page, "homepage")` |
| reporter | Playwright reporter that uploads to Argos | `["@argos-ci/playwright/reporter", options]` |
| `createArgosReporterOptions(options)` | typed reporter options | `createArgosReporterOptions({ uploadToArgos: !!process.env.CI })` |
| `uploadToArgos` | gate uploads to CI only | local runs stay local |
| screenshots dir | where captures are written before upload | `./screenshots` (gitignore it) |
| baseline source | resolved from Git history, not committed PNGs | first default-branch run creates it |
| review model | PR check with approve / request-fix | approved builds become baselines |
| CI entry | `bunx playwright test` with the token set | no separate upload command needed |
