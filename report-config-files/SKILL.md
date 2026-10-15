---
name: report-config-files
description: Report configuration files, defaults, and drift in the project
argument-hint: "[scope]"
related:
  - report
  - report-file-structure
  - check-secrets
  - open-web-for-config-secret

---

## Goal

Create a report about configuration files in the project — finding drift between environments and default values

## Scope

Use to review config files such as `.env`, `.yaml`, `.json`, `.toml`, `.config` — without editing files

## Execute

### 1. Discover Config Files

> Goal: find all config files

1. Use `glob` to find `**/*.{json,yaml,yml,toml,ini,conf,config,env,env.*}`
2. Group by environment (`dev`, `test`, `prod`, `staging`)
3. Identify sample files or examples

### 2. Compare Environments

> Goal: compare config drift

1. Pair config files by environment
2. Compare keys/values
3. Identify keys that differ between environments
4. Identify secrets or hardcoded values

### 3. Report Findings

> Goal: create the report

1. Use `/report` for drift between environments — env keys use the same status vocabulary as `/open-web-for-config-secret`: `set`, `placeholder`, `localhost`, `missing`
2. Use `/report-file-structure` for the config-files tree
3. Summarize missing keys, inconsistent values, default drift
4. Report focuses on env keys needing configuration → reuse the inventory table from `/open-web-for-config-secret` (`No. | Key | Status | Where to fill | Key source URL | Format example | Why needed`) instead of a plain drift table

## Rules

### 1. No Modification

- Never edit config files
- Never expose secrets
- Never commit changes

### 2. Secret Safety

- Identify hardcoded secrets without showing actual values
- Recommend moving to `.env` or a secret manager

### 3. Ecosystem Aware

- Use framework conventions such as `.env` for JS, `Cargo.toml` for Rust

- Use /check-secrets if needed


- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A full list of config files
- A comparison table showing drift between environments
- A report of missing/inconsistent keys
- Next action for fixing drift
