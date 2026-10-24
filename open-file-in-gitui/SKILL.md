---
name: open-file-in-gitui
description: Open a file in the gitui TUI with gitui -f <file> via a TTY-capable terminal
argument-hint: "[file]"
related:
  - follow-tool-git
  - open-in
  - report-diff-in-web
  - git-file-history
---

## Goal

Open the specified file in gitui's Files tab with `gitui -f <file>`, spawned in a terminal that really has a TTY, because gitui is a fullscreen TUI that blocks until exited

## Scope

Use when viewing one file's stage/unstage status and diff in gitui from the current context (a user-specified path, the open file, or the current working directory). Supports Windows, macOS, and Linux with `gitui` in PATH — to view a diff in a browser use /report-diff-in-web open, to open a file in an editor use /open-in zed, to open an empty terminal use /open-in wezterm

## Execute

### 1. Prepare Context

> Goal: Identify the file, repo root, and a usable terminal

1. Identify the target file from user input or the open file → convert to an absolute path
2. Verify the file exists with `test -f` — if missing, do not stop yet: first search whether this name exists in the repo (`git ls-files "*<name>"`, `find . -name "<name>" -not -path "./.git/*"`) and propose candidates; if truly absent → inform the user and stop (never create new files)
3. Find the repo root: `git -C "<dir-of-file>" rev-parse --show-toplevel` — not in a git repo → inform the user and stop
4. Confirm the file is under that repo root (not a cross-repo path)
5. Check `gitui` in PATH with `command -v gitui` (mise shim → `gitui --version`; verified 0.28.1, 2026-10-12) — not found → give install instructions (`mise use -g gitui`, `scoop install gitui`, `cargo install gitui`) and stop
6. Pick a terminal emulator available in PATH: `wezterm` → `wt` → `x-terminal-emulator`/`gnome-terminal` (Linux) → `Terminal.app` (macOS) → `tmux` if a session exists — none at all → print the command for the user to run in their own terminal

### 2. Build Command

> Goal: Compose the correct gitui command for the context

1. Base command: `gitui -f "<absolute-file-path>"` running from the repo root
2. If the cwd differs from the repo root, add `-w "<repo-root>"` (`--workdir`) or use the terminal's `--cwd` instead; for a separate git dir (worktree, submodule) use `-d "<git-dir>"` (`--directory`)
3. Other options from `gitui --help` (0.28.1) as needed:

   | Flag | Meaning |
   |---|---|
   | `-f, --file <file>` | select the file in the Files tab (this skill's target) |
   | `-w, --workdir <workdir>` | set the working directory (env `GIT_WORK_TREE`) |
   | `-d, --directory <directory>` | set the git directory (env `GIT_DIR`) |
   | `-t, --theme <file>` | theme file from the config dir (default `theme.ron`) |
   | `-k, --key-bindings <file>` | custom keybindings file |
   | `-s, --key-symbols <file>` | custom key symbols file |
   | `--watcher` | use an fs watcher instead of tick-based updates |
   | `-l, --logging` / `--logfile <file>` | write logs to the cache dir (`%LOCALAPPDATA%/gitui/gitui.log` on Windows) |
   | `--bugreport` | generate a bug report and exit |

4. gitui's config dir is `%APPDATA%\gitui` on Windows (`~/.config/gitui` on macOS/Linux) — an empty dir means defaults are used, not broken

### 3. Launch In A TTY

> Goal: Open gitui in a real terminal without blocking the agent shell

1. Never run `gitui` directly in the agent's shell — it is a blocking TUI; without a TTY it hangs until killed (confirmed with 0.28.1)
2. Spawn via a terminal per platform:
   - Windows + WezTerm: `wezterm start --cwd "<repo-root>" -- gitui -f "<file>"` (see /open-in wezterm)
   - Windows Terminal: `wt -d "<repo-root>" pwsh -NoExit -c "gitui -f '<file>'"`
   - Linux: `x-terminal-emulator --working-directory="<repo-root>" -e gitui -f "<file>"` or `gnome-terminal --working-directory="<repo-root>" -- gitui -f "<file>"`
   - macOS: `osascript -e 'tell application "Terminal" to do script "cd <repo-root> && gitui -f <file>"'`
   - An existing tmux session: `tmux new-session -d -c "<repo-root>" gitui -f "<file>"` then `tmux attach -t <session>`
3. Multiple files → open one per window/session, because `-f` accepts one path per invocation
4. With no terminal available, print the ready command (`cd "<repo-root>" && gitui -f "<file>"`) for the user to copy — /open-in wezterm can open a terminal first

### 4. Verify And Report

> Goal: Confirm gitui opened with the file selected

1. Check the terminal process was spawned (`wezterm` exit 0, or `tmux ls` shows the new session) — this does not mean gitui is still running, only that the command was delivered
2. If gitui opened but the file is not selected = the file has no change in the Files tab (clean/ignored) → tell the user directly and offer routes: edit the file first, view history with `git log -p -- <file>` / /git-file-history, or open the diff in a browser with /report-diff-in-web open
3. Report: file path, repo root, terminal used, the full command used, and a note that key bindings are visible in gitui's footer (press `?` in normal mode)
4. To select the file in File Explorer instead of the TUI use /open-in explorer; to open it in an editor use /open-in zed

## Rules

### 1. Safety

- Never run `gitui` inline in a non-TTY shell — always spawn through a terminal
- Do not create new files or directories when the target is missing
- Never commit, stage, stash, reset, or push for the user through the TUI automatically — gitui is an interactive UI; the user presses the keys
- Do not close gitui sessions the user left open
- If the user gives no path, ask first — never guess a file

### 2. Determinism

- Find `gitui` from PATH/mise shim first; never hardcode the binary's absolute path
- Use absolute paths for both the file and `--cwd`/`-w`; always quote (paths may contain spaces)
- Resolve the repo root via `git rev-parse` every time; never assume the cwd is the root
- Same output for the same input: file + repo root + command string unchanged

### 3. Output

- Report as a list: file, repo root, terminal, command used
- On failure, state the cause (no gitui / not a repo / file clean / no terminal) with clear next steps

- Use /follow-tool-git if needed
- Use /open-in wezterm if needed
- Use /open-in zed if needed
- Use /report-diff-in-web open if needed
- Use /git-file-history if needed
- Use /open-in explorer if needed

## Expected Outcome

- gitui opens in a new terminal with the target file selected in the Files tab, or the reason it could not is reported
- A command string the user can re-run themselves in a shell
- No agent process is blocked and no git operation happens that the user did not request
