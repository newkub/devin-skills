# Step: Update Workspaces READMEs

> Goal: Update the README of every workspace in the monorepo

## Execute

1. Run `/all-workspace` to update the README of all workspaces
2. No `License` section (use the root one)
3. No `## Contributing` section (use the root one)
4. If a workspace has no `package.json` → skip and report
5. If the update fails → retry (max 3 → stop/report)

## Rules

- The workspace README uses the same template as the root, but:
  - no `## License` (use the root one)
  - no `## Contributing` (use the root one)
  - includes Status, Hero, Report ANSI, UI Sketch, Get Started, Features, Usage

