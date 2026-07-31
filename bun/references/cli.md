# CLI Reference - Bun

## bun

```bash
bun [command] [options]
```

## Commands

### bun run

```bash
bun run script.ts
bun run --watch script.ts
bun run --hot script.ts
```

### bun install

```bash
bun install
bun install --frozen-lockfile
bun install --production
```

### bun add

```bash
bun add lodash
bun add @types/node -d
bun add -g prettier
```

### bun remove

```bash
bun remove lodash
```

### bun test

```bash
bun test
bun test --watch
bun test --coverage
bun test test/file.test.ts
```

### bun build

```bash
bun build --outdir=dist src/index.ts
bun build --target=browser src/index.ts
bun build --target=node src/index.ts
bun build --minify src/index.ts
```

### bun create

```bash
bun create
bun create react my-app
bun create next my-app
```

### bun x

```bash
bunx prettier .
bunx typescript --noEmit
```

## Options

| Option | Description |
|--------|-------------|
| `--watch` | Watch for changes |
| `--hot` | Hot reload |
| `--cwd` | Set working directory |
| `--env` | Load env file |

## Common Flags

| Flag | Description |
|------|-------------|
| `-c, --config` | Config file |
| `-d, --dev` | Dev dependency |
| `-g, --global` | Global install |
| `-h, --help` | Show help |
| `-v, --version` | Show version |


---

