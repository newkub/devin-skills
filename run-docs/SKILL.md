---
name: run-docs
description: Run a documentation site and fix errors
argument-hint: "[scope]"
related:
  - deep-review
  - follow-tool-vitepress
  - update-vitepress-docs
  - deep-debug
  - resolve-errors
  - watch-browser

---

## Goal

Run the documentation site and fix any errors that occur

## Scope

Use for documentation sites built with VitePress, Docus, or other documentation frameworks.

See also: /deep-review

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (docs)

### 1. Check Documentation Setup

> Goal: Check Documentation Setup

1. Check whether a documentation config exists (VitePress, Docus, etc.)
2. If it is VitePress, run `/follow-tool-vitepress` to verify the configuration
3. Check the package manifest for a dev script
4. Check that the required dependencies are installed
5. Check that the content structure is complete

### 2. Update Documentation

> Goal: Update Documentation

1. Run `/update-vitepress-docs` to create and update the docs site (content + config) — or `/update-docs` if it is pure markdown
2. Run `/deep-review` to improve SEO for the documentation site
3. Check that the documentation is built correctly

### 3. Run Dev Server

> Goal: Run Dev Server

1. Run the dev server with the appropriate command for the documentation framework
2. If there are errors, run `/deep-review` to analyze and prioritize them
3. `/deep-review` decides which workflow to continue with:
   - If they are cascade issues → `/deep-debug` → `/resolve-errors`
   - If they are isolated errors → `/resolve-errors`
4. Monitor and fix errors immediately until they pass
5. Check that the dev server starts successfully

### 4. Open Browser and Watch (if needed)

> Goal: Open Browser and Watch (if needed)

1. If a URL needs to be opened, choose:
   - To verify via browser automation → run `/watch-browser fix`
   - To just open it in the browser → run `/open-web`
   - To watch the terminal every 5 seconds → run `/watch-terminal`
2. Check that the documentation site actually loads
3. Access the documentation site and check that the main features work

### 5. Verify

> Goal: Verify

1. Confirm there are no critical errors blocking functionality
2. Check that navigation and content render correctly
3. Confirm there are no runtime errors in the console
4. Check that styling and the theme work

### 6. Report

> Goal: Report

1. Run `/report` to render terminal output with ANSI codes
2. Run `/report` to format a table
3. Show the formatted results

## Rules

- Use the command appropriate for the documentation framework
- Monitor and fix errors immediately until they pass
- Check that the dev server starts successfully before opening the browser
- Run `/follow-tool-vitepress` first to create and update the docs

## Expected Outcome

- The documentation site works
- No critical errors
- Navigation and content render correctly
- Styling and the theme work
