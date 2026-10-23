---
name: check-update
description: Check GitHub, registry, and blog release channels for newer versions
argument-hint: "[target...] [--channel github|registry|blog] [--include-prerelease]"
related:
  - follow-up-to-date
  - check-should-update
  - update-version-to-latest
  - keepup-source-code
  - update-agents-skills-global
  - run-install
  - deep-research
  - report

allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
---

## Goal

Report the true latest published version of each target across three channels — GitHub releases/tags, package registry, and the official blog/changelog — so update decisions rest on live evidence instead of memory

## Scope

- Use before updating a dependency, tool, or skill, before `/ship`, or whenever asked "is this current?"
- Read-only: reports versions and evidence only — never installs, upgrades, or edits a manifest
- Boundaries: methodology SSOT → `/follow-up-to-date`; dep/tool executor → `/update-version-to-latest`; local git staleness → `/check-should-update` (compares local changes, this skill compares published channels)

## Execute

### 1. Identify Targets

> Goal: know exactly which packages to check and from what baseline

1. Collect targets from the argument, the project manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `mise.toml`), or the given skill/CLI — each target is `{name, current, ecosystem, repo, docs-url}`
2. Read `current` from the lockfile/manifest or the binary's `--version` output — never from memory; unknown → mark `unknown` and continue
3. No target and no manifest → `/ask-me`; never crawl the machine

### 2. Check GitHub Releases

> Goal: know the latest release and its notes

1. `gh release list --repo <owner>/<repo> --limit 10`
2. `gh api repos/<owner>/<repo>/releases/latest --jq '.tag_name + " " + .published_at'`
3. No releases → `git ls-remote --tags --refs <repo-url>` and take the highest SemVer tag
4. `gh` unavailable or unauthenticated → record `unavailable` with the reason; never guess

### 3. Check Registry Releases

> Goal: know the latest installable version per ecosystem

1. npm: `npm view <pkg> version` plus `npm view <pkg> dist-tags --json`
2. PyPI: `curl -s https://pypi.org/pypi/<pkg>/json | jq -r '.info.version'`
3. crates.io: `curl -s -H "User-Agent: check-update" https://crates.io/api/v1/crates/<crate> | jq -r '.crate.max_stable_version, .crate.newest_version'` — crates.io rejects requests without a User-Agent
4. Go: `curl -s https://proxy.golang.org/<escaped-module>/@latest | jq -r '.Version'` — escape uppercase letters (`A` → `!a`)
5. EOL data only via `https://endoflife.date/api/<product>.json`; any other ecosystem → official registry API per `/deep-research`
6. Registry error (404/private) → `unavailable` with URL + status; never substitute a GitHub tag for an installable version

### 4. Check Blog And Changelog Releases

> Goal: catch announcements that registry metadata misses

1. Read the official blog/changelog/RSS/Atom feed linked from the repo or README
2. An announcement newer than the registry version → record as `announced`; the installable version stays the registry's
3. No feed → `/deep-research` scoped to the official domain; breaking-change and deprecation notes go into `Notes`
4. Record the URL read for every entry

### 5. Compare And Classify

> Goal: turn three channels into one verdict

1. Compare with SemVer 2.0.0 rules → `up-to-date` / `patch` / `minor` / `major`; prerelease-only → `prerelease-only`; unparsable → `unknown`
2. Note breaking-change signals in `Notes`
3. Channels disagree → registry wins for "installable latest", GitHub wins for release notes; report both

### 6. Report And Route

> Goal: hand off with evidence, never update here

1. `/report` table: `No.`, `Target`, `Channel`, `Current`, `Latest`, `Gap`, `Published`, `Evidence`
2. Sort by risk: major → minor → patch → prerelease-only → unknown → up-to-date
3. Hand off: deps/tools → `/update-version-to-latest`; missing install → `/run-install`; skill content → `/update-agents-skills-global`; methodology → `/follow-up-to-date`

## Rules

### 1. Live Evidence Only

- Every version comes from a command or URL run in this session, quoted in `Evidence`
- `unavailable` is a valid result; a guessed version number is not
- Record the check date so the evidence can be re-verified

### 2. Read-Only

- Never install or upgrade — no `npm update`, `cargo update`, `go get -u`, `mise upgrade`, or manifest edits
- No secrets or tokens in output; never echo registry credentials

### 3. Channel Semantics

- GitHub = releases and release notes; registry = installable artifact; blog = announcements, breaking changes, and EOL
- Stable is the baseline; prereleases only with `--include-prerelease` and always labeled in the table
- A channel that errors is reported as failed, never silently skipped

### 4. Determinism

- Same targets + same registry state → same table; no ordering or value drift between runs
- `--channel` restricts the check to the named channels only

- Use /follow-up-to-date if needed
- Use /check-should-update if needed
- Use /keepup-source-code if needed
- Use /update-version-to-latest if needed
- Use /run-install if needed
- Use /deep-research if needed
- Use /update-agents-skills-global if needed

## Expected Outcome

- Per-channel latest versions with evidence URLs and a check date
- An outdated/up-to-date verdict per target, sorted by risk
- No update executed — every fix is handed to `/update-version-to-latest`
