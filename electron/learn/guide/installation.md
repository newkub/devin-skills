# Installation

## Requirements

- Node.js 18+ (LTS recommended)
- bun, yarn, หรือ bun
- Git

## Create New Project

```bash
bun init -y
bun install electron --save-dev
```

## Add Scripts to package.json

```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  }
}
```

## Verify Installation

```bash
bun start
```

## Project Structure

```
project/
├── package.json
├── main.js           # Main process
├── preload.js        # Preload script
├── index.html        # Renderer
└── renderer.js       # Renderer logic
```
