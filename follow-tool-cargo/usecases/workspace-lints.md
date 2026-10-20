# Use Case — Workspace-Wide Lint Configuration

> Set lint levels once at the workspace root and let every crate inherit them, so `cargo clippy` behaves the same everywhere. Source: https://doc.rust-lang.org/cargo/reference/manifest.html#the-lints-section (accessed 2026-10-20)

## 1. Root workspace

```toml
# Cargo.toml
[workspace]
members = ["crates/*"]
resolver = "3"

[workspace.lints.rust]
unsafe_code = "forbid"
missing_docs = "warn"
unused_must_use = "deny"

[workspace.lints.clippy]
all = { level = "warn", priority = -1 }
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
must_use_candidate = "allow"
```

`priority = -1` puts the group last so the individual `allow` entries above can still override it.

## 2. Each crate opts in

```toml
# crates/api/Cargo.toml
[lints]
workspace = true
```

A crate without `[lints] workspace = true` silently uses defaults — the usual reason one crate is noisy and another is not.

## 3. Crate-specific exceptions stay local

```toml
# crates/ffi/Cargo.toml
[lints]
workspace = true

[lints.rust]
unsafe_code = "warn"       # this crate must call into C
```

## 4. Verify

```bash
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo fmt --all -- --check
```

`--all-targets` covers tests/examples/benches; without it, lint debt hides in test code.

## Pitfalls

- `[lints]` in a member crate but no `workspace = true` → the table is ignored entirely, no error.
- `deny(warnings)` inside source via `#![deny(warnings)]` → fails on any new compiler release; use the manifest so it is reviewable.
- `--all-features` locally but not in CI → feature-gated code is never linted.
- Overriding a group (`all = "allow"`) without priority → later individual entries win/lose unpredictably; always set `priority`.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/cargo-lints.md`
- `usecases/faster-builds-with-cache.md`
