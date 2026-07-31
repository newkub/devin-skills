# CLI

## Effect CLI Commands

Effect มี CLI สำหรับ development workflow ที่ช่วยให้ development และ testing ง่ายขึ้น

```bash
# Install globally (optional)
bun install -g effect-cli
```

## Commands

| Command | Description |
|---------|-------------|
| `effect typecheck` | Run TypeScript type checking |
| `effect compile` | Compile Effect programs |
| `effect test` | Run tests with Effect runtime |

## Common Usage

### Type Checking

```bash
# Check all files
effect typecheck

# Check specific files
effect typecheck src/**/*.ts

# Watch mode
effect typecheck --watch
```

### Running Programs

```bash
# Using tsx (recommended for development)
tsx src/index.ts

# Using bun
bun run src/index.ts

# Using node with experimental import
node --import effect src/index.ts
```

## VS Code Extension

Install the Effect extension for VS Code:
- Syntax highlighting
- Type inference
- Error highlighting
- Code completion for Effect operations

## Project Scripts

```json
{
  "scripts": {
    "typecheck": "effect typecheck",
    "test": "effect test",
    "dev": "tsx src/index.ts"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```