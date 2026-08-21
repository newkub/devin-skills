# Quick Start

เริ่มต้นใช้งาน moonrepo

## Installation

```bash
bun add -D @moonrepo/cli
bunx moon init
```

## Basic Configuration

สร้าง `moon.yml`:

```yaml
projects:
  - 'apps/*'
  - 'packages/*'

tasks:
  build:
    command: 'bun run build'
  test:
    command: 'bun test'
```

## Run Tasks

```bash
# Run task in all projects
bunx moon run build

# Run task in specific project
bunx moon run build --project app

# Run task in affected projects
bunx moon run build --affected
```

## Common Commands

```bash
# List all tasks
bunx moon list

# Run all tasks
bunx moon run

# Run specific task
bunx moon run test
```

## Tips

- **Use Affected**: ใช้ --affected เพื่อรันเฉพาะ projects ที่มีการเปลี่ยนแปลง
- **Use Caching**: เปิด caching เพื่อความเร็ว
- **Use Parallel**: moonrepo รัน tasks แบบ parallel โดย default
