# mise — Best Practices

Dev tool version manager + env vars + tasks — polyglot toolchain discipline

## Recommended Patterns

- `mise.toml` (or legacy `.tool-versions`) at the repo root — pin exact versions (`node = "22.x"`, `bun = "1.x"`)
- `mise use -g <tool>` for global tools, `mise use` in the project for per-repo pins
- `[env]` section for project env vars — `_.file` loads `.env`; secrets via `_.source` or external
- `[tasks]` replace npm scripts when cross-language — `run`/`depends`/`sources`/`outputs` caching
- Backends: `npm:`, `cargo:`, `ubi:`, `aqua:` — pick the backend per tool (ubi/aqua = fast binary installs)

## Common Pitfalls

- `mise trust` is required for config files — CI needs `mise trust` or `MISE_TRUSTED_CONFIG_PATHS`
- Version drift across machines = "works on my machine" — commit `mise.toml` + use `mise install` in CI
- shims vs activate: `mise activate` (shell integration) is cleaner than shims — but shims are needed for some IDEs
- Don't commit secrets in `.env` files — `mise.toml [env]` is for non-secret envs only
- Legacy `.nvmrc`/`.node-version` conflicts — migrate into mise alone, don't mix version files

## Tasks

- Task dependencies via `depends`/`depends_post` — a clearer DAG than chained npm scripts
- `sources`/`outputs` → file-change caching — skip tasks when inputs didn't change
- `mise watch` for file-watching workflows

## Do / Don't

| Do | Don't |
|----|-------|
| pin versions in mise.toml | rely on system-installed tools |
| `mise install` in CI/setup | assume versions match |
| `[env]` for non-secrets | commit `.env` secrets |
| tasks for cross-language work | npm scripts wrapping rust/go tools |
