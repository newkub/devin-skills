# Bun CLI Reference

## Overview

Bun is a fast all-in-one JavaScript runtime with a built-in package manager, bundler, transpiler, and test runner. It is a single, dependency-free binary that runs on macOS, Linux, and Windows.

## Install

```sh
# Unix (curl)
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
iex "& {$(irm https://bun.sh/install.ps1)}"

# npm
bun add -g bun

# Homebrew
brew install bun

# Docker
docker run --rm oven/bun --version
```

## Version

- Latest: `1.4.0`
- License: MIT
- Repository: https://github.com/oven-sh/bun
- Docs: https://bun.sh/docs

## Verify Installation

```sh
bun --version
bun --revision
```

## Upgrade

```sh
bun upgrade    # download and install latest stable
```

## Package Manager

```sh
bun install                    # install all dependencies
bun add <pkg>                  # add dependency
bun add <pkg>@1.2.3            # add specific version
bun add <pkg>@latest           # add latest tag
bun add -d <pkg>               # add devDependency
bun remove <pkg>               # remove dependency
bun update                     # update all dependencies
```

## Running Scripts

```sh
bun run <script>               # run package.json script
bun run src/index.ts           # run TypeScript file directly
bun src/index.ts               # shorthand for bun run
bunx <command>                 # execute bin from local or remote package
```

## Bun Native APIs

### File I/O

```ts
// Read file
const file = Bun.file("package.json");
const text = await file.text();
const json = await file.json();
const buffer = await file.arrayBuffer();

// Write file
await Bun.write("output.txt", "Hello World");
await Bun.write("data.json", JSON.stringify(data));
```

### Spawn Processes

```ts
const proc = Bun.spawn(["echo", "hello"]);
await proc.exited;

// with stdout capture
const proc = Bun.spawn(["ls", "-la"], {
  stdout: "pipe",
});
const output = await new Response(proc.stdout).text();
```

### Glob

```ts
import { Glob } from "bun";

const glob = new Glob("**/*.ts");
for await (const path of glob.scan(".")) {
  console.log(path);
}
```

### Shell (bun:shell)

```ts
import { $ } from "bun";

await $`echo hello`;
await $`cargo build`;
const result = await $`ls *.ts`.text();
```

## CLI Libraries for Bun

### cac (argument parser)

```sh
bun add cac
```

- Version: `7.0.0`
- ESM-only (requires Node.js >= 20.19.0 or Bun)
- Zero dependencies

```ts
import cac from "cac";

const cli = cac();

cli
  .command("build [project]", "Build a project")
  .option("--out <dir>", "Output directory")
  .option("--minimize", "Minimize output")
  .action((project, options) => {
    console.log(project, options.out, options.minimize);
  });

cli.help();
cli.version("1.0.0");
cli.parse();
```

### picocolors (terminal colors)

```sh
bun add picocolors
```

- Version: `1.1.1`
- Zero dependencies, ISC license
- Smallest and fastest terminal color library

```ts
import pc from "picocolors";

console.log(pc.green("Success!"));
console.log(pc.red(pc.bold("Error!")));
console.log(pc.cyan("Info: ") + pc.dim("details"));
```

### bunup (bundler)

```sh
bun add -d bunup
```

- Version: `0.16.32`
- Built on Bun's native bundler

```ts
// bunup.config.ts
import { defineConfig } from "bunup";

export default defineConfig({
  dts: { splitting: true },
  packages: "bundle",  // zero runtime dependencies
});
```

## package.json Scripts Example

```json
{
  "scripts": {
    "dev": "bun run src/presentation/cli.ts",
    "build": "bunx bunup",
    "build:watch": "bunx bunup --watch",
    "lint": "bunx tsc --noEmit && bunx biome lint --write",
    "test": "bun test"
  }
}
```

## Test Runner

```sh
bun test                    # run all tests
bun test src/               # run tests in directory
bun test --watch            # watch mode
```

## Source

- Docs: https://bun.sh/docs
- Installation: https://bun.sh/docs/installation
- Package manager: https://bun.sh/docs/pm/cli/install
- Upgrade: https://bun.sh/docs/guides/util/upgrade
- cac: https://github.com/cacjs/cac
- picocolors: https://npmjs.com/package/picocolors
- bunup: https://npmjs.com/package/bunup
