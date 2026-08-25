# Cargo Workspace Configuration

A workspace is a collection of one or more packages managed together. All packages share a common `Cargo.lock` and output directory (`target/`).

## Virtual Workspace

Root `Cargo.toml` with no `[package]`:

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["hello_world"]
resolver = "3"
```

```toml
# [PROJECT_DIR]/hello_world/Cargo.toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2024"
```

## Root Package Workspace

```toml
[workspace]

[package]
name = "hello_world"
version = "0.1.0"
```

## Members and Exclude

```toml
[workspace]
members = ["member1", "path/to/member2", "crates/*"]
exclude = ["crates/foo", "path/to/other"]
```

The `members` list supports globs (`*` and `?`). Path dependencies inside the workspace directory automatically become members.

## Default Members

```toml
[workspace]
members = ["path/to/member1", "path/to/member2", "path/to/member3/*"]
default-members = ["path/to/member2", "path/to/member3/foo"]
```

## Workspace Package Inheritance (MSRV 1.64+)

Define shared keys in `workspace.package` and inherit in members:

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["bar"]

[workspace.package]
version = "1.2.3"
authors = ["Nice Folks"]
description = "A short description of my package"
documentation = "https://example.com/bar"
```

```toml
# [PROJECT_DIR]/bar/Cargo.toml
[package]
name = "bar"
version.workspace = true
authors.workspace = true
description.workspace = true
documentation.workspace = true
```

Supported inheritable keys: `authors`, `categories`, `description`, `documentation`, `edition`, `exclude`, `homepage`, `include`, `keywords`, `license`, `license-file`, `publish`, `readme`, `repository`, `rust-version`, `version`.

## Workspace Dependencies (MSRV 1.64+)

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["bar"]

[workspace.dependencies]
cc = "1.0.73"
rand = "0.8.5"
regex = { version = "1.6.0", default-features = false, features = ["std"] }
```

```toml
# [PROJECT_DIR]/bar/Cargo.toml
[package]
name = "bar"
version = "0.2.0"

[dependencies]
regex = { workspace = true, features = ["unicode"] }

[build-dependencies]
cc.workspace = true

[dev-dependencies]
rand.workspace = true
```

## Workspace Lints (MSRV 1.74+)

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["crates/*"]

[workspace.lints.rust]
unsafe_code = "forbid"
```

```toml
# [PROJECT_DIR]/crates/bar/Cargo.toml
[package]
name = "bar"
version = "0.1.0"

[lints]
workspace = true
```
