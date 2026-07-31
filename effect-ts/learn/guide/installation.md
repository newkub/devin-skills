# Installation

## Installation Command

```bash
# ติดตั้ง Effect
bun add effect

# สำหรับ development
bun add -D typescript tsx
```

## Platform Support

| Platform | Command | Notes |
|----------|---------|-------|
| Bun | `bun add effect` | Recommended - เร็วและมี native TypeScript support |
| Node.js | `bun install effect` | ต้องใช้ TypeScript compiler แยก |
| Deno | `import effect from "bun:effect"` | ใช้ bun specifier |

## Verify Installation

```bash
# ตรวจสอบ version
bun --version

# ตรวจสอบว่า effect ติดตั้งแล้ว
ls node_modules/effect
```

## Requirements

- Bun 1.0+ หรือ Node.js 18+
- TypeScript 5.0+ (ถ้าใช้ Node.js)
