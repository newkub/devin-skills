---
name: search-npm-libraries
description: Find, compare, and evaluate npm libraries on npmx.dev — restricted to TypeScript + ESM
argument-hint: "[keyword]"
related:
  - list-my-npm-packages
  - follow-best-practice
  - suggest-next-action
  - follow-tool-crw
  - learn
  - run-install
  - ask-me
  - use-my-packages-on-registry
  - deep-review-codebase
---

## Goal

Search npm libraries by keyword or similarity, then compare and pick the best fit using `npmx.dev` package details — `versions`, `dependencies`, `docs`, `changelog`, `stats`, `security`, `source code`

## Scope

Use `npmx.dev` as the data source (not `npmjs.com` or CLI search); keep only TypeScript + ESM libraries; report in chat with a comparison table — excludes installing or implementing in the project

## Execute

### 1. Clarify Search

> Goal: understand what the user wants

1. Take `<keyword>` (package name, keyword, or feature) from the argument or context — if unclear → run `/ask-me`: what is it for (state management, router, UI, etc.), must it be TypeScript + ESM, size/license constraints, comparison against other options needed?
2. If nothing meets the criteria → recommend the closest match and state the limitations

### 2. Build Npmx URL

> Goal: get the correct npmx.dev URL

1. Keyword search → `https://npmx.dev/search?q=<query>` (press `/` to focus the search bar)
2. Known package → `https://npmx.dev/<package>`; scoped → `https://npmx.dev/@scope/name`; specific version → `https://npmx.dev/package/<package>/v/<version>`
3. Compare → `https://npmx.dev/compare?packages=<pkg1>,<pkg2>`; user packages → `https://npmx.dev/~<username>`; org packages → `https://npmx.dev/@<org>`
4. npmx.dev URLs directly replace `npmjs.com` (swap the domain)

### 3. Evaluate Candidates

> Goal: gather enough data to decide

1. Open the package page with `crw_scrape` or `/follow-tool-crw`; keep only libraries written in TypeScript and published as ESM
2. Read the `README` — purpose, quick start, caveats; check `Versions` — latest, release cadence, deprecated; check `Dependencies` — count, peer/native deps
3. Check `Code` (press `.`) — file structure, entry points, source quality; `Docs` — generated API docs; `Changelog` — release notes
4. Check `Stats` — downloads, install size, stars/forks; `security` badges — vulnerabilities, provenance, license-change warnings
5. Always record every URL that was checked

### 4. Compare Packages

> Goal: pick the best one when there are multiple options

1. With 2-3 options → use `/compare?packages=<a>,<b>` on npmx.dev; look for native/smaller/safer alternatives in `Module replacement suggestions`
2. Build a comparison table: name + version · size (publish/install) · dependency count · TypeScript/ESM/CJS support · license · provenance · security status · weekly downloads · last published · pros/cons
3. Run `/follow-best-practice` if this category has its own best practice

### 5. Recommend

> Goal: summarize and point to the URLs

1. Pick the best package per the criteria with reasons; state the exact version recommended for pinning (never `latest` in production)
2. Provide a shareable URL such as `https://npmx.dev/<package>@<version>`
3. If unsure → `/ask-me` before deciding; if several are about equally good → show the trade-offs for the user to choose
4. If the package must be used in the project → hand off to `/use-my-packages-on-registry` or `/deep-review-codebase`

## Rules

### 1. Selection Criteria

- Always filter to TypeScript + ESM only; priority order: TypeScript types > ESM support > small size > provenance > active maintenance
- Avoid packages with deprecation or vulnerabilities; check the license before use in projects with constraints

### 2. Keyboard Shortcuts (npmx.dev)

- `/` focus search · `Ctrl+K`/`⌘K` command palette · `.` code viewer · `d` docs · `c` compare · `-` changelog · `t` timeline · `s` stats

### 3. Tools

- Use `/follow-tool-crw` (`crw_scrape`) to pull data from npmx.dev, `/learn` (web) for docs outside npmx, `/deep-review-codebase` for a deeper audit
- Use `/list-my-npm-packages` for packages already owned, `/suggest-next-action` afterwards for the next step

### 4. Safety

- Research only — do not install packages yourself; do not expose API keys or registry tokens
- Do not create any files in the target project beyond the report in chat; use `/run-install` if needed

## Expected Outcome

- A list of matching libraries filtered to TypeScript + ESM, with a suitable one chosen and reasons
- A comparison table (size, dependencies, license, security, maintenance, downloads) when there are multiple options
- Exact npmx.dev URLs for the recommended package and version, or trade-offs for the user to choose
