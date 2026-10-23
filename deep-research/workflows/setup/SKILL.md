---
name: deep-research-setup
description: Find tool/service setup, config, CI and integrations from many sources — synthesize a setup plan
argument-hint: "[tool-or-service]"
related:
  - deep-research
  - research-setup-integrations
  - setup-cicd
  - follow-tool-usage
  - follow-best-practice
  - check-reference
  - report-progress
  - report
---

## Goal

Search and summarize the setup, config, CI/CD, and boilerplate of a tool, framework, or service you need to install, cross-checked from multiple sources

## Scope

Use for researching a new setup, migration, or complex config — installing a tool, configuring CI/CD, connecting a service, finding the correct boilerplate — choosing plugins/extensions/providers specifically → `/research-setup-integrations`

## Execute

### 1. Clarify Setup Target

> Goal: Pin down the setup's target and boundaries

1. Identify tool/framework/service/platform + version channel (stable, latest, LTS, preview)
2. Identify the platform/ecosystem (Bun, Node, Rust, Go, Python, Flutter, Cloudflare, Vercel, etc.)
3. Define scope: local setup, CI/CD, deployment, integration, monorepo, shared config
4. List existing constraints: current tools, OS, budget, security policy

### 2. Search Official Sources

> Goal: Gather the primary data from official documentation

1. Use `/learn-from-web` or `crw_scrape` to find official docs — start with getting started, quickstart, installation, setup guide
2. Save official doc links and the main setup commands — CLI tool → record install command + recommended version
3. If tool integrations/plugins/extensions must be chosen → hand off to `/research-setup-integrations`

### 3. Search Config And CI Examples

> Goal: Find real config files and CI templates from the community

1. Use `web_search` or `crw_scrape` for config templates (`wrangler.toml`, `.github/workflows`, `biome.json`, `tsconfig.json`)
2. Search GitHub repos with a similar setup (`/search`, `/explore-github-trending`)
3. Collect correct, up-to-date CI/CD pipeline examples — note required env vars, secrets, permissions

### 4. Cross-check Multiple Sources

> Goal: Verify correctness before concluding

1. Return to `/deep-research` (general pipeline) when a deep multi-source comparison is needed
2. Use `context7` or `deepwiki` for libraries/frameworks
3. Check article/release-notes dates — look for known issues, breaking changes, migration guides

### 5. Synthesize Setup Plan

> Goal: Merge the data into an actionable setup plan

1. Summarize prerequisites + installation steps
2. List config files to create/modify with examples
3. Commands/scripts to run + CI/CD steps if any
4. Common pitfalls + fixes + alternatives when multiple options exist

### 6. Save And Report Findings

> Goal: Deliver the information so it can be used downstream

1. If long/complex data is found → create `references/setup-<topic>.md`
2. Run `/report-progress` or `/report` to summarize results + all source links
3. If data is uncertain → mark it as an assumption or caveat

## Rules

- Official documentation is always the primary source — cross-check ≥ 2-3 sources before concluding
- Distinguish stable steps from experimental/deprecated — never copy-paste config without citing the source
- Always state version, platform, constraints — dependencies research → `/deep-research dependencies`
- Use `/setup-cicd`, `/follow-tool-usage`, `/follow-best-practice`, `/check-reference` if needed

## Expected Outcome

- A complete setup report: prerequisites, config files, commands, CI/CD samples, pitfalls, alternatives + references
