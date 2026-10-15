---
name: open-web
description: Open a website with the native OS command
argument-hint: "[scope]"
related:
  - use-agent-browser
  - watch-browser
  - run-dev
---

## Goal

Open a website with the native OS command

## Scope
- For related skills: `open-files-in-web`, `use-agent-browser`, `watch-browser`

Use `open-web` to open a URL in an external browser or the integrated browser

## Execute

### 1. Open Website

> Goal: Open Website

Open the website with the native OS command

1. Receive the URL from the user
2. Verify the URL is correct
3. Decide between the integrated browser and an external browser:
   - integrated: if the user asks or the context supports the `browser_preview` tool → call `browser_preview`
   - external: use the system default browser
4. Use the native OS command for the external browser:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
5. Confirm the website opened correctly

## Rules

- Do not use a standalone `open` CLI tool; use native OS commands only
- Check the URL before opening
- Use the `browser_preview` tool for the integrated browser when the context supports it
- Use the system default browser for the external browser
- Use /run-dev if needed

## Expected Outcome

- The website opens in the chosen browser
- The URL is correct
