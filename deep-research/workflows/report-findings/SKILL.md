---
name: deep-research-report-findings
description: Build a research report from findings — sources, confidence, comparison, open questions
argument-hint: "[topic]"
related:
  - report
  - create-report-to-dot-agents
  - learn-from-web
---

## Goal

Turn `/deep-research` findings into a research report that traces back to its sources — the primary deliverable of the research workflow

## Scope

- Use when `/deep-research` dispatches to `report`, or standalone over findings you already have
- Covers: summary, evidence per claim, confidence levels, source list, open questions
- Output: a table in chat, or a persistent artifact via `/create-report-to-dot-agents` if the user asks

## Execute

### 1. Organize Findings

> Goal: Arrange findings into claims with evidence

1. Break findings into claims — bind each claim to its source (URL/doc/repo)
2. Assign confidence: `verified` (primary source), `likely` (multiple secondary sources agree), `unverified` (single source/inference)
3. Flag claims where sources conflict — show both sides

### 2. Build Report

> Goal: A report that supports decisions

1. 3-5 line summary — key findings first
2. Table: `No.`, `Finding`, `Confidence`, `Sources`, `Notes`
3. Comparison matrix if the research compares several options
4. Open questions — what wasn't found or still needs validation

### 3. Source List

> Goal: Complete, verifiable references

1. Collect all sources — primary before secondary
2. Note the access date and type (official docs, repo, benchmark, article)
3. If it must be archived → create `/create-report-to-dot-agents`

## Rules

- Every claim needs at least 1 source or is tagged as an assumption
- Separate fact from interpretation — the report must say which is which
- Never fabricate sources — if a claim has no evidence, state that none was found

## Expected Outcome

- Research report with confidence per claim + a complete source list
