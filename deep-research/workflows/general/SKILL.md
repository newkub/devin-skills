---
name: deep-research-general
description: Core research pipeline — topic → sources → gather → validate → synthesize for general topics
argument-hint: "[topic]"
related:
  - deep-research
  - rethink
  - follow-best-practice
  - learn
  - check-reference
  - report
---

## Goal

The main pipeline of `/deep-research` — deep multi-source research for general topics that don't match a specialized workflow (dependencies, setup, integrations, api-references, improve)

## Scope

Use when you need in-depth information from many sources, e.g. comparing approaches, finding best practices, checking compatibility, benchmarks, security, migration, licensing — not a quick lookup (`/learn-from-web`) and not the docs of a single library (`/follow-best-practice`)

## Execute

### 1. Identify Topic And Scope

> Goal: Identify the topic and scope

Follow `references/topic-and-scope.md`

### 2. Select Sources

> Goal: Pick sources by data type

Follow `references/sources.md`

### 3. Research Packages And Code

> Goal: Search package registries and code repositories

Follow `references/package-code-research.md`

### 4. Use AI Documentation Tools

> Goal: Use DeepWiki, Context7, GitHub MCP

Follow `references/ai-docs.md`

### 5. Crawl Official Documentation

> Goal: Use CRW for official docs

Follow `references/crw.md`

### 6. Use Web Search

> Goal: Use Windsurf WebSearch for general sources

Follow `references/websearch.md`

### 7. Check Freshness And Compatibility

> Goal: Check year, version, breaking changes, migration

Follow `references/freshness.md`

### 8. Cross-Reference And Validate

> Goal: Check credibility, security, license

Follow `references/cross-validate.md`

### 9. Synthesize Findings

> Goal: Collect and summarize the results

Follow `references/synthesize.md` — then output via `/deep-research report` (`workflows/report-findings/SKILL.md`)

## Rules

- Always use multiple sources: NPM, GitHub, DeepWiki, Context7, CRW, WebSearch, security DB — details in `references/research-rules.md`
- Check credibility: reputation, maintenance, GitHub activity, compare across multiple sources
- Check security: advisories, CVE, open issues
- Prioritize the most recent year's data and call out gaps
- Fan out independent subtasks via the `source-researcher` profile (`deep-research/SKILL.md ## Subagents`) when there are multiple dimensions
- Use `/rethink` if needed
- Use `/check-reference` if needed

## Expected Outcome

- Complete information from cross-referenced multiple sources, with source, version, year, and gaps noted
