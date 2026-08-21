# Installation

## Requirements

- macOS 12.0+
- Raycast app installed
- Node.js 18+
- bun or yarn

## Install Raycast CLI

```bash
# Using bun
bun install -g @raycast/api

# Using Homebrew
brew install raycast
```

## Create New Extension

### Using CLI

```bash
# Interactive creation
raycast create

# With template
raycast create my-extension --template list
raycast create my-extension --template form
raycast create my-extension --template launcher
```

### Manual Setup

```bash
# Create project directory
mkdir my-extension
cd my-extension

# Initialize bun
bun init -y

# Install Raycast API
bun install @raycast/api

# Install TypeScript
bun install -D typescript @types/react @types/node

# Create tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

## Project Structure

```
my-extension/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.tsx          # Extension entry
│   ├── commands/
│   │   └── my-command.tsx
│   └── components/
│       └── my-component.tsx
└── assets/
    └── icon.png
```

## Create Manifest

```json
// manifest.json
{
  "manifestVersion": 1,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "My Raycast extension",
  "icon": "assets/icon.png",
  "commands": [
    {
      "name": "my-command",
      "title": "My Command",
      "description": "Does something useful",
      "mode": "view"
    }
  ]
}
```

## Create Command

```typescript
// src/index.tsx
import { List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Hello from Raycast!" />
    </List>
  );
}
```

## Run Development Mode

```bash
# Start dev server
raycast dev

# Or from project directory
cd my-extension
raycast dev
```

## Hot Reload

- Changes to code auto-reload in Raycast
- Edit command name in manifest to reset state
- Use `raycast dev --force` to restart

## Test Extension

1. Open Raycast (⌘ + Space)
2. Type your command name
3. Extension executes and shows UI

## Build for Distribution

```bash
# Build production version
raycast build

# Creates .rsext file
```

## Install Locally (Development)

```bash
# Link extension to Raycast
raycast dev --install
```

## Troubleshooting

### Extension not appearing

- Check `raycast dev` is running
- Verify manifest.json is valid
- Run `raycast dev --verbose` for debug output

### TypeScript errors

- Check tsconfig.json settings
- Verify @raycast/api version
- Run `npx tsc --noEmit` to check

### Module not found

- Run `bun install` in project directory
- Check node_modules exists
- Verify package.json dependencies

## Update Raycast CLI

```bash
bun update -g @raycast/api
```

## Remove Extension

```bash
# Stop dev server
# Press ⌘ + C in terminal

# Uninstall from Raycast
# Open Raycast → Extensions → Right-click → Remove
```

## Resources

| Resource | Link |
|----------|------|
| Raycast API Docs | https://developers.raycast.com/ |
| GitHub Examples | https://github.com/raycast/extensions |
| Community | https://raycast.com/community |
