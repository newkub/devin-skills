# CLI Reference - Node.js

## node

```bash
node file.js              # Run file
node --version            # Show version
node --watch file.js      # Watch mode
node --inspect file.js    # Debug mode
```

## npm

```bash
npm init -y                   # Initialize project
bun install                   # Install deps
bun add <pkg>                 # Add package
bun add -D <pkg>              # Dev dependency
npm test                      # Run tests
npm run <script>              # Run script
```

## npx

```bash
npx prettier .
npx create-react-app my-app
```

## pnpm

```bash
pnpm init                     # Initialize project
pnpm install                  # Install deps
pnpm add <pkg>                # Add package
pnpm add -D <pkg>             # Dev dependency
pnpm test                     # Run tests
pnpm <script>                 # Run script
```

## yarn

```bash
yarn init -y                  # Initialize project
yarn                          # Install deps
yarn add <pkg>                # Add package
yarn add -D <pkg>             # Dev dependency
yarn test                     # Run tests
yarn <script>                 # Run script
```

## Core Commands

| Command | Description |
|---|---|
| `node -v` | Node.js version |
| `npm -v` | npm version |
| `pnpm -v` | pnpm version |
| `yarn -v` | yarn version |
| `npm init -y` | Quick init |
| `bun install` | Install deps |
