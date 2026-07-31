# Installation - Bun

## Quick Install

### Linux/macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Via Scoop (Windows)

```powershell
scoop install bun
```

### Via Homebrew

```bash
brew install oven-sh/bun/bun
```

## Verify Installation

```bash
bun --version
```

## Update Bun

```bash
bun upgrade
```

## IDE Setup

### VS Code

Install "Bun" extension by oven-sh

### JetBrains

Built-in support for Bun

## Create New Project

```bash
# Interactive
bun create

# From template
bun create typescript-lib my-lib
bun create next my-app
bun create react my-react-app
```

## Common Commands

```bash
# Run script
bun run script.ts

# Install dependencies
bun install

# Add package
bun add lodash
bun add -d @types/node

# Run tests
bun test

# Build
bun build --outdir=dist src/index.ts

# Start server
bun run start
```

## Environment

### Shell Configuration

```bash
# ~/.bashrc or ~/.zshrc
export PATH="$HOME/.bun/bin:$PATH"
```

## Docker

### Dockerfile

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
EXPOSE 3000
CMD ["bun", "run", "start"]
```
