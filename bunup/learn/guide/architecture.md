# Architecture

สถาปัตยกรรมภายในของ Bunup

## Overview

Bunup เป็น wrapper รอบ Bun's native bundler ที่เพิ่มความสามารถพิเศษสำหรับ library development

```
┌─────────────────────────────────────────────────────────┐
│                        BUNUP                            │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    CLI      │  │   Config    │  │   Plugins   │     │
│  │  Interface  │  │   Parser    │  │   System    │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │            │
│         └────────────────┼────────────────┘            │
│                          ▼                              │
│              ┌───────────────────┐                      │
│              │   Build Options    │                      │
│              │      Pipeline      │                      │
│              └─────────┬─────────┘                      │
│                        │                                │
│                        ▼                                │
│              ┌───────────────────┐                      │
│              │   Bun Bundler     │                      │
│              │    (esbuild)      │                      │
│              └─────────┬─────────┘                      │
│                        │                                │
│         ┌──────────────┼──────────────┐                 │
│         ▼              ▼              ▼                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │    JS     │  │    DTS    │  │  Plugins  │           │
│  │  Output   │  │  Output   │  │  Output   │           │
│  └───────────┘  └───────────┘  └───────────┘           │
└─────────────────────────────────────────────────────────┘
```

## Components

### 1. CLI Interface

```typescript
// แยกวิเคราะห์ CLI arguments
interface CLIOptions {
  entry?: string[];
  outDir?: string;
  format?: string[];
  target?: "node" | "browser" | "bun";
  watch?: boolean;
  // ... more options
}
```

### 2. Configuration Parser

```typescript
// อ่าน bunup.config.ts
interface BunupConfig {
  entry?: string | string[];
  outDir?: string;
  format?: Format[];
  // ... config options
}

function defineConfig(config: BunupConfig): BunupConfig;
function defineConfig(configs: BunupConfig[]): BunupConfig[];
```

### 3. Build Pipeline

```
Input → Parse → Transform → Bundle → Output
```

#### Entry Resolution

```typescript
// ค้นหา entry points
function resolveEntries(entries: string[]): string[];
```

#### Module Graph

```typescript
// สร้าง dependency graph
interface ModuleGraph {
  entries: string[];
  imports: Map<string, string[]>;
  externals: string[];
}
```

### 4. Plugin System

```typescript
interface BunupPlugin {
  name: string;
  setup(builder: BunupBuilder): void | Promise<void>;
}

interface BunupBuilder {
  onBuild(callback: BuildCallback): void;
  onEnd(callback: EndCallback): void;
  writeFile(path: string, content: string): void;
}
```

### 5. Type Declarations

```typescript
// สร้าง .d.ts files
interface DTSOptions {
  splitting?: boolean;
  minify?: boolean;
  resolve?: boolean | string[];
  inferTypes?: boolean;
  tsgo?: boolean;
}
```

## Data Flow

```
1. User Input (CLI/Config)
         │
         ▼
2. Merge Options
   CLI args + Config + Defaults
         │
         ▼
3. Entry Point Resolution
   Find source files
         │
         ▼
4. Dependency Analysis
   Build module graph
         │
         ▼
5. Bun Bundler Execution
   Bundle JS/TS files
         │
         ▼
6. Plugin Execution
   Post-processing
         │
         ▼
7. Type Declaration Generation
   Create .d.ts files
         │
         ▼
8. Output
   dist/ directory
```

## File Structure

```
lib-bunup/
├── src/
│   ├── cli.ts           # CLI entry point
│   ├── config.ts        # Config parser
│   ├── builder.ts       # Build orchestrator
│   ├── bundler.ts       # Bun wrapper
│   ├── dts.ts           # Type declaration generator
│   ├── plugins/
│   │   ├── index.ts     # Plugin exports
│   │   ├── copy.ts      # Copy plugin
│   │   └── tailwindcss.ts
│   └── utils/
│       ├── path.ts      # Path utilities
│       ├── fs.ts        # File system utilities
│       └── types.ts     # Type definitions
└── dist/                # Compiled output
```

## Performance Architecture

### Parallel Processing

```typescript
// Type declarations ใช้ parallel processing
async function generateDeclarations(entries: string[]) {
  return Promise.all(
    entries.map(entry => generateDTS(entry))
  );
}
```

### Caching

```typescript
// ใช้ Bun's built-in caching
interface Cache {
  get(key: string): Promise<unknown> | null;
  set(key: string, value: unknown): void;
  invalidate(pattern: string): void;
}
```

### Incremental Builds

```typescript
// เฉพาะ rebuild ไฟล์ที่เปลี่ยน
interface IncrementalBuild {
  changed: string[];
  unchanged: string[];
  rebuild(changed: string[]): void;
}
```

## Configuration Merging

```typescript
// Priority: CLI > Config > Defaults
function mergeConfig(
  cli: CLIOptions,
  config: BunupConfig,
  defaults: BunupConfig
): BunupConfig {
  return {
    ...defaults,
    ...config,
    ...cli,
  };
}
```

## Error Handling

```typescript
interface BunupError extends Error {
  code: string;
  file?: string;
  line?: number;
  column?: number;
}

function handleError(error: BunupError): void {
  console.error(`[bunup] ${error.code}: ${error.message}`);
  if (error.file) {
    console.error(`  at ${error.file}:${error.line}:${error.column}`);
  }
  process.exit(1);
}
```

## Extension Points

### Custom Plugins

```typescript
import type { BunupPlugin } from "bunup";

export function myPlugin(): BunupPlugin {
  return {
    name: "my-plugin",
    setup(builder) {
      builder.onBuild(({ entries }) => {
        // Custom logic
      });
    },
  };
}
```

### Custom Loaders

```typescript
// รองรับ custom loaders ผ่าน config
export default defineConfig({
  loader: {
    ".svg": "text",
    ".json": "json",
    ".css": "css",
  },
});
```
