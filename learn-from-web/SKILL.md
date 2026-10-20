---
name: learn-from-web
description: Learn from web sources — official docs, DeepWiki, Context7 — then extract or plan
argument-hint: "[url-or-topic]"
related:
  - learn
  - learn-from-cli
  - check-types-definition
  - learn-from-codebase
  - deep-research
  - create-report-in-dot-devin
  - check-reference
  - use-scripts
---

## Goal

Learn and extract knowledge from web sources — official docs, DeepWiki, Context7, Web Search — then summarize it into a learning path, content, or reference files covering features, APIs, and use cases

## Scope

- Use when you need to learn from an external URL/docs/article/repo — not a local codebase (use `/learn-from-codebase`), not a CLI binary (use `/learn-from-cli`), not a `.d.ts` API surface (use `/check-types-definition`)
- Covers: official docs, guides, API references, blog posts, GitHub repos
- Output: a learning path in chat, content files, or a skill's `references/` — does not modify code
- See also: `/deep-research` (cross-check multiple sources/high risk), `/learn` (dispatcher)

## Execute

### 1. Gather Sources

> Goal: Gather trustworthy sources

1. If the user provides a URL → `webfetch` to read it directly first
2. If it is a topic → `web_search` to find the official docs first (docs > blog > forum)
3. Use the `crw` tools (`crw_scrape`, `crw_map`, `crw_crawl`) for deep site crawl when you need multiple pages
4. Identify 1-3 primary sources + at most 5 supporting sources

### 2. Research Systematically

> Goal: Extract knowledge from official docs comprehensively

Follow [references/web-research.md](references/web-research.md) — the order `Official Docs` → `DeepWiki` → `Context7` → `Web Search` with knowledge extraction and validation

### 3. Identify Critical Path

> Goal: Find the "fastest route to understanding"

1. Order the reading: overview → core concepts → getting started → 1-2 end-to-end flows
2. Cut: marketing pages, changelogs, legacy docs no longer used
3. Identify what must really be read vs what can be skimmed

### 4. Build Concept Ladder

> Goal: The concepts that must be known before reading each part

1. Identify the prerequisite knowledge for each section
2. Link back to skills/`follow-*` that match the stack if relevant
3. Identify "gotchas" — points where the docs mislead or are deprecated

### 5. Produce Output

> Goal: The output matches the calling context

- If learning for yourself → write a learning path following the structure below
- If called as a dependency of a skill → write actual reference files per `update-devin-global-skills` (`## Conventions → Write References`) (mandatory, do not skip)
- If writing content across many files → run `/check-reference` on each piece, and `/use-scripts` if >10 files

```markdown
# Learning Path: <topic>

## Level 0: Big Picture (10 min)
- Read: <main docs URL> — overview/landing
- Understand: <core concept diagram>

## Level 1: Concepts
- Read: <concepts URL> — domain terms and mental model

## Level 2: Hands-on
- Follow: <tutorial/guide URL> — a real step-by-step

## Level 3: Depth
- API reference, edge cases, advanced topics

## Gotchas
- <what the docs do not tell you or what people often miss>

## Sources
- <all URLs used with a one-line summary>
```

5. Record it with `/create-report-in-dot-devin` if the user wants to keep it

## Rules

### 1. From Real Sources

- Every step must point to a real URL that was fetched and verified — not a generic "read the docs"
- Always cite sources — each claim must be traceable back to its source
- Source order: `Official Docs` → `DeepWiki` → `Context7` → `Web Search`

### 2. Minimal Path

- Choose the shortest route that gives 80% understanding — not covering every page
- State what is skipped and why

### 3. Freshness

- Check the last-updated of the docs — warn if stale or deprecated
- If sources conflict with each other → state it and choose official/current

### 4. Content Quality

- Use backticks for `tools`, `commands`, `paths`, `skill-name`
- No more than 250 lines per file — no TODO/MOCK/placeholder

## Expected Outcome

- A learning path that can actually be followed, with URLs and concepts, or a complete set of real reference files
- A clear source map with citations
- Gotchas that help avoid misunderstandings
