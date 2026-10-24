---
name: git-file-history
description: View a file's git history in HTML, or find the newest commit matching a condition
argument-hint: "[file] [find] [condition]"
related:
  - list-brave-browser-history
  - follow-git-workflows-setup
  - resolve-errors
  - follow-best-practice
  - git-search
  - report
  - suggest-next-action
---

## Goal

View the git file history of a given file via the already-released `@wrikka/git-cli` package using the `git-ai file-history <file>` command, which automatically generates an HTML viewer with a split-screen timeline, commit type badges, diff view, and keyboard navigation; with the `find` argument, skip the viewer and walk `git log` from newest backwards until a condition matches (file not empty, contains a value, modified by an author) in a local or remote GitHub repo

## Scope

Two modes: the default opens the interactive HTML viewer for any file in a workspace that has a git repository and has `@wrikka/git-cli` installed; `find` locates the condition-matching commit without the viewer - local repos and remote GitHub repos

Boundary: viewer and condition-matching commits live here (used as a helper in `/deep-debug` and `/restore-files`) — searching by message, pickaxe, content at a revision, or line attribution → `/git-search`; analyze evolution/patterns → `/report-diff-in-web history`

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

### 6. Find Mode — Walk Commits Until A Condition Matches

> Goal: find the newest commit whose file content satisfies the condition, viewer not required

1. Take the file path, the repo source (a local path or `owner/repo` on GitHub), and the condition from the argument or context, e.g. "file is not empty", "has a line containing X", "file was deleted", "file was modified by author Y"; no condition -> show the full history
2. Local repo: run `git log --all --pretty=format:"%H %ad %an %s" --date=iso <file>`; if the file was renamed -> add `--follow`; for each commit newest to oldest run `git show <sha>:<file>`, check the condition, stop at the first match
3. Remote repo: confirm with `gh repo view <owner/repo>`, fetch commits with `gh api repos/<owner>/<repo>/commits?path=<file>&per_page=100`, fetch each commit's content with `gh api repos/<owner>/<repo>/contents/<file>?ref=<sha>` (decode base64), check the condition newest to oldest; nothing found -> paginate with the `page` parameter
4. Report via `/report`: No, Commit SHA, Date, Author, Message, Match, plus the file content in the matching commit (if not sensitive); nothing found -> state that no commit matches
5. Run `/suggest-next-action`, e.g. restore, bisect, or view the previous commit

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

### 4. Find Mode Discipline

- condition parsing supports `contains`, `not-empty`, `empty`, `equals`, `size-gt`; a plain string condition means `contains` on the content; a JSON path condition is verified with `jq` or Python
- stop immediately at the first (most recent) matching commit; show the full list only when the user asks for it explicitly
- for `git log --grep`, pickaxe (`-S`/`-G`), `git grep <rev>`, or `ctx blame` -> use `/git-search` instead of rebuilding the query here
- never modify files or the repo; never expose secrets in the report — redact sensitive content before displaying
- if no repo is specified -> use the current local repo

- Use /git-search if needed
- Use /report if needed
- Use /suggest-next-action if needed
- Use /list-brave-browser-history if needed
- Use /restore-files-from-devin-history if needed
- Use /follow-git-workflows setup if needed
- Use /resolve-errors if needed
- Use /follow-best-practice if needed

## Expected Outcome

- a single HTML file in the OS temp directory with real git data
- split-screen UI: timeline sidebar + content area
- commit type badges for conventional commits
- keyboard navigation (left/right) with transition animations
- content and diff views are switchable
- the browser opens automatically after generating
- In find mode: the condition-matching commit with SHA, date, author, message, and content, for local and remote repos
