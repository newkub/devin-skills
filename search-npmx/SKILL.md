---

name: search-npmx
description: Search, compare, and evaluate npm packages on npmx.dev
argument-hint: "[package-query]"
related:
  - follow-best-practice
  - follow-tool-crw
  - learn
  - use-my-packages-on-registry
  - deep-review
  - ask-me
  - run-install
---

## Goal

Use `npmx.dev` to search, compare, and pick the `npm packages` that best fit the project, using `package details`, `versions`, `dependencies`, `docs`, `changelog`, `stats`, `security` and `source code`

## Scope

Use `npmx.dev` only (not `npmjs.com` or CLI search) to find packages per requirement and summarize them in a comparison table. Excludes installing or implementing in the project

## Execute

### 1. Clarify Search

> Goal: Understand what the user wants

1. Take `package-query` from the argument or context — e.g. package name, keyword, or feature
2. If unclear → run `/ask-me` to ask follow-ups:
   - What is it for? (state management, router, UI, etc.)
   - Must it be TypeScript and ESM?
   - Any size or license constraints?
   - Does it need comparison against other options?

### 2. Build Search URL

> Goal: Get the correct npmx.dev URL

1. If searching by keyword → `https://npmx.dev/search?q=<query>`
2. If the package name is known upfront → `https://npmx.dev/<package>` or `https://npmx.dev/package/<package>`
3. If it is a scoped package → `https://npmx.dev/@scope/name`
4. If a specific version is needed → `https://npmx.dev/<package>@<version>` or `https://npmx.dev/package/<package>/v/<version>`
5. If a compare is needed → `https://npmx.dev/compare?packages=<pkg1>,<pkg2>`
6. Press `/` on npmx.dev to focus the search bar

### 3. Evaluate Candidates

> Goal: Gather enough data to decide

1. Open the package page with `crw_scrape` or `follow-tool-crw`
2. Read the `README` — summarize purpose, quick start, caveats
3. Check `Versions` — latest, release cadence, deprecated versions
4. Check `Dependencies` — count, any peer deps or native deps
5. Check `Code` (press `.`) — file structure, entry points, source quality
6. Check `Docs` — whether generated API docs exist
7. Check `Changelog` — whether release notes exist
8. Check `Stats` — downloads, install size, repository stars/forks
9. Check `security` badges — vulnerabilities, provenance, license change warnings
10. Always record every URL that was checked

### 4. Compare Packages

> Goal: Pick the best one when there are multiple options

1. If there are 2-3 options → use `/compare?packages=<a>,<b>` on npmx.dev
2. Build a comparison table with columns:
   - Name + version
   - Size (publish/install size)
   - Dependency count
   - TypeScript / ESM / CJS support
   - license
   - provenance
   - security status (vulnerabilities)
   - weekly downloads
   - last published
   - pros/cons
3. Look for native/smaller/safer alternatives from `Module replacement suggestions` if npmx shows them
4. Run `/follow-best-practice` if this category has its own best practice

### 5. Recommend

> Goal: Summarize and point to the URLs

1. Pick the best package per the criteria
2. State the exact version recommended for pinning
3. Provide a shareable URL such as `https://npmx.dev/<package>@<version>`
4. If unsure → run `/ask-me` before deciding
5. If the package must be used in the project → hand off to `/use-my-packages-on-registry` or `/deep-review`

## Rules

### 1. URL Conventions

- Use `https://npmx.dev/<package>` for regular packages
- Use `https://npmx.dev/package/<package>/v/<version>` for a specific version
- Use `https://npmx.dev/search?q=<query>` for searching
- Use `https://npmx.dev/compare?packages=<a>,<b>` for comparing
- Use `https://npmx.dev/~<username>` to view a user's packages
- Use `https://npmx.dev/@<org>` to view an org's packages
- npmx.dev URLs can directly replace `npmjs.com` (replace the domain)

### 2. Keyboard Shortcuts

- `/` — focus search bar
- `Ctrl+K` / `⌘K` — open command palette
- `.` — open code viewer
- `d` — open docs
- `c` — compare package
- `-` — open changelog
- `t` — open timeline
- `s` — open stats

### 3. Selection Criteria

- Priority order: TypeScript types > ESM support > small size > provenance > active maintenance
- Avoid packages with deprecation or vulnerabilities
- Avoid `latest` in production — recommend pinning the exact version
- Check the license before use in projects with constraints

### 4. Tools

- Use `follow-tool-crw` or `crw_scrape` to pull data from npmx.dev
- Use `follow-tool-crw` if more context is needed
- Use `learn` (web) if docs outside npmx must be read
- Use `deep-review` if a deeper audit is needed

### 5. Safety

- Do not install packages yourself (this skill does research only)
- Do not expose API keys or registry tokens
- Do not create any files in the target project beyond the report in chat
- Use /run-install if needed

## Expected Outcome

- A suitable package chosen with reasons
- A comparison table (when there are multiple options)
- Exact npmx.dev URLs for the recommended package and version
- Data on size, dependencies, license, security, and maintenance status
