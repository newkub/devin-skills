# git Search

## Local History

| Task | Command | Notes |
|---|---|---|
| Commit message | `git log --all --grep='<pattern>' --oneline` | add `-i` for case-insensitive |
| Author filter | `git log --author='<name>' --oneline` | regex accepted |
| Date window | `git log --since=2026-01-01 --until=2026-06-30 --oneline` | ISO dates |
| Pickaxe, exact string | `git log --all -S'<string>' --oneline` | triggers when occurrence count changes |
| Pickaxe, regex | `git log --all -G'<regex>' --oneline` | matches any changed line |
| Path-limited pickaxe | `git log -S'<string>' --oneline -- <path>` | narrowest scope |
| File history | `git log --follow --oneline -- <path>` | follows renames |
| File list per commit | `git log --name-only --pretty=format: -- <path>` | path history only |
| Patch for a commit | `git show <sha>` | add `--stat` for summary |
| Content at revision | `git grep -n '<pattern>' <rev>` | searches the tree, not the worktree |
| Multiple terms | `git grep -n -e '<a>' -e '<b>' <rev>` | all terms required |
| Track branch point | `git log --oneline <base>..<branch>` | range search |
| Line history | `git log -L <start>,<end>:<file>` | follows the line range across commits |
| Line blame | `git blame -L <start>,<end> -- <file>` | commit and author per line |

## Remote GitHub

| Task | Command | Notes |
|---|---|---|
| Repo access | `gh repo view <owner/repo>` | confirms auth and visibility |
| Commit list | `gh api 'repos/<owner>/<repo>/commits?per_page=100'` | paginate with `page` |
| Commit diff | `gh api 'repos/<owner>/<repo>/commits/<sha>'` | includes files and patches |
| Code search | `gh api 'search/code?q=<pattern>+repo:<owner>/<repo>'` | index may lag |
| File tree | `gh api 'repos/<owner>/<repo>/git/trees/HEAD?recursive=1'` | filter paths client-side |
| PR search | `gh pr list --search '<pattern>' --repo <owner>/<repo>` | server-side search |
| Issue search | `gh issue list --search '<pattern>' --repo <owner>/<repo>` | server-side search |

## Decision Table

| Question | Use |
|---|---|
| Which commit mentions this? | `git log --grep` |
| Which commit added or removed this string? | `git log -S` |
| Which commit changed a line matching this regex? | `git log -G` |
| What did the tree contain at revision X? | `git grep <pattern> <rev>` |
| Who touched these lines, by commit? | `git blame -L` |
| Who produced these lines, by agent session? | `ctx blame` (see `ctx-blame.md`) |
| What changed across a branch? | `git log <base>..<branch>` |
| Not cloned locally? | `gh api` or clone first |

## Notes

| Constraint | Detail |
|---|---|
| `-S` vs `-G` | `-S` is literal and occurrence-based; `-G` is regex on changed lines |
| Renames | plain log drops history at a rename; use `--follow` |
| Merge commits | add `-m` when a diff against each parent matters |
| Shallow clone | history may be incomplete; `git fetch --unshallow` first |
| Rate limits | prefer a local clone for large or repeated searches |
| Safety | search only; no state-changing git command |
