# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `cargo-mutants` |
| Registry | `crates.io` |
| Latest Version | `27.1.0` |
| Release Date | `2026-06-02` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `sourcefrog` (Martin Pool) |
| License | `MIT` |
| Repository | `https://github.com/sourcefrog/cargo-mutants` |
| Website | `https://mutants.rs/` |
| Documentation | `https://mutants.rs/` |
| Releases / Changelog | `https://github.com/sourcefrog/cargo-mutants/releases` |

## Install

```bash
cargo install --locked cargo-mutants
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `mutants` | `crates.io` | `0.0.4` | Proc-macro crate providing `#[mutants::skip]` — add as normal dependency to opt functions out of mutation |

## Notes

- Breaking changes in latest major: `crate uses calendar-style versioning (27.x); see release notes per release`
- Version pinned in SKILL.md: `cargo-mutants@27.1.0` / `mutants@0.0.4`
- Requires Rust toolchain `>=1.88` (crate `rust_version`)
- Source: `https://crates.io/api/v1/crates/cargo-mutants`
