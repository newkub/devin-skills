# usage — Best Practices

CLI spec DSL — generate completions, docs, SDKs from one spec

## Recommended Patterns

- `usage.kdl` spec file = single source — commands, args, flags, help text; generate completions/docs/manpages/SDKs from it
- Declare args/flags typed (`flag "name" { help "..."; default "..." }`) — types → free validation + completion
- Write help text for the user — short, actionable, with examples; the generated docs are only as good as the spec
- Pair with mise tasks — usage as the mise task spec backend; `mise tasks` integration
- Version the spec with the CLI — spec drift = broken completions; spec tests in CI

## Common Pitfalls

- The spec doesn't enforce runtime behavior — the validation logic in code must mirror the spec constraints
- Generated completions must be installed into the shell — a docs step in install, not an assumption
- Breaking spec changes = breaking CLI — rename/remove flags = major bump discipline
- Multiple spec files per CLI = split subcommand trees; shared types/args in common sections
- Positional vs flags: required positionals make completion hard — flags when optional, positionals when core

## Generation Targets

- Shell completions: bash/zsh/fish — test the install script for real in every shell
- Markdown docs → commit into docs/ or the generated site
- JSON spec → SDK/tooling consumers

## Do / Don't

| Do | Don't |
|----|-------|
| spec = source of truth | hand-write separate completions |
| typed args + defaults | untyped strings for everything |
| test generated completions | assume generation correct |
| version spec changes like API changes | silent spec drift |
