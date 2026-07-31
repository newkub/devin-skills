# How It Works

## วิธีการทำงานของ Cargo

## Build Pipeline

Cargo ทำงานผ่านหลายขั้นตอน:

```
┌─────────────┐
│  Cargo.toml │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Manifest   │
│  Parsing    │
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
│  Build      │
│  Graph      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Compilation │
│  (rustc)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Artifacts  │
└─────────────┘
```

## 1. Manifest Parsing

Cargo อ่านและ parse `Cargo.toml`:

```toml
[package]
name = "my-crate"
version = "0.1.0"

[dependencies]
serde = "1.0"
```

- Validate syntax
- Resolve workspace structure
- Load configuration

## 2. Dependency Resolution

Cargo ใช้ resolver algorithm เพื่อหา versions ที่ compatible:

```
my-crate 0.1.0
├── serde 1.0.0
│   └── serde_derive 1.0.0
└── thiserror 1.0.0
```

- ใช้ PubGrub algorithm
- พิจารณา version constraints
- Handle conflicts
- Generate `Cargo.lock`

## 3. Source Fetching

Cargo ดาวน์โหลด dependencies จาก sources:

- **crates.io** - Default registry
- **Git** - Direct from repositories
- **Path** - Local filesystem
- **Registry** - Custom registries

```bash
cargo fetch
```

## 4. Build Graph Generation

Cargo สร้าง dependency graph สำหรับ compilation:

```
Unit Graph:
├── my-crate (bin)
│   ├── serde (lib)
│   └── thiserror (lib)
└── serde_derive (proc-macro)
```

แต่ละ unit คือ:
- Package
- Target (lib, bin, test)
- Profile (dev, release)
- Mode (test, build)

## 5. Compilation

Cargo เรียก `rustc` สำหรับแต่ละ unit:

```bash
rustc --crate-name my_crate src/main.rs --crate-type bin
```

### Parallel Compilation

Cargo compile หลาย units พร้อมกัน:

```toml
[build]
jobs = 4  # 4 parallel jobs
```

### Incremental Compilation

Cargo compile เฉพาะส่วนที่เปลี่ยน:

- Track file modifications
- Cache compilation results
- Reuse artifacts

## 6. Artifact Generation

สร้าง output files:

```
target/
├── debug/
│   ├── my-crate.exe
│   ├── deps/
│   └── build/
└── release/
    ├── my-crate.exe
    └── deps/
```

## Workspace Build Flow

สำหรับ workspace:

```
workspace/
├── Cargo.toml (workspace)
├── crates/
│   ├── core/
│   │   └── Cargo.toml
│   └── utils/
│       └── Cargo.toml
```

1. Parse workspace manifest
2. Discover all members
3. Resolve shared dependencies
4. Build in topological order
5. Share build cache

## Build Scripts

Build scripts (`build.rs`) run ก่อน compilation:

```
┌─────────────┐
│ build.rs    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Generate    │
│ Code        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Compilation │
└─────────────┘
```

## Testing Flow

```
┌─────────────┐
│ cargo test  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Build Test  │
│ Binaries    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Run Tests   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Report      │
└─────────────┘
```

## Documentation Generation

```
┌─────────────┐
│ cargo doc   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Extract     │
│ Doc Comments│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Generate    │
│ HTML        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ target/doc/ │
└─────────────┘
```

## Caching

Cargo ใช้ cache หลายระดับ:

### Registry Cache
```
~/.cargo/registry/
├── cache/
└── src/
```

### Git Cache
```
~/.cargo/git/
└── db/
```

### Build Cache
```
target/
├── debug/
│   ├── .fingerprint/
│   └── deps/
└── release/
```

## Next Steps

- อ่าน [features.md](./features.md) สำหรับ features ทั้งหมด
- อ่าน [architecture.md](./architecture.md) สำหรับ architecture ละเอียด
