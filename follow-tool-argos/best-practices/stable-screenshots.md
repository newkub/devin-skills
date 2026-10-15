# Argos Visual Testing — Best Practices

Patterns verified against argos-ci.com docs (Playwright quickstart, flakiness guides) and the MIT platform repo `argos-ci/argos`.

## 1. Stabilize Text Rendering First

- Always pass `--disable-lcd-text --font-render-hinting=none` in `launchOptions` — the single biggest source of machine-vs-CI diffs
- Pin the browser: run screenshots only in CI on the same `ubuntu-latest` + pinned Playwright version

## 2. Make Every Pixel Deterministic

- Freeze clocks (`clock` fixtures / `page.clock`) for dates; seed fixed datasets; hide or stub avatars/ads/random content
- Wait condition: `argosScreenshot` already waits for fonts, images, and `aria-busy` — prefer marking loaders with `aria-busy` over manual timeouts
- If a diff appears only on re-run, it is a test bug: fix the source, don't approve the build to make it go away

## 3. Coverage Strategy

- Screenshot per visual state, not per test: same route × (logged-out, logged-in, empty, error, loading)
- Component-level coverage belongs to Storybook (`/follow-tool-storybook` + Argos Storybook SDK) before full-page counts balloon
- Responsive matrix via Playwright projects (mobile/tablet/desktop viewports) — one naming convention across all names

## 4. Baseline Hygiene

- Nothing is committed: the baseline build comes from Git history; an approved build becomes eligible as baseline
- Merge the setup PR and let it run once on the default branch first — otherwise every PR build is `orphan` and reviews stall
- When intended design changes land, review and approve in Argos instead of deleting builds

## 5. Review Workflow With Agents

- Argos is built for AI-agent review too: agents can read the build's diff list, approve, or open fix tasks — keep human approval for release-visible changes
- Flaky-test detection: a build flagged unstable → investigate before merging anything in that PR; repeated flags route to `/check-flaky-tests`

## 6. CI Notes

- GitHub Actions: prefer OIDC/tokenless auth over a stored `ARGOS_TOKEN` secret when available
- Non-GitHub CI: pass `ARGOS_TOKEN` env or the reporter `token` option; keep secrets out of logs
- Only `pull_request` and default-branch `push` should upload — feature-branch pushes add noise

## 7. Migration

- Coming from `toHaveScreenshot()`: remove `*-snapshots/` folders from the repo, wrap existing screenshot calls with `argosScreenshot`, delete the update-snapshots job — review docs with `/update-docs` after the switch
