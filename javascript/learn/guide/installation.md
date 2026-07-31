# Installation

## Node.js Installation

### Windows

1. Download Node.js from https://nodejs.org/
2. Run the installer (.msi)
3. Verify installation:
   ```powershell
   node --version
   bun --version
   ```

### macOS

```bash
# Using Homebrew
brew install node

# Verify
node --version
bun --version
```

### Linux (Ubuntu/Debian)

```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
bun --version
```

## Version Management

### Using nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install LTS version
nvm install --lts

# Install specific version
nvm install 20.10.0

# List installed versions
nvm ls

# Switch version
nvm use 20.10.0
```

### Using n (Node version manager)

```bash
# Install n globally
bun install -g n

# Install LTS
n lts

# Install specific version
n 20.10.0
```

## Package Managers

### bun (Node Package Manager)

Comes with Node.js installation.

```bash
# Initialize project
bun init

# Install package
bun install <package-name>

# Install as dev dependency
bun install -D <package-name>

# Install globally
bun install -g <package-name>

# Update packages
bun update

# List installed packages
bun list
```

### Yarn

```bash
# Install Yarn
bun install -g yarn

# Initialize project
yarn init

# Add dependency
yarn add <package-name>

# Add dev dependency
yarn add -D <package-name>

# Install all dependencies
yarn install
```

### bun

```bash
# Install bun
bun install -g bun

# Initialize project
bun init

# Add dependency
bun add <package-name>

# Install all dependencies
bun install
```

## Development Tools

### VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| ESLint | Linting JavaScript |
| Prettier | Code formatting |
| JavaScript (ES6) code snippets | Code snippets |
| Debugger for Chrome | Browser debugging |

### Runtime Options

| Runtime | Website | Use Case |
|---------|---------|----------|
| **Node.js** | https://nodejs.org | Server-side JS |
| **Deno** | https://deno.land | Secure runtime |
| **Bun** | https://bun.sh | Fast runtime |

## Verify Installation

```bash
# Check Node.js
node --version        # v20.10.0

# Check bun
bun --version         # 10.2.0

# Check npx (package runner)
npx --version

# Check node modules location
bun root -g
```

## Common Issues

| Issue | Solution |
|-------|----------|
| `bun ERR! code EACCES` | Fix bun permissions |
| Node version mismatch | Use nvm to switch versions |
| PATH not set | Restart terminal or add to PATH |