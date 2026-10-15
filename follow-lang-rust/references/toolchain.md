# Rust Toolchain

| key | value |
|-----|-------|
| language | Rust (pin edition + `rust-version`/MSRV from a live check, never memory) |
| toolchain install | `mise use -g rust` (or rustup: `rustup-init.exe`, MSVC build tools on Windows) |
| build + package manager | `cargo` |
| official docs | https://www.rust-lang.org/learn · https://doc.rust-lang.org/cargo/ |
| version policy | never pinned here — live-check stable toolchain/edition via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `cargo new` / `cargo init` | scaffold binary or lib crate | bundled |
| `cargo check` / `build` / `run` / `add` / `remove` | compile, build, dependency edits | bundled |
| `rustup` / `rust-toolchain.toml` | toolchain pin + components | via rustup or `mise` |
| `cargo clippy` | linter (config via workspace `[lints]`) | bundled component |
| `cargo fmt` (`rustfmt`) | formatter — never fight it | bundled component |
| `cargo-nextest` | parallel test runner | `mise use -g cargo-nextest` — see `/follow-tool-nextest` |
| `cargo-llvm-cov` | coverage | `mise use -g cargo-llvm-cov` |
| `cargo-deny` / `cargo-audit` | license/advisory + vulnerability checks | `mise use -g cargo-deny` / `cargo-audit` |
| `cargo-mutants` | mutation testing | `/follow-tool-mutants-rs` |
| `proptest` | property-based tests (dev-dependency crate) | `cargo add --dev proptest` |
| `criterion` | benchmarks in `benches/` | `cargo add --dev criterion` |
| `cargo flamegraph` | profiling | `mise use -g flamegraph` |
| `miri` | UB detection in CI | rustup component |
| `rustdoc` (`cargo doc`) | docs — `#![warn(missing_docs)]` | bundled |
| `just` / `sccache` | dev task runner / shared compile cache (`mbx` on Windows: `/follow-tool-mr-boxington`) | `mise use -g just` |
| `cargo sort` / `cargo outdated` | manifest hygiene | `mise use -g cargo-sort` |
