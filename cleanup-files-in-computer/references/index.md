# References

## Mise Docs

| Resource | URL |
|---|---|
| mise tasks | https://mise.jdx.dev/tasks/toml-tasks.html |
| mise cache prune | https://mise.jdx.dev/cli/cache/prune.html |
| mise prune | https://mise.jdx.dev/cli/prune.html |
| global config | https://mise.jdx.dev/configuration.html |

## Cleanup Tools

| Tool | Command |
|---|---|
| mise cache | `mise cache prune` |
| mise versions | `mise prune` |
| bun cache | `bun pm cache clean` |
| pnpm store | `pnpm store prune` |
| npm cache | `npm cache clean --force` |
| pip cache | `pip cache purge` |
| uv cache | `uv cache clean` |
| scoop | `scoop cleanup *` |
| cargo sweep | `cargo sweep -r ~` |

## Related Skills

| Skill | Responsibility |
|---|---|
| `/report-idea-cleanup-files-in-computer` | report-only analysis |
| `/follow-tool-mise` | mise setup |
| `/use-lib-better` | compare cleanup tools |
