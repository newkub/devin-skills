# How It Works

## สถาปัตยกรรม Turborepo

```
┌─────────────────────────────────────────────────────────┐
│                    turbo.json                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Tasks Configuration                            │  │
│  │  - dependsOn                                    │  │
│  │  - inputs                                       │  │
│  │  - outputs                                      │  │
│  │  - env                                          │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Task Graph Builder                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Build dependency graph from tasks              │  │
│  │  - Topological sort                             │  │
│  │  - Parallel execution planning                  │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Cache Engine                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  - Hash inputs (files, env, config)            │  │
│  │  - Check local cache                           │  │
│  │  - Check remote cache                          │  │
│  │  - Restore or execute                          │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 Task Executor                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  - Run tasks in parallel                        │  │
│  │  - Respect dependencies                         │  │
│  │  - Capture outputs                              │  │
│  │  - Upload to remote cache                       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Execution Flow

### 1. Configuration Loading

อ่าน `turbo.json` และ `package.json` จากทุก workspace

### 2. Task Graph Construction

สร้าง dependency graph จาก:
- Task dependencies (`dependsOn`)
- Workspace dependencies (package.json)
- Global dependencies

### 3. Cache Key Generation

สร้าง hash จาก:
- Input files (`inputs`)
- Environment variables (`env`)
- Global dependencies
- Task configuration

### 4. Cache Lookup

ตรวจสอบ cache:
1. Local cache (`.turbo/cache`)
2. Remote cache (ถ้าเปิดใช้งาน)

### 5. Task Execution

ถ้า cache miss:
- Run task
- Capture outputs
- Upload to remote cache

### 6. Output Restoration

ถ้า cache hit:
- Restore outputs จาก cache
- Skip task execution

## Affected Mode

ใช้ git history เพื่อระบุ workspaces ที่ได้รับผลกระทบ:

```bash
# เปรียบเทียบกับ base branch
turbo run build --affected

# เปรียบเทียบกับ commit เฉพาะ
turbo run build --affected --base=main --head=feature
```

## Performance Optimization

- **Parallel Execution** - Run tasks พร้อมกันตาม dependency graph
- **Incremental Builds** - Run เฉพาะ tasks ที่จำเป็น
- **Remote Cache** - แชร์ cache ระหว่างทีม
- **Smart Hashing** - Hash เฉพาะ inputs ที่สำคัญ
