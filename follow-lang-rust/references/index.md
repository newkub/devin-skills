# follow-lang-rust References Index

| File | Responsibility |
|---|---|
| [rust-install.md](rust-install.md) | Rust install via rustup, version info, channels |
| [rust-cargo-workspace.md](rust-cargo-workspace.md) | Cargo workspace config, package inheritance, workspace dependencies, workspace lints |
| [rust-cargo-profiles.md](rust-cargo-profiles.md) | Cargo profiles (dev, release, custom, opt-level, debug, lto, panic) |
| [rust-cli.md](rust-cli.md) | Cargo CLI commands, rust-toolchain.toml, source URLs |
| [rust-project-structure.md](rust-project-structure.md) | Project structure and configuration (workspace, Cargo.toml, profiles, rust-toolchain.toml, justfile, sccache) |
| [rust-code-standards.md](rust-code-standards.md) | Code standards (naming, traits, imports, unwrap, builder/newtype, clippy lints) |
| [rust-error-handling.md](rust-error-handling.md) | Error handling (thiserror, anyhow, #[from], context) |
| [rust-documentation.md](rust-documentation.md) | Documentation (//!, missing_docs, # Errors/# Panics/# Safety, RUSTDOCFLAGS) |
| [rust-ci-cd.md](rust-ci-cd.md) | CI/CD (GitHub Actions, stable/beta/nightly/MSRV, cargo-deny, cargo-nextest, cargo-llvm-cov, Miri) |
| [rust-testing.md](rust-testing.md) | Testing (#[cfg(test)], tests/, proptest, doctests, assert macros, #[should_panic]) |
| [rust-performance.md](rust-performance.md) | Performance (criterion, flamegraph, &str vs String, Cow, SmallVec, release profile) |
| [rust-security.md](rust-security.md) | Security (cargo-audit, cargo-deny, forbid unsafe_code, RUSTSEC) |
| [rust-dependency-management.md](rust-dependency-management.md) | Dependency management (rust-version/MSRV, feature flags, workspace.dependencies, cargo sort, cargo outdated) |
| [rust-async.md](rust-async.md) | Async patterns (tokio, JoinSet, CancellationToken, Send+Sync, block_on, tokio::select!, Arc) |
