# Use Case — Faster CI Builds with Caching and Timing

> Cut cold-build minutes in CI without hiding regressions, and know which crate is actually slow. Source: https://doc.rust-lang.org/cargo/reference/profiles.html (accessed 2026-10-20)

## 1. Split the profile for dependencies

```toml
# Cargo.toml
[profile.dev]
opt-level = 0
debug = 1            # line tables only — much smaller than debug = 2

[profile.dev.package."*"]
opt-level = 2        # dependencies optimized, your crate still compiles fast
```

`dev` stays fast to rebuild while the hot path (deps) runs at a realistic speed.

## 2. Cache the right things

```yaml
- uses: Swatinem/rust-cache@v2
  with:
    shared-key: "workspace"
    cache-all-crates: false
    workspaces: ". -> target"
```

The cache key is derived from `Cargo.lock` and the toolchain — committing the lockfile is what makes caching effective.

## 3. Measure before optimizing

```bash
cargo build --workspace --timings
# opens target/cargo-timings/*.html — per-crate wall time and parallelism
```

If one crate dominates, look at its features and build script before touching flags.

## 4. Keep a shared compiler cache for local work

```bash
cargo install sccache --locked
export RUSTC_WRAPPER=sccache      # put in your shell profile
sccache --show-stats
```

`sccache` helps most when you switch branches often or share a `CARGO_TARGET_DIR` between worktrees.

## Pitfalls

- Caching `target/` with a key that ignores `Cargo.lock` → stale artifacts and mysterious link errors; let the action derive the key.
- `debug = 2` in CI plus a full artifact upload → multi-GB uploads; use `debug = 1` or strip.
- `opt-level = 3` for dev → every incremental build re-optimizes your crate; keep the boost scoped to `package."*"`.
- Enabling `sccache` in CI without a remote backend → the cache is per-job and useless; use the target cache there instead.

## Related

- `references/cli.md`
- `best-practices/cargo-lints.md`
- `usecases/workspace-lints.md`
