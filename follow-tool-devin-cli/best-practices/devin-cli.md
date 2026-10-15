# Devin CLI Best Practices

Recommended patterns and pitfalls, from official docs (https://docs.devin.ai/cli) and local verification on `devin 3000.11.3`.

## Do

- Start every task in the right mode: `/accept-edits` for daily work, `/plan` or `/ask` for read-only exploration, `--sandbox` + Autonomous for unattended runs
- Use `--` before prompts (`devin -- fix the tests`) so words that match subcommand names are not misparsed
- Prefer `-p` (print mode) plus `--format json` subcommands (`devin list`, `devin models list`, `devin doctor`) for scripting — stable machine-readable surfaces
- Resume instead of restarting: `devin -c` keeps directory context; `/export` before risky `/revert` or `/rm-session` preserves the transcript
- Use `/fork` at a decision step to explore alternatives instead of polluting the main session
- Attach precise context with `@` file mentions and `/add-dir` for cross-package work, instead of pasting file contents
- Try multiple model families (`swe`, `gpt`, `opus`) per the docs' own advice; pick Fusion as the default for cost/intelligence balance; short family names always resolve to latest
- Keep `config.json` minimal — only overrides (verify defaults with `/check-types-definition` or `/config`); set env vars (`DEVIN_MODEL`, `DEVIN_PERMISSION_MODE`) per shell/profile instead of repeating flags
- Run `devin doctor` after editing `AGENT.md`/skills/hooks — it reports profiles that silently fail to load
- Migrate once (`devin migrate hooks`, `devin migrate workflows`) instead of maintaining dual Windsurf/Devin files

## Don't

- Don't install the npm package `devin` — unrelated package; the CLI ships only via https://cli.devin.ai / Devin Desktop
- Don't run the Windows `irm ... | iex` install from Git Bash or CMD — PowerShell only, or the installer EXE
- Don't use `/bypass` as a habit — it auto-approves destructive commands; `smart` covers most "too many prompts" complaints, and sandbox+Autonomous covers unattended
- Don't expect Knowledge, Playbooks, or account Secrets in the CLI — cloud Devin features, not yet available in CLI
- Don't pass secrets in prompts or `-e KEY=VALUE` committed to project-scope MCP config — use env vars or user scope (`-s user`)
- Don't use `--respect-workspace-trust false` outside trusted automation paths — it disables the untrusted-directory guard
- Don't assume `/cloud` works mid-session — it only converts a fresh session with no messages yet (run `/clear` first)
- Don't pin full model version names in docs/scripts — use family slugs so upgrades are automatic
- Don't run two devtools-like config editors at once (`/config` while hand-editing `config.json`) — the editor rewrites the file
