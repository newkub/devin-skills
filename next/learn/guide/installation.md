# Installation

## Requirements

- Node.js 18.17 หรือ newer
- bun, yarn, bun, หรือ bun

## Create New Project

```bash
npx create-next-app@latest my-app
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| TypeScript | Yes | Use TypeScript |
| ESLint | Yes | Setup ESLint |
| Tailwind CSS | Yes | Use Tailwind CSS |
| `src/` | No | Use src directory |
| App Router | Yes | Use App Router |

## Manual Setup

```bash
mkdir my-app
cd my-app
bun init -y
bun install next react react-dom
bun install -D typescript @types/react @types/node
```

## Add Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Verify Installation

```bash
bun run dev
```

เปิด http://localhost:3000
