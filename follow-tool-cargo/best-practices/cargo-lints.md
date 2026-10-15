# Cargo Lints Best Practices

Guidelines for configuring `[lints]`/`[workspace.lints]` in `Cargo.toml` so the team shares one rule set and runs stably in CI

## Recommended Patterns

### Lint Levels And Ratcheting

- Start with `warn`, then ratchet to `deny` one rule at a time as the codebase cleans up — flipping everything to `deny` at once breaks the build and teams end up disabling lints entirely
- Group by risk: `unused_*`/`missing_docs` (safe, add quickly) → `clippy::all`/`pedantic` (needs triage) → `nursery` (experimental, expect churn)
- Use `priority = -1` on lints where you want in-code `#[allow]` to win — default lint-group priority makes per-item allow ineffective in some cases
- When an `#[allow]` is required, place it at the smallest scope (item/function) with a reason comment — crate-level `#![allow]` hides real problems for the future

### Workspace Inheritance

- Set `[workspace.lints]` only in the root `Cargo.toml` — single source of truth
- Every member crate adds `[lints] workspace = true` — do not copy rule tables per crate, they will drift
- Member crates override only when necessary (e.g. `unsafe_code = "allow"` in an FFI crate) — document the reason in a comment
- New-crate templates should include `[lints] workspace = true` from the scaffold — forgetting it means that crate silently goes unlinted

### Pedantic Strategy

- `clippy::pedantic` has false positives by design (`cast_precision_loss`, `must_use_candidate`, `missing_errors_doc`) — you do not have to fix every one
- Good pattern: enable `pedantic = "warn"` then allow only the lints the team agrees are unnecessary in `[workspace.lints.clippy]` — keep the allowlist/noise-list in config, not scattered in code
- `clippy::nursery` changes across toolchain versions — enable it only when the team accepts lint churn on `rustup update`

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| `cargo clippy` without `--all-targets` | test/example code never linted | always use `--all-targets` |
| `--all-features` on a big workspace | feature unification creates odd compile paths | run default `--all-targets` first; all-features only on purpose |
| `[lints]` in a virtual manifest at the wrong level | lints not applied | virtual manifests use `[workspace.lints]` only |
| `nursery` + `-D warnings` in CI | CI turns red after `rustup update` | keep nursery as warn, or pin the toolchain in `rust-toolchain.toml` |
| `missing_docs` on a binary crate | main.rs full of warnings | scope doc lints to lib crates only |
| bad fmt but lint passes | style drift | make `cargo fmt --check` a separate hook/job |
| lints in `Cargo.toml` but devs just run `cargo build` | nobody sees the warnings | CI gate `clippy -- -D warnings` + pre-commit hooks |

## Do / Don't

| Do | Don't |
|---|---|
| `[workspace.lints]` at root + `workspace = true` in every member | copy the lint table into every crate |
| ratchet `warn` → `deny` as it gets clean | turn on `deny` for all groups on day one |
| `cargo clippy --all-targets -- -D warnings` in CI | run clippy without a gate (warnings = noise) |
| `#[allow]` with a reason comment | `#![allow(clippy::all)]` for the whole crate |
| pin the toolchain via `rust-toolchain.toml` | float on stable and let new lints redden CI |
| keep `cargo fmt --check` as a distinct step | fold fmt into the clippy step until logs mix |

## Performance And CI Notes

- `cargo check --all-targets` before `clippy` — clippy subsumes check, but separating them makes errors easier to read; in CI running `clippy` alone suffices since it includes check
- Cache `target/` in CI (Swatinem/rust-cache or sccache) — clippy changes rustc flags so its cache key differs from normal builds; do not accidentally share mixed caches
- Pin the toolchain: `rust-toolchain.toml` with channel+components (`clippy`, `rustfmt`) — lint sets change per release, pinning keeps CI reproducible
- `cargo deny` (licenses/advisories/bans) and `cargo audit` are separate jobs from lints — different domains
- Pre-commit hooks (lefthook): `fmt --check` is fastest and should run first; `clippy -D warnings` can be slow — choose pre-commit vs pre-push gating based on acceptable wait time
- Build `cargo doc` as a separate job when using `missing_docs` — doc lints surface fully only in a real docs build

## Config Guidance

Root `Cargo.toml`:

```toml
[workspace.lints.rust]
unused_extern_crates = "warn"
unused_qualifications = "warn"
missing_docs = "warn"

[workspace.lints.clippy]
all = "warn"
pedantic = "warn"
# allowlist only what the team agreed
cast_precision_loss = "allow"
missing_errors_doc = "allow"
```

Member crate:

```toml
[lints]
workspace = true
```

- Keep the lint rationale in a comment beside any disabled rule — reviewers should not have to guess
- Put `[lints] workspace = true` into the repo's cargo-new template/generator
- Review the lint table on every toolchain bump — new lints in `all`/`pedantic` may need triage
