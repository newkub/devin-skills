---
name: git-file-history
description: View a file's git history via the released @wrikka/git-cli package with the file-history command
argument-hint: "[file]"
related:
  - check-git-logs
  - list-brave-browser-history
  - restore-files
  - follow-git-flow
  - resolve-errors
  - follow-best-practice
---

## Goal

View the git file history of a given file via the already-released `@wrikka/git-cli` package using the `git-ai file-history <file>` command, which automatically generates an HTML viewer with a split-screen timeline, commit type badges, diff view, and keyboard navigation

## Scope

Use to view the git file history of any file in a workspace that has a git repository and has `@wrikka/git-cli` installed

Boundary: interactive HTML viewer only — find the commit matching a condition → `/check-git-logs`; analyze evolution/patterns → `/diff-file-history`

## Execute

### 1. Install @wrikka/git-cli

> Goal: Install @wrikka/git-cli

1. Check that `@wrikka/git-cli` is installed:
   - run `git-ai --help` to verify
   - if not yet installed, install it from the `@wrikka/bun-packages` monorepo:
     `bun --filter @wrikka/git-cli build` then `bun link`
2. Check that the `OPENAI_API_KEY` environment variable exists if AI features are needed

### 2. Run file-history Command

> Goal: Run file-history Command

1. Specify the file whose history to view (from the active document or given by the user)
2. Run `git-ai file-history <file_path>` in the git root directory
3. The CLI will:
   - pull the commit history with `git log --follow`
   - pull the file content of each commit with `git show <hash>:<file>`
   - generate HTML with Vue 3 + Tailwind CSS
   - write the HTML to the OS temp directory
   - open it in the browser automatically
4. If you do not want the browser to open automatically, use the `--no-open` flag

### 3. UI Components

> Goal: UI Components

1. Header - glassmorphism bar showing file path, commit count, view toggle, keyboard hints
2. Timeline Sidebar - split-screen vertical timeline on the left:
   - each commit shown as a dot on the timeline line
   - commit type badge (feat, fix, refactor, chore, docs, other)
   - the active commit has a glow effect
   - hovering a dot scales it up
3. Commit Info Bar - shows type badge, hash, message, author, date, email
4. Code Viewer - shows file content line-numbered with sticky line numbers
5. Diff View - switchable between content and diff vs the previous commit:
   - added lines: green background
   - removed lines: red background
   - dual line numbers (old + new)
   - diff stats: +added / -removed
6. Navigation Footer - prev/next buttons + progress dots
7. Copy Button - copy file content to clipboard

### 4. Keyboard Navigation

> Goal: Keyboard Navigation

1. `ArrowLeft` - go to the previous commit (older)
2. `ArrowRight` - go to the next commit (newer)
3. `D` - toggle between content and diff view
4. Show the keyboard hint in the header

### 5. Transition Animations

> Goal: Transition Animations

1. Use the Vue `<transition>` component with `mode="out-in"`
2. Slide right (to a newer commit): `translateX(30px) scale(0.98)` → `translateX(0)`
3. Slide left (to an older commit): `translateX(-30px) scale(0.98)` → `translateX(0)`
4. Use `cubic-bezier(0.22, 1, 0.36, 1)` easing
5. Duration: `0.4s`
6. Timeline scroll into view, smooth
7. `fade-in-up` animation for the content area

## Rules

### 1. Package Usage

- use `git-ai file-history <file>` from the `@wrikka/git-cli` package only
- no need to write your own Bun shell script — the package handles everything
- if the package is not released yet, build from the monorepo first
- use the `--no-open` flag if you do not want the browser to open automatically

### 2. Git Data Extraction

- the package uses `git log --follow` to track file renames
- uses `--pretty=format` for structured output
- uses `git show <hash>:<file_path>` to pull each commit's content
- if the file has no git history, an error message is shown

### 3. HTML Generation

- use Vue 3 via the unpkg CDN
- use Tailwind CSS via cdn.tailwindcss.com
- use the dark mode theme (`<html class="dark">`)
- split-screen layout: timeline sidebar (left) + content area (right)
- every commit must have an entry in the timeline
- the file must work immediately when opened in the browser

- Use /check-git-logs if needed
- Use /list-brave-browser-history if needed
- Use /restore-files-from-devin-history if needed
- Use /follow-git-flow if needed
- Use /resolve-errors if needed
- Use /follow-best-practice if needed

## Expected Outcome

- a single HTML file in the OS temp directory with real git data
- split-screen UI: timeline sidebar + content area
- commit type badges for conventional commits
- keyboard navigation (left/right) with transition animations
- content and diff views are switchable
- the browser opens automatically after generating
