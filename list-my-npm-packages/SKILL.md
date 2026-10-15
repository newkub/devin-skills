---
name: list-my-npm-packages
description: List npm packages the user owns or authors on the npm registry
argument-hint: "[scope]"
related:
  - list-program-in-computer
  - report
  - suggest-next-action
  - ask-me
  - run-install
---

## Goal

List the npm packages the user owns or authors on the npm registry with version, description, last published

## Scope

Use to view packages published from the user's account, queried from the npm registry or npm CLI, without modifying packages

## Execute

### 1. Verify npm And Authentication

> Goal: confirm npm is ready and authenticated

1. Run `npm --version` to check the installation
2. Run `npm whoami` to get the logged-in username
3. Not authenticated → use `/ask-me` to have the user run `npm login` or `npm adduser`
4. Record the username

### 2. List Packages By Ownership

> Goal: fetch the packages the user owns

1. Run `npm access ls-packages` to get a JSON mapping package -> permission
2. `npm access ls-packages` unavailable → fall back to:
   - `curl "https://registry.npmjs.org/-/v1/search?text=author:<username>&size=250"` or
   - `curl "https://registry.npmjs.org/-/v1/search?text=maintainer:<username>&size=250"`
3. Record the package names

### 3. Fetch Package Metadata

> Goal: fetch version, description, last published

1. For each package run `npm view <package> version description time.modified --json`
2. Or batch with a Bun/Node script calling `https://registry.npmjs.org/<package>`
3. Record version, description, last published date

### 4. Build Report

> Goal: report as a table

1. Use `/report` columns:
   - No.
   - Package
   - Version
   - Last Published
   - Description
2. Sort by most recent Last Published
3. State the total package count

### 5. Suggest Next Action

> Goal: suggest next steps

1. Use `/suggest-next-action` to recommend publish, deprecate, or update packages

## Rules

### 1. Authentication

- Must be logged in with npm first
- Never expose tokens, passwords, or credentials in output

### 2. Read Only

- Never publish, unpublish, deprecate, or update any package
- Query and report only

### 3. Rate Limit

- Many packages → use batching or sleep to avoid hitting the rate limit
- API does not respond → report the timeout and stop

### 4. Scope

- Show only packages the user owns/authors
- Unsure whether the user means `installed packages` or `published packages` → use `/ask-me`

- Use /list-program-in-computer if needed
- Use /run-install if needed

## Expected Outcome

- The list of npm packages the user owns with version, description, last published
- A table sorted by last published
- No package modified
