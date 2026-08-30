# moonrepo Advanced Features

## Smart Hashing

moon hash inputs (source files, dependencies, configuration) เพื่อ determine cache validity

### Hash Inputs

```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'src/**/*'        # source files
      - 'package.json'    # dependencies
      - 'tsconfig.json'   # configuration
```

### Hash Calculation Flow

1. Read inputs → 2. Calculate hash → 3. Compare with cache → 4. Return cached outputs if match

### Benefits

- Skip rebuilds ถ้า inputs ไม่เปลี่ยน
- Cache build outputs ตาม hash
- Share cache ทั่ง team

## Caching

### Local Caching

```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true          # enable (default)
```

### Remote Caching

```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
      remote: true
```

### Disable Caching

```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: false
```

## Affected Projects

ใช้ `--affected` เพื่อรัน tasks เฉพาะใน projects ที่มีการเปลี่ยนแปลง

```sh
moon run build --affected          # build affected only
moon run test --affected           # test affected only
moon run --affected                # all tasks affected
```

moon detect affected projects: projects ที่เปลี่ยน, projects ที่ dependent กัน, projects ที่มี dependency เปลี่ยน

## Project Grouping

### By Type

```yaml
projects:
  apps:
    - 'apps/*'
  packages:
    - 'packages/*'
  tools:
    - 'tools/*'
```

### By Domain

```yaml
projects:
  frontend:
    - 'apps/web/*'
    - 'apps/mobile/*'
  backend:
    - 'apps/api/*'
  shared:
    - 'packages/*'
```

### By Team

```yaml
projects:
  team-a:
    - 'apps/team-a/*'
    - 'packages/team-a/*'
  team-b:
    - 'apps/team-b/*'
    - 'packages/team-b/*'
```

### Run by Group

```sh
moon run build --project apps
moon run build --project apps --project packages
```

## How It Works

### Execution Flow

```
User Command → moon CLI → Read moon.yml → Resolve Projects
→ Resolve Tasks → Calculate Hashes → Check Cache
→ Execute Tasks (if not cached) → Cache Outputs
```

### Steps

1. Command Parsing — parse task name, options, filters
2. Configuration Loading — read `moon.yml`, project configs, merge
3. Project Resolution — find matching projects, filter, sort by dependencies
4. Task Resolution — find tasks, resolve dependencies, create execution graph
5. Hash Calculation — hash source files, dependencies, configuration
6. Cache Check — check local + remote cache, return cached if available
7. Task Execution — parallel (independent) or sequential (dependent)
8. Cache Storage — store outputs in local + remote cache

## Best Practices

### Configuration

- Group projects ตาม type/domain/team สำหรับ organization
- Define `inputs` สำหรับ smart hashing
- Define `outputs` สำหรับ caching

### Task Design

- ใช้ `deps` สำหรับ task ordering
- ใช้ parallel execution เมื่อ tasks independent
- ตั้งชื่อ task สม่ำเสมอ: `build`, `test`, `lint`, `dev`

### Performance

- ใช้ `--affected` เพื่อรันเฉพาะที่จำเป็น
- เปิด caching สำหรับ tasks ที่เหมาะสม
- Monitor cache hit rate

### Common Pitfalls

- หลีกเลี่ยง projects ที่เยอะเกินไป — group และ filter
- อย่าลืม `inputs`/`outputs` — ต้อง define สำหรับ smart hashing และ caching
- อย่าลืม `deps` — define dependencies สำหรับ ordering

## Source

- Docs: https://moonrepo.dev/docs
- Core reference: [moonrepo.md](moonrepo.md)
