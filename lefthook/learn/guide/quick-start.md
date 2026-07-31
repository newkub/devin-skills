# Quick Start

เริ่มต้นใช้งาน Lefthook อย่างรวดเร็ว

## Installation

```bash
bun add -D lefthook
bunx lefthook install
```

## Basic Configuration

สร้าง `lefthook.yml`:

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: bun run lint
    test:
      run: bun test
```

## Run Hooks Manually

```bash
bunx lefthook run pre-commit
```

## Common Hooks

```yaml
pre-commit:
  commands:
    format:
      run: bun run format

pre-push:
  commands:
    test:
      run: bun test

commit-msg:
  commands:
    conventional-commit:
      run: bunx commitlint --edit $1
```

## Tips

- **Use Parallel**: เปิด parallel execution เพื่อความเร็ว
- **Group Commands**: จัดกลุ่ม commands ที่เกี่ยวข้องกัน
- **Skip Hooks**: ใช้ `--no-verify` เพื่อ skip hooks
