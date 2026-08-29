# References

## Shared Config Patterns

| Tool | Shared Config Pattern |
|---|---|
| TypeScript | `tsconfig.base.json` + `tsconfig.json` with `extends` |
| ESLint | `eslint.config.js` or shared config package |
| Prettier | `prettier.config.js` or `package.json#prettier` |
| Vitest | `vitest.config.ts` with shared `defineConfig` |
| Moonrepo | `.moon/tasks/*.yml`, `.moon/workspace.yml` |
| pnpm | `pnpm-workspace.yaml` `catalogs:` |
| Bun | `bun-workspace.toml`, `bunfig.toml` |
| mise | `mise.toml` |
| [website.md](website.md) | Official resources and links |

## Resources

- Moonrepo shared tasks: https://moonrepo.dev/docs/config/tasks
- pnpm catalogs: https://pnpm.io/catalogs
- Bun workspaces: https://bun.sh/docs/cli/workspaces
- TypeScript project references: https://www.typescriptlang.org/docs/handbook/project-references.html

## Related Skills

| Skill | Responsibility |
|---|---|
| `/review-config` | review config before update |
| `/follow-tool-moonrepo` | moonrepo orchestration |
| `/follow-tool-mise` | tool version pinning |
| `/update-project` | root project update |
