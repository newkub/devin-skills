# Installation

## Purpose

สรุป prerequisites และสภาพแวดล้อมสำหรับการเขียนโปรแกรม

## Prerequisites

### Core Tools

| Tool | Description | Required |
|------|-------------|----------|
| **Node.js** | JavaScript runtime | Yes (for JS/TS) |
| **bun/yarn/bun** | Package managers | Yes |
| **TypeScript** | Type-safe JavaScript | Recommended |
| **VS Code** | Code editor | Recommended |
| **Git** | Version control | Yes |

### Environment Setup

### Windows

```bash
# Install Node.js from nodejs.org or use winget
winget install OpenJS.NodeJS

# Verify installation
node --version
bun --version

# Install TypeScript globally
bun install -g typescript

# Verify TypeScript
tsc --version
```

### macOS

```bash
# Install Node.js via Homebrew
brew install node

# Verify installation
node --version
bun --version

# Install TypeScript globally
bun install -g typescript
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js via apt
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
bun --version

# Install TypeScript globally
sudo bun install -g typescript
```

## Recommended Extensions

### VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| ESLint | Linting |
| Prettier | Code formatting |
| TypeScript Hero | Import management |
| GitLens | Git integration |
| Auto Rename Tag | HTML/JSX tag editing |
| Thunder Client | API testing |

### Recommended Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Project Setup

### Create New Project

```bash
# Create project directory
mkdir my-project
cd my-project

# Initialize bun
bun init -y

# Install TypeScript
bun install -D typescript

# Create tsconfig.json
npx tsc --init

# Create source directory
mkdir src
```

### Basic tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Development Workflow

### Daily Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun test` | Run tests |
| `bun run lint` | Run linter |
| `bun run format` | Format code |

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

## Learning Path

| Stage | Topic | Resource |
|-------|-------|----------|
| 1 | Variables & Types | TypeScript handbook |
| 2 | Functions | MDN JavaScript |
| 3 | Objects & Arrays | TypeScript handbook |
| 4 | Classes | TypeScript handbook |
| 5 | Async | TypeScript handbook |
| 6 | Testing | Vitest docs |

## Next Steps

| File | Description |
|------|-------------|
| [quick-start.md](quick-start.md) | Start coding quickly |
| [key-concept.md](key-concept.md) | Programming concepts |