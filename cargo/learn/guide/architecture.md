# Architecture

## System Architecture ของ Cargo

## High-Level Architecture

Cargo มี architecture แบบ layered:

```
┌─────────────────────────────────────┐
│         CLI Layer                   │
│  (cargo binary)                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Command Layer                  │
│  (build, test, run, etc.)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Operations Layer               │
│  (cargo_compile, resolve_ws)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Core Layer                   │
│  (Workspace, Resolver, Compiler)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Infrastructure Layer             │
│  (GlobalContext, Sources, Shell)     │
└─────────────────────────────────────┘
```

## Core Components

### 1. GlobalContext

Central configuration manager:

```rust
pub struct GlobalContext {
    shell: Shell,
    config: Config,
    target_dir: PathBuf,
}
```

### 2. Workspace

Coordinates package metadata:

```rust
pub struct Workspace {
    root: PathBuf,
    members: Vec<Package>,
    config: Config,
}
```

### 3. Resolver

Dependency resolution:

```rust
pub struct Resolver {
    registry: PackageRegistry,
    features: FeatureSet,
}
```

### 4. Compiler

Build orchestration:

```rust
pub struct Compiler {
    context: BuildContext,
    unit_graph: UnitGraph,
}
```

## Build Pipeline

```
┌─────────────┐
│  Manifest   │
│  Parsing    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Workspace   │
│  Discovery  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dependency │
│ Resolution  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Source     │
│  Fetching   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Unit Graph │
│  Generation │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Compilation │
│  Execution  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Artifacts  │
└─────────────┘
```

## Dependency Resolution

Cargo ใช้ PubGrub algorithm:

```
┌─────────────┐
│  Initial    │
│  Request    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Version    │
│  Selection  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Conflict   │
│  Detection  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backtrack  │
│  Search     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Lockfile   │
│  Generation │
└─────────────┘
```

## Source Abstraction

Cargo รองรับหลาย sources:

```rust
pub trait Source {
    fn query(&self, dep: &Dependency) -> Result<Vec<PackageId>>;
    fn download(&self, id: &PackageId) -> Result<PathBuf>;
}
```

### Registry Source

- crates.io
- Custom registries

### Git Source

- GitHub
- GitLab
- Bitbucket

### Path Source

- Local filesystem
- Workspace members

## Compilation Model

### Unit Graph

แต่ละ unit คือ:

```rust
pub struct Unit {
    pkg: PackageId,
    target: Target,
    profile: Profile,
    mode: CompilationMode,
}
```

### Job Queue

Parallel compilation:

```
┌─────────────┐
│  Job Queue  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Executor   │
│  (rustc)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Jobserver  │
│  (limits)   │
└─────────────┘
```

## Configuration System

Configuration hierarchy:

```
1. CLI flags
2. Environment variables
3. .cargo/config.toml (project)
4. ~/.cargo/config.toml (user)
5. /etc/cargo/config.toml (system)
```

## Caching Strategy

### Registry Cache

```
~/.cargo/registry/
├── cache/
│   └── serde-1.0.150.crate
└── src/
    └── serde-1.0.150/
```

### Git Cache

```
~/.cargo/git/
└── db/
    └── github.com-user-repo-<hash>/
```

### Build Cache

```
target/
├── debug/
│   ├── .fingerprint/
│   └── deps/
└── release/
```

## Workspace Architecture

```
workspace/
├── Cargo.toml (workspace)
├── Cargo.lock
├── crates/
│   ├── core/
│   │   ├── Cargo.toml
│   │   └── src/
│   ├── api/
│   │   ├── Cargo.toml
│   │   └── src/
│   └── cli/
│       ├── Cargo.toml
│       └── src/
```

### Workspace Resolution

1. Parse workspace manifest
2. Discover members
3. Resolve shared dependencies
4. Build in topological order
5. Share build cache

## Next Steps

- อ่าน [structure.md](./structure.md) สำหรับ project structure
- อ่าน [troubleshooting.md](./troubleshooting.md) สำหรับ troubleshooting
