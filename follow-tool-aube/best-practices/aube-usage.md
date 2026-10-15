# Aube Best Practices

Guidelines for using Aube correctly as the Node.js package manager — command selection, security posture, lockfiles, and CI

## Recommended Patterns

### Command Selection

- `aubr <script>` when the script needs installed `node_modules` (test, build, dev, lint) — auto-install always runs first
- `aubx <tool>` for a one-off tool that can be resolved without installing the whole project (e.g. temporary `aubx tsc --noEmit`)
- `aube exec <bin>` when you want the binary directly from the current project's `node_modules/.bin` — more deterministic than `aubx` for tools that are already dependencies
- `aube add`/`remove`/`update` for the dependency lifecycle — do not hand-edit `package.json` and forget the lockfile; let aube manage both together

### Lockfile Strategy

- Keep one lockfile per repo — if `package-lock.json` and `pnpm-lock.yaml` are mixed, resolution is not deterministic; keep the one the team actually uses and delete the rest
- Always commit the lockfile — Aube reads/writes in place so no migration is needed, but the lockfile is the source of truth for resolution
- After `aube update`, review the lockfile diff in the PR — silent auto-install can cause unnoticed dependency drift

### Security Posture

- Enable `paranoid: true` in `aube-workspace.yaml` for production projects and repos accepting external PRs
- Review every lifecycle script before `aube approve-builds` — a lifecycle script is code execution at install time
- Use the `allowBuilds` allowlist only for packages that truly need it (e.g. native modules), never allow everything
- Do not skip the near-zero-download prompt without checking the package name — supply-chain attacks favor typosquats with no downloads yet

### Workspace

- Use `aube -r run <script>` to run every package and `aube -F '<pattern>' run <script>` when the scope is clear — filtering cuts CI time significantly
- The global content-addressable store is already shared across projects — do not delete `node_modules` needlessly because relinking is cheaper than reinstalling

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Installed via npm, version old | new features missing | npm dist-tag lags — use `mise use -g aube` or `cargo install aube --locked` |
| Multiple lockfiles in one repo | resolution wobbles | keep one lockfile, delete the rest |
| auto-install in read-only env | run script fails or slow | in CI with locked deps, install ahead or use `aubx` for tools needing no tree |
| approving all builds | supply-chain risk | `aube approve-builds` one at a time + keep the allowlist in config |
| thinking `aubx` = `aube exec` | wrong tool version | `aubx` fetches/runs ad-hoc, `aube exec` uses only the local installed bin |

## Do / Don't

| Do | Don't |
|---|---|
| `aubr test` lets auto-install handle it | hand-run `aube install` before every script |
| commit `aube-workspace.yaml` with `paranoid: true` | disable security defaults because prompts are annoying |
| review lockfile diff after update | merge auto-updates without looking at transitive changes |
| filter the workspace with `-F` in CI | run `-r` over the whole monorepo for a one-package change |
| pin one install method per team (mise/brew/cargo) | let members install via different channels until versions diverge |

## Performance And CI Notes

- Auto-install checks freshness first — repeat `aubr` runs are fast because install is skipped when the lockfile is unchanged; do not add a redundant install step in CI
- GitHub Actions: `jdx/aube-action` installs and caches for you — pair it with `aubr test` without a separate `bun install`
- Cache the global store between CI runs (key by lockfile hash) to cut resolve+link time
- Trust downgrades fail at resolve by default — if CI starts failing right after an upstream publish, check whether it is the cooling window (24h), not a bug
- Scripts that call `aubr` nested inside `aubr` re-run the freshness check — within one script, chain `aube exec` calls instead

## Config Guidance

Recommended `aube-workspace.yaml`:

```yaml
paranoid: true          # for production / public repos
allowBuilds:            # only approved lifecycle scripts
  - esbuild
  - sharp
```

- Keep the config at a single workspace root — nested configs make the security posture inconsistent
- Document the reason for each `allowBuilds` entry in a comment — auditors then understand why a native build must run
- When migrating from pnpm/npm: keep the old lockfile for Aube to reuse, then add security knobs one at a time
