---

name: search-in-git
description: Search git history, commits, diffs via log/grep/blame/pickaxe
argument-hint: "[scope]"
related:
  - deep-debug
  - check-git-logs
  - report
  - suggest-next-action

---

## Goal

Search for patterns, strings, or changes in a git repository with git search tools to find the related commits, files, or lines. Supports both local repos and remote repos on GitHub

## Scope

- Search in commit messages, code changes, file content
- Use `git log`, `git grep`, `git blame`, `git diff`, `git show`
- Support remote repos via `gh api`
- Report results as a table with commit SHA, author, date, message
- Used as a helper tool in `/deep-debug` and `/resolve-errors`

## Execute

### 1. Define Search

> Goal: Know what to search for

1. Get the search pattern from the user or context
2. Specify the scope:
   - `commit-message` → search in commit messages
   - `code` → search in code changes (diff)
   - `content` → search in current file content
   - `blame` → find who modified that line
   - `file` → search file names
3. Specify the repo: local path or `owner/repo` on GitHub
4. Specify branch/range/commit if any

### 2. Local Repo Search

> Goal: Search in a local git repo

1. If `commit-message` → run `git log --all --grep=<pattern> --oneline`
2. If `code` → run `git log --all -S <pattern>` or `git log --all -G <regex>`
3. If `content` → run `git grep -n <pattern>` or `git grep -n <pattern> <commit>`
4. If `blame` → run `git blame -L <start>,<end> <file>` then extract the commit
5. If `file` → run `git log --all --name-only --pretty=format: -- <pattern>` or `git diff --name-only`
6. If searching a large whole repo → limit the range with `--since` or `<commit>..<commit>`

### 3. Remote Repo Search

> Goal: Search in a remote GitHub repo

1. Confirm the repo with `gh repo view <owner/repo>`
2. If `commit-message` → `gh api repos/<owner>/<repo>/commits?per_page=100` then filter messages
3. If `code` → `gh api repos/<owner>/<repo>/commits?q=<pattern>` doesn't work directly → fetch commits then get each commit's diff
4. If `content` → `gh api search/code?q=<pattern>+repo:<owner>/<repo>`
5. If `file` → `gh api repos/<owner>/<repo>/git/trees/HEAD?recursive=1` then filter paths
6. If there is pagination → continue until found or the limit is reached

### 4. Analyze And Report

> Goal: Summarize the search results

1. Run `/report` showing: No, Commit SHA, Date, Author, Scope, Match
2. If a line is found → show file path, line, snippet
3. If nothing is found → suggest changing the pattern or scope
4. Run `/suggest-next-action` e.g. bisect, restore, or view the diff

## Rules

### 1. Search Strategy

- Start from the narrowest scope first (e.g. file or blame), then expand
- Use regex when you need pattern matching
- Use `-S` for an exact string in diffs, `-G` for regex
- Do not search secrets, tokens, or private data without a need

### 2. Remote Limitations

- The GitHub API has a rate limit → use pagination carefully
- The Search API requires the repo to be indexed already
- For a large repo → clone locally and search with git commands, which is faster

### 3. Safety

- Do not modify the repo during the search steps
- If results contain sensitive data → redact before reporting
- Back up the working tree before restore or checkout

### 4. Output

- Always use `/report`
- Show exact matches and brief context
- Order results by most recent date first

- Use /check-git-logs if needed

## Expected Outcome

- Finds the commit/file/line matching the criteria
- Clear report with evidence
- Supports both local and remote
- Works with `/deep-debug` and `/resolve-errors`
