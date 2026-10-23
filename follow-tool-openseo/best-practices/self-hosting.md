# OpenSEO Usage — Best Practices

Patterns verified against the `every-app/open-seo` README (MIT) and openseo.so docs (self-hosting, MCP, agent skills).

## 1. Pick The Right Self-Host Path

- Personal/single-machine → Docker (`docs/SELF_HOSTING_DOCKER.md`) — fastest to try, stays local
- Internet-facing, multi-device, or team → Cloudflare (`docs/SELF_HOSTING_CLOUDFLARE.md`) — the project explicitly recommends it over Railway/Coolify/Dokploy and it works on the free plan
- Don't bolt it onto a paid VPS when the Cloudflare free path fits — keep the stack at $0 + data usage

## 2. DataForSEO Spend Discipline

- Every keyword/rank/serp/backlink call is a metered DataForSEO request — estimate counts before bulk sweeps (sites × keywords × cadence) and get user approval for the budget first
- Cache results in the OpenSEO workspace (saved keywords, stored audits); re-fetch only what changed — duplicate sweeps pay twice for the same answer
- Self-hosting already skips the hosted service's ~28% per-request markup — don't reintroduce cost by wiring cron jobs with aggressive intervals

## 3. MCP Workflow Design

- Register one MCP server per self-hosted instance; give the agent project context so skills (keyword research, seo-audit, competitor-analysis) write into the right workspace
- Pre-built skills first; author custom skills only when a repeated business workflow isn't covered (`/update-dot-agents-project` for project-local skills)
- Reports live in OpenSEO — link them from PRs/plans instead of copying tables that go stale

## 4. Turn SEO Findings Into Repo Changes

- Site-audit output → map each technical issue to code: meta/structured data/canonical fixes in the app router or head manager (`/follow-lib-*` for the stack), robots/sitemap from the deploy skill (`/follow-create-web` robots step)
- Keep one tracked list per site (issue → file → status); close through `/deep-review seo then-fix`, verify with a re-crawl after deploy
- AI-visibility and rank-tracking are directional signals — decide content work from `/create-plan-in-dot-agents`, not from one noisy position change

## 5. Pitfalls

- Committing the DataForSEO key or instance `.env` — run `/check-secrets` after first setup
- Treating DataForSEO numbers as ground truth for your own site's rankings — cross-check with connected Google Search Console data where available
- Upgrading the fork blindly: it's MIT and vibe-codeable, but pull upstream before local edits diverge (`/report-diff-in-web history` on key files)
