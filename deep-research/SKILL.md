---
name: deep-research
description: Deep multi-source research dispatcher: packages, repos, docs, benchmarks, security, compatibility
argument-hint: "[general|dependencies|setup|api-references|improve|report|query]"
related:
  - deep-thinking
  - deep-analyze
  - rethink
  - research-setup-integrations
  - follow-best-practice
  - learn
  - check-reference
  - deep-review-codebase
  - improve
  - use-subagents
---

## Goal

Research deeply across multiple sources to get a complete, correct, and current answer — dispatcher into focused workflows

## Scope

Use for work that needs deep information from many sources, e.g. comparing libraries, finding best practices, checking compatibility, benchmarks, security, migration, licensing. Not for quick lookups (use `/learn-from-web`) and not for reading a single library's docs (use `/follow-best-practice`)

## Execute

### 1. Choose Workflow

> Goal: route to the workflow that matches the topic

| Topic | Workflow |
|--------|----------|
| dependencies/libraries/packages (choose, compare, outdated) | `workflows/dependencies/SKILL.md` — `/deep-research dependencies` |
| setup/config/CI/boilerplate of a tool/service | `workflows/setup/SKILL.md` — `/deep-research setup` |
| integrations: plugins, extensions, providers, adapters, marketplace | `/research-setup-integrations` (top-level) |
| a library/tool's API references | `workflows/api-references/SKILL.md` — `/deep-research api-references` |
| research-driven improvement opportunities | `workflows/improve/SKILL.md` — `/deep-research improve` |
| summarize a report from existing findings | `workflows/report-findings/SKILL.md` — `/deep-research report` |
| general topic / none of the above | `workflows/general/SKILL.md` — full pipeline steps 1-9 |

1. Run `/deep-thinking` first to fix the question, scope, and the criteria for a "complete" answer before searching
2. If the argument matches a workflow → read `workflows/<name>/SKILL.md` and follow its flow
3. If unspecified/no match → run `workflows/general/` (full pipeline) — the final step executes `workflows/report-findings` after synthesizing

## Rules

### 1. When To Use

- Use when comparing tools, best practices across many sources, or making an important decision
- Do not use for reading a single tool's docs (use `/follow-best-practice`) or for low-risk cases
- Use multiple sources: NPM, GitHub, DeepWiki, Context7, CRW, Windsurf WebSearch, security DB
- See `references/research-rules.md` for details

### 2. Research Best Practices

- Always start with `/deep-thinking`; gather empirical evidence like `/deep-analyze` before concluding (cross-validate across sources, never guess from memory)
- Prefer official sources first — docs > repo > registry > community; community is a fallback/corroboration only
- Cross-validate ≥ 2-3 sources before concluding — a claim seen in only one source is marked low confidence
- Freshness: state the version + year of every claim; check deprecation/breaking-change notices before recommending
- Cite every finding: source URL + accessed date + confidence (high/medium/low)
- Time-box by task size (small ≤ 5 min, medium ≤ 15 min) — go deeper by fanning out via the `source-researcher` profile in `## Subagents` + `/use-subagents`
- Clearly separate facts from assumptions and gaps — gaps are a valuable output, not a failure
- Note conflicts between sources instead of silently picking one — show both sides with reasons
- Never guess an API/command/version — without evidence, mark it as unverified

### 3. Routing Discipline

- A topic with a focused workflow must route there — never run the general pipeline on top of it
- The chosen workflow is canonical — never duplicate steps outside it

- Use /rethink when needed
- Use /check-reference when needed
- Use /improve when needed

## Subagents

> Goal: independent work that can be spawned in parallel — the profiles live in this section, no separate files

### source-researcher — research a single source/topic in depth and return findings with confidence

- **Inputs**: `topic` (what to research, e.g. `bun test coverage`, `hono middleware`), `source` (the single source it owns: `official-docs`/`github-repo`/`changelog`/`npm-registry`), `source-url` (optional — the source's specific URL, e.g. repo URL or docs root), `focus-questions` (optional — the specific questions to answer from this source)
- **Tools**: `web_search`, `webfetch` (search/read a source), `mcp_call_tool` (DeepWiki, Context7, GitHub MCP when the source is a repo/docs), `read`, `grep` (local references/cached docs)
- **Execute**: 1) Confirm the assigned source and identify its most authoritative entry point (docs root, `CHANGELOG.md`, releases page) 2) Pull the primary data by source type: docs → guides/API reference, repo → README/issues/commits, registry → versions/metadata 3) Answer the `focus-questions` if present — every answer must cite a verifiable URL 4) Check freshness: latest version, update date, breaking changes, maintenance status 5) Assign confidence per finding: `high` (official/primary), `medium` (secondary), `low` (inferred)
- **Output**: findings table `| No. | Finding | Source URL | Freshness | Confidence |` ending with a source summary (topic coverage, the gaps this source cannot answer, the latest version/date found); if a source is unreachable → return an `error` with the reason and suggested alternative sources
- **Constraints**: research only the one assigned source — never cross into other sources (the parent already divided the work); every finding needs a verifiable `source-url`, never answer from memory; always state version/date — flag old data as `stale`; if a source contradicts other data → note the conflict, don't adjudicate it; keep only findings that answer the `topic` — no more than ~10 findings per source; read-only — never use `edit`/`write` (report only, no code changes)

## Expected Outcome

- Complete information from multiple cross-referenced sources
- A findings summary with source, version, year, confidence — gaps/risks/breaking changes made clear
- A credible, actionable answer with a report
