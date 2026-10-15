# mbx (Mr Boxington) — Shared Cargo Build Cache

## Recommended Patterns

### Installation and Wrapping

- Prefer `mise use -g --tool-option mr_boxington=true rust mr-boxington` — gets Rust + mbx + Cargo wrapping in one step, no `mbx setup` needed
- If the toolchain already goes through mise → add `mr_boxington = true` to the existing `rust` tool entry — don't change the existing version pin
- Standalone setup: `mbx setup` → installs the Cargo shim; verify with `mbx setup --status` and `mbx doctor`
- Verify `cargo` resolves to the wrapper: `command -v cargo` (Unix) / `where.exe cargo` (Windows) — a binary merely installed doesn't prove builds go through mbx

### Verify Real Cache Hits

- First build = fills the store — never conclude the cache is broken from a first run with all misses
- Test reuse with a fresh `target/` or a new worktree on the same command — rebuilding into an up-to-date target doesn't count as a hit because Cargo skips on its own
- No hits → `mbx explain --last` for the per-action reason before changing config; `mbx tui` for live, `mbx stats` for total savings
- Read the post-build summary: `hits` restored, `misses` compiled fresh, `bypassed` didn't enter the shared cache — unusually high `bypassed` = check explain

### Parallel Builds / Multi-Agent

- Scheduler is on by default — pool = `scheduler.cpus` − `scheduler.reserve_cpus`, memory cap ~85% RAM
- Running several Cargo commands at once needs a separate `CARGO_TARGET_DIR` per command — mbx dedupes in-flight work itself, but the Cargo lock serializes on a shared target
- Many agents/test binaries → `scheduler.tests = true` or `MBX_SCHEDULER_TESTS=1` so test binaries join the same pool
- Editor/background builds set `scheduler.priority = "low"` so foreground builds get CPU first

### Config Precedence and Scope

- Precedence: `MBX_*` env → `.mbx.toml` (workspace root) → `mbx/config.toml` (platform dir)
- A repo `.mbx.toml` holds workspace settings only — never put `[remote]` url/credentials/machine paths in it (already rejected)
- Unknown TOML keys = immediate error — typo fail-fast is good, don't suppress it
- `[remote]` is accepted only in global config or `MBX_REMOTE_*` env

## Do / Don't

| Do | Don't |
|---|---|
| Pick one compiler cache (mbx or sccache) | Stack a `RUSTC_WRAPPER` pointing at sccache + expect mbx to cache too — mbx defers to it |
| Preview `mbx gc --dry-run` / `mbx adopt --dry-run` first | Run `mbx gc` / `adopt` straight on a big directory |
| Keep cache/target on local disk | Point `MBX_CACHE_DIR` at a network drive — NFS is rejected, the cache must be local |
| Scope remote writes to trusted branches | Let PR jobs publish into the remote cache — the env enforces read-only anyway, but set the role clearly |
| `mbx doctor` + a real build before concluding setup works | Look at `mbx --version` only |

## Common Pitfalls

- `mbx doctor` warns about a missing shim while mise-native wrapping works fine → verify with a real build, don't re-run `mbx setup`
- Windows: the `target` symlink needs Developer Mode or privilege — if it can't be created, Cargo falls back to a normal target (the cache still works)
- Explicit `CARGO_TARGET_DIR`/`--target-dir`/`build.target-dir` → mbx doesn't manage that target — check whether that's intended
- Incremental isn't shared — mbx forces `CARGO_INCREMENTAL=0`; don't try to cache incremental artifacts
- Deleting the cache dir while a build runs → the build breaks; the cache can always be rebuilt, an interruption cannot

## Performance Notes

- Reflinks (APFS/btrfs/XFS/ReFS/Dev Drive) are much faster than byte copy — on Windows use a Dev Drive when possible
- Collection runs automatically at most hourly after builds — tune `target.max_age` (default 30d) and `target.max_size` (default 10% of disk) to your disk
- Build-script execution is cached per `rerun-if-*` — disable with `build_script_execution = false` if the script has side effects beyond outputs
- Cache hits never wait for a scheduler permit — the reuse path is always faster than the compile path

## CI Notes

- GitHub Actions: `jdx/mr-boxington-action` before build — pushes to the default branch publish, PRs are restore-only
- Self-hosted remote: `[remote] url` + `namespace` + `mode = "read-write"` + token/OIDC — PR contexts don't publish even when the config is read-write
- Portable alternative: `MBX_CACHE_EXPORT_GROUP` + `mbx cache export`/`import` through an artifact tar
