# Architecture

## สถาปัตยกรรมระบบ Turborepo

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ turbo run    │  │ turbo login  │  │ turbo prune  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Configuration Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ turbo.json   │  │ package.json │  │ .env files   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Task Graph Engine                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Dependency   │  │ Topological  │  │ Parallel     │   │
│  │ Resolution   │  │ Sort         │  │ Execution    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Cache Engine                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Input Hasher │  │ Local Cache  │  │ Remote Cache │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Task Executor                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Process      │  │ Output       │  │ Cache        │   │
│  │ Spawner      │  │ Capture      │  │ Upload       │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Input Phase

```
User Command → CLI Parser → Config Loader → Workspace Discovery
                                                    ↓
                                            Task Graph Builder
```

### 2. Planning Phase

```
Task Graph Builder → Dependency Resolution → Topological Sort
                                                      ↓
                                              Execution Plan
```

### 3. Cache Phase

```
Execution Plan → Input Hashing → Cache Lookup (Local → Remote)
                                                     ↓
                                            Cache Hit/Miss Decision
```

### 4. Execution Phase

```
Cache Miss → Task Spawner → Process Execution → Output Capture
                                                          ↓
                                                    Cache Upload
```

### 5. Output Phase

```
Cache Hit → Output Restoration → User Output
```

## Cache Architecture

### Local Cache

```
.turbo/cache/
├── artifacts/
│   ├── [hash].json
│   └── [hash].tar.gz
└── meta/
    └── cache.json
```

### Remote Cache

```
Remote Cache API
├── GET /artifacts/[hash]     - Download artifact
├── PUT /artifacts/[hash]     - Upload artifact
├── HEAD /artifacts/[hash]    - Check existence
└── DELETE /artifacts/[hash]  - Delete artifact
```

## Task Graph

### Dependency Graph

```
┌─────────┐
│  ui     │
└────┬────┘
     │
     ↓
┌─────────┐
│  web    │
└────┬────┘
     │
     ↓
┌─────────┐
│  api    │
└─────────┘
```

### Execution Graph

```
Level 1: ui (parallel)
Level 2: web (parallel)
Level 3: api (parallel)
```

## Performance Characteristics

### Scalability

- **Linear scaling** กับจำนวน workspaces
- **Sublinear scaling** กับ cache hit rate
- **Constant overhead** สำหรับ task execution

### Bottlenecks

- **Hash computation** - Input hashing
- **Cache I/O** - Disk/network operations
- **Process spawning** - Task startup overhead

## Security Architecture

### Cache Signing

```
Artifact → HMAC Sign → Upload → Verify Signature → Restore
```

### Environment Variables

- **Sensitive env** - Hash แต่ไม่ store
- **Public env** - Hash และ store
- **Global env** - Hash สำหรับทุก tasks

## Observability Architecture

### Metrics

```
Task Execution → Metrics Collector → Export (OTLP) → Observability Platform
```

### Logging

```
Task Output → Log Aggregator → UI Display → Log Storage
```
