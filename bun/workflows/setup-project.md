# Setup Project

## Execute

### Initialize Project

```bash
bun init
bun init -y
```

### Install Dependencies

```bash
bun add package-name
bun add -D typescript @types/node
```

### Configure TypeScript

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["bun-types"]
  }
}
```

### Add Scripts

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build src/index.ts --outdir ./dist",
    "test": "bun test",
    "lint": "bunx eslint .",
    "format": "bunx prettier --write ."
  }
}
```

### Create Entry Point

```typescript
console.log("Hello from Bun!");
```

### Run Development

```bash
bun run dev
bun --watch run src/index.ts
```

## Rules

- ใช้ `bun add` แทน `bun install` เสมอ
- ใช้ `bunx` แทน `npx` เสมอ
- ใช้ TypeScript strict mode
- ใช้ `bun-types` สำหรับ type definitions
- ใช้ `bun --watch` สำหรับ development
