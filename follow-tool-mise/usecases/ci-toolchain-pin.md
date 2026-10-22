# Use Case — Pin The CI Toolchain From `mise.toml`

> A version pinned only on a laptop is a version that CI does not use. This makes CI install from the same `mise.toml` the repo commits, so "works on my machine" stops being a version difference. Source: https://mise.jdx.dev/cli/ (accessed 2026-10-21)

## 1. Pin the tools in the repo

```toml
[tools]
bun = "1.4"
node = "24"
```

`mise.toml` is the single version file — no `.nvmrc` beside it, or the two disagree the first time one is bumped.

## 2. Trust the config before running anything

CI has no interactive prompt, so the file stays untrusted and unread until it is trusted:

```yaml
      - run: mise trust
      - run: mise install --yes
```

`mise trust --all` trusts every config in the tree; `MISE_TRUSTED_CONFIG_PATHS` does the same non-interactively when the checkout path is not predictable.

## 3. Run the project through mise, not around it

```yaml
      - run: mise exec -- bun install --frozen-lockfile
      - run: mise run test
```

`mise exec -- <cmd>` prepends the tool paths, so the command resolves to the pinned version. `mise run <task>` does the same and adds the task graph. Invoking `bun` directly works only by accident of the runner image.

## 4. Cache the tool store, keyed on the config

```yaml
      - uses: actions/cache@v4
        with:
          path: ${{ env.MISE_DATA_DIR }}
          key: mise-${{ hashFiles('mise.toml') }}
```

Keying on `mise.toml` is what makes the cache correct: a version bump misses the cache and reinstalls, instead of silently restoring the old tool.

## 5. Keep local overrides out of CI

`mise.local.toml` is for machine-specific values and stays untracked; if CI needs a different value it belongs in a CI env var, not in a committed override.

## 6. Verify

1. `mise ls --json` in the job log — the installed versions match `mise.toml`
2. `mise which node` — resolves inside the mise store, not `/usr/bin`
3. `mise doctor` — no trust or shim warnings left
4. Delete the cache key once and re-run — the job must still pass on a cold cache
5. Bump one tool version — the cache must miss and the job must still pass

## Pitfalls

- Skipping `mise trust` in CI: the config is ignored or the command refuses, and everyone blames the tool.
- `latest` in `[tools]`: every run can resolve to a new version, so a red build has no diff to blame.
- A global tool installed with `mise use -g` on a self-hosted runner shadowing the project pin.
- Caching the tool store without a key on `mise.toml` — stale tools survive the version bump.
- Trusting only in the setup step while later steps run in a different shell without the tool path.

## Related

- `references/cli.md`
- `references/apis.md`
- `best-practices/mise.md`
- `workflows/setup-mise/SKILL.md`
- `usecases/tasks-with-caching.md`
