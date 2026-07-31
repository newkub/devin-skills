# Programmatic API Reference

## JavaScript/TypeScript API

### Installation

```bash
bun install lefthook
```

### Node.js Usage

```javascript
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

// Run lefthook programmatically
function runLefthook(hook) {
  try {
    execSync(`npx lefthook run ${hook}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Example usage
runLefthook('pre-commit');
```

### TypeScript Usage

```typescript
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

interface LefthookOptions {
  hook: string;
  cwd?: string;
  verbose?: boolean;
  config?: string;
}

function runLefthook(options: LefthookOptions): boolean {
  const { hook, cwd = process.cwd(), verbose = false, config } = options;
  
  let command = `npx lefthook run ${hook}`;
  if (verbose) command += ' -v';
  if (config) command += ` -c ${config}`;
  
  try {
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch {
    return false;
  }
}

// Usage
runLefthook({ hook: 'pre-commit', verbose: true });
```

### Configuration Manipulation

```typescript
import { readFileSync, writeFileSync } from 'fs';

interface CommandConfig {
  run: string;
  glob?: string;
  exclude?: string;
  env?: Record<string, string>;
  cwd?: string;
  priority?: number;
}

interface HookConfig {
  parallel?: boolean;
  commands?: Record<string, CommandConfig>;
  scripts?: Record<string, any>;
}

type LefthookConfig = Record<string, HookConfig>;

function loadConfig(path: string = 'lefthook.yml'): LefthookConfig {
  const content = readFileSync(path, 'utf-8');
  return YAML.parse(content);
}

function saveConfig(config: LefthookConfig, path: string = 'lefthook.yml'): void {
  const yaml = YAML.stringify(config);
  writeFileSync(path, yaml, 'utf-8');
}

// Add a new command
const config = loadConfig();
config['pre-commit'] = config['pre-commit'] || {};
config['pre-commit'].commands = config['pre-commit'].commands || {};
config['pre-commit'].commands['eslint'] = {
  run: 'npx eslint {staged_files}',
  glob: '*.{js,ts}'
};
saveConfig(config);
```

### Validate Configuration

```typescript
import { execSync } from 'child_process';

function validateConfig(configPath: string = 'lefthook.yml'): boolean {
  try {
    execSync(`npx lefthook validate -c ${configPath}`, {
      stdio: 'pipe'
    });
    return true;
  } catch {
    return false;
  }
}
```

### Dump Merged Configuration

```typescript
import { execSync } from 'child_process';

function dumpConfig(): string {
  try {
    return execSync('npx lefthook dump', {
      encoding: 'utf-8'
    });
  } catch (error) {
    return '';
  }
}
```

### Environment Variables

```typescript
process.env.LEFTHOOK = '0';           // Skip all hooks
process.env.SKIP = 'pre-commit';       // Skip specific hooks
process.env.LEFTHOOK_VERBOSE = '1';   // Verbose output
process.env.LEFTHOOK_JSON = '1';      // JSON output
process.env.LEFTHOOK_CONFIG = 'path'; // Custom config
process.env.LEFTHOOK_TIMEOUT = '300'; // Timeout in seconds
```

## See Also

- [CLI Reference](cli.md) - Command-line interface commands
- [Configuration Reference](configuration.md) - Configuration options
- Website: https://lefthook.dev