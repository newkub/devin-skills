---
name: search-npm-libraries
description: Find libraries by keyword or similar, restricted to TypeScript + ESM libraries
argument-hint: "[keyword]"
related:
  - list-my-npm-packages
  - follow-best-practice
  - suggest-next-action
  - follow-tool-crw
  - learn
  - run-install
---

## Goal

Search Npm Libraries

## Scope

Use `search-npm-libraries` for the covered specific tasks and workflows (npm libraries)

## Execute

### 1. Search Libraries

> Goal: Find libraries matching the keyword

1. Take `<keyword>` from the argument — if missing, ask the user
2. Use `follow-tool-crw` or `learn` (web) to find libraries matching the keyword or similar
3. Keep only libraries written in TypeScript and published as ESM
4. If nothing meets the criteria → recommend the closest match and state the limitations

### 2. Compare And Recommend

> Goal: Compare and recommend the best fit

1. Summarize each candidate in a comparison table — features, bundle size, maintenance, popularity
2. Recommend the best fit with reasons
3. If several are about equally good → show the trade-offs for the user to choose

## Rules

- Always filter to TypeScript + ESM only
- Use `follow-tool-crw` or `learn` (web) for search
- Use `list-my-npm-packages` if you want to see packages already installed
- Use `follow-best-practice` if you want the chosen library's best practices
- Use `suggest-next-action` afterwards to recommend the next step
- Use /run-install if needed

## Expected Outcome

- A list of libraries matching the keyword that are TypeScript + ESM
- A comparison table of features, bundle size, maintenance
- A recommendation with reasons, or trade-offs to choose from
