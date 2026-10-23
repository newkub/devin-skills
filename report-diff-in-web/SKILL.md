---
name: report-diff-in-web
description: Diff stats, browser viewer, and file history — one read-only diff entry
argument-hint: "[stats <ref>] | [open <pr|git|branch|file> ...] | [history <path> [range]]"
related:
  - report
  - suggest-next-action
  - git-commit
  - git-file-history
  - check-git-logs
  - git-search
  - follow-tool-git
  - follow-lib-diffs
  - follow-lib-solidjs
  - follow-lib-unocss
  - follow-unocss-theme
  - open-web
  - deep-review
---

## Goal

One entry for every diff task: summarize a git diff with statistics and insights, render a diff in a polished browser viewer, or trace one file's evolution across history — read-only unless the user explicitly triggers a PR action

## Scope

| Mode | Argument | Workflow |
|------|----------|----------|
| stats (default) | `[ref]` | `references/stats.md` — change summary, statistics, key changes, insights |
| open | `open pr <n>` / `open git <ref>` / `open branch <base>..<head>` / `open file <old> <new>` / `[--repo owner/repo]` | `references/open.md` — bundled Solid + UnoCSS viewer on `@pierre/diffs`, served by Bun |
| history | `history <path> [range]` | `references/history.md` — per-commit evolution, hotspot, regression point |

Boundaries: library-level diff rendering in another app → `/follow-lib-diffs`; staging and committing → `/git-commit`; interactive HTML file viewer → `/git-file-history`; find commits matching a condition → `/check-git-logs`; search messages, content, or blame → `/git-search`; git mechanics → `/follow-tool-git`

## Execute

### 1. Resolve Mode

> Goal: pick the workflow and inputs

1. Read the first argument: `open` → viewer; `history` → evolution; anything else or none → `stats` with the argument as the ref
2. Default ref for `stats` → `HEAD` (`git diff HEAD`)
3. Missing required input (`history` without a path, `open` with an unknown source) → run `/ask-me`
4. State the resolved mode and scope before running commands

### 2. Report Diff

> Goal: summarize the diff per `references/stats.md`

1. Capture the diff and statistics for the resolved scope
2. Group changes by change type and category; list the top 5 changed files
3. Present summary → statistics table → details; use `/report` for table formatting
4. Cap output: diff over 500 lines → summary + top 5 files; a file over 100 lines changed → summary only
5. Highlight breaking changes and API/schema/config impact; add insights and risks

### 3. Open Diff Viewer

> Goal: launch the in-skill viewer per `references/open.md`

1. Use the skill's own app at `<skills-root>/report-diff-in-web` — never copy it into the target repo
2. First run only: `bun install`; rebuild when `dist/index.html` is missing or `src/` is newer: `bun run build`
3. Run `bun src/serve.ts <source> [args] [--repo ...]`; the server prints `report-diff-in-web running at http://localhost:<port>` and opens the browser — fallback `/open-web`
4. No source argument → the app opens with the source dialog (PR picker, refs, branch range, file compare); the in-app dialog can switch sources later
5. Env: `OPEN_DIFF_PORT` (default `4780`), `OPEN_DIFF_NO_OPEN=1` suppresses auto-open
6. Verify header source and +/- stats, sidebar file list, highlighted diff, theme switch, options panel (`o`), keyboard help (`?`), and the close-tab prompt
7. Viewer features to exercise: 5 theme pairs × system/light/dark, split/unified, indicator styles, backgrounds, line numbers, wrap, inline word diff, hunk separators, font scale 80–150%, all/focus layout, sidebar, sticky headers, hover, line selection, file search/sort/filter
8. Leave the viewer running for the user; stop it when they are done

### 4. Trace File History

> Goal: analyze the file timeline per `references/history.md`

1. `git log --follow --oneline -- <path>` for the timeline, including renames
2. Measure line-count trend, author ownership, and classify commits by type
3. Find major rewrites (over 50% of the file) and regression candidates; use `git log -S"<pattern>"` for pickaxe
4. Report `No.`, `Commit`, `Date`, `Author`, `Lines Δ`, `Type`, `Significance`; cite real SHAs

### 5. Present And Act

> Goal: close with one readable deliverable and a next action

1. Lead with the key finding; details below
2. Use `/report` for tables (`No.` first column) and `diff` code fences
3. Report mode → end with `/suggest-next-action`; viewer mode → offer `/deep-review` on the viewed diff; history mode → state limitations (shallow clone, history rewrites)
4. Write no report files unless the user asks — `/create-report-to-dot-agents` owns persistence

## Rules

### 1. Read-Only By Default

- Never stage, commit, revert, or rewrite history — `/git-commit` owns committing
- The viewer reads through `git`/`gh`; PR actions (approve, merge, comment, close) and checkout are real mutations — run them only when the user explicitly asks for that action, never automatically
- Every history claim cites a real commit SHA; measure line counts instead of estimating

### 2. Viewer Operation

- Run the app from the skill directory; the target repo is inspected only, never modified and never receives copied app files
- Build once per source change — `src/` newer than `dist/` means rebuild, otherwise the browser serves stale JS
- One viewer per diff; switch sources through the in-app source dialog instead of launching another server and port
- Keep the close-tab watchdog honest: closing the tab prompts `(r)eopen` / `(q)uit` / `(c)ontinue`; non-TTY sessions keep serving
- Types, frontmatter, and option defaults live in `src/types.ts` and `src/lib/options.ts`; follow `/follow-lib-diffs` for `CodeView` rules (host owns scrolling, stable ids, explicit themes, clean teardown)
- The viewer UI is Solid + UnoCSS: follow `/follow-lib-solidjs` for components/reactivity and `/follow-lib-unocss` + `/follow-unocss-theme` for tokens, theme classes, and utilities before adding styles

### 3. Diff Scope Accuracy

- `git diff` unstaged; `git diff --cached` staged; `git diff HEAD` all; `<a> <b>` between commits; `<a>..<b>` between branches; `<file>` one file
- State the scope used in every report
- PR diffs beyond the GitHub API limit and binary files are unsupported in the viewer — say so instead of showing a partial diff

### 4. Output Discipline

- Summary first, then statistics, then details; group by docs, config, code, test, chore
- Symbols: ✅ added, ✏️ modified, ❌ deleted, 📝 renamed
- No full diff over 500 lines; no unrelated files
- Backtick all commands, paths, and skill names; no `**` bold

## Expected Outcome

- stats: key findings, overall statistics, grouped changes, top files, impact and risks
- open: the bundled viewer serves the requested source with header stats, sidebar, highlighted split/unified diff, theme pairs, persisted options, keyboard shortcuts, PR metadata/checks, and the close-tab prompt
- history: timeline with key commits, hotspot or stable verdict, ownership, and a regression SHA when found
- Nothing staged, committed, or written into the target repo
