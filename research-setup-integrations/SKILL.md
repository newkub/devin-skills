---
name: research-setup-integrations
description: Find plugins, extensions, providers, marketplace integrations from official sources before setup
argument-hint: "[tool-or-integration]"
related:
  - deep-research
  - update-config
  - check-reference
  - report
---

## Goal

Search and compare integration options of a tool/service from official sources — plugins, extensions, providers, adapters, middleware, marketplace items — to pick the official, maintained and compatible one before real setup

## Scope

Use when finding/choosing an integration of a tool or platform — editor extensions, framework plugins (vite/astro/nuxt), CI actions, deploy providers, database drivers, MCP servers, lint presets — not the whole setup flow (general setup research → `/deep-research setup`) and not picking a library dependency (`/deep-research dependencies`)

## Execute

### 1. Identify Integration Need

> Goal: pin down host + integration type + version target

1. Identify the host tool/platform and the installed version (read the real `package.json`/lockfile/`mise.toml`, don't guess)
2. Identify the integration type: plugin, extension, provider, adapter, preset, middleware, driver, action
3. Identify constraints: official-only or community ok, license, bundle/runtime cost

### 2. Search Official Sources

> Goal: catalog from official sources before community

1. The host's official integrations/plugins/extensions page (docs → `/learn-from-web`, `crw_scrape`, `context7`)
2. Official registries/marketplaces: npm scoped orgs (`@vitejs`, `@astrojs`, `@clack`, `@biomejs`), VS Code/JetBrains/Chrome marketplaces, GitHub Actions marketplace, Terraform/Pulumi registry, MCP server lists
3. The host's own monorepo — integrations often live in `packages/*` of the same repo (DeepWiki/GitHub)
4. Record per candidate: name, type, maintainer (official/community), install command, config surface, version compat

### 3. Verify Quality

> Goal: keep only maintained and compatible integrations

1. Official vs community — prefer official; community must have clear traction
2. Maintenance: last release ≤ 6 months, open issues, release cadence
3. Compatibility: peer/version range fits the actually installed host version — cut deprecated/abandoned + note it in the report
4. If the config surface needs its options/defaults checked → `/check-types-definition` on the integration's type defs

### 4. Synthesize And Report

> Goal: recommendation with evidence

1. Run `/report` table: `No.`, `Integration`, `Type`, `Official`, `Latest`, `Compat`, `Install`, `Verdict`
2. Primary recommendation + install command + minimal config snippet
3. State alternatives + reasons for exclusion (deprecated, incompatible, unmaintained)
4. Report-only — never install/edit config yourself; once the user picks, hand off to `/update-config` or the related setup skill

## Rules

- Official docs/registries are always the primary source — blog/community are fallback only
- Every candidate needs a source URL + the version checked — never guess an install command or config key
- Clearly separate stable vs preview/experimental/deprecated in the report
- Use /deep-research if needed (deep cross-check across multiple sources)
- Use /check-reference if needed

## Expected Outcome

- Integration catalog from official sources with quality/compatibility checks
- Recommendation + install + minimal config ready to use — sources complete
