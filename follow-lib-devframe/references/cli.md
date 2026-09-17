# Devframe CLI Reference

> Source: <https://devfra.me/raw/guide/standalone-cli.md>, <https://devfra.me/raw/adapters/cac.md> (verified 2026-09-18)

## `cac` Adapter

`createCac(def)` from `devframe/adapters/cac` wraps the three factories (`createDevServer`, `createBuild`, `createMcpServer`) into one CLI. Requires optional peer `cac` (`bun add cac`).

```ts
import { createCac } from 'devframe/adapters/cac'
import { colors as c } from 'devframe/utils/colors'

await createCac(myDevframe, {
  onReady({ origin }) {
    console.log(c.green`My Tool ready at ${origin}`)
  },
}).parse(process.argv)
```

## Commands

```sh
my-tool                                        # dev server at http://localhost:7777/
my-tool --config ./my.config.mjs               # custom flags via cli.configure()
my-tool --port 8080 --no-open                  # built-in flags
my-tool build --out-dir dist-static            # self-contained static deploy
my-tool build --out-dir dist-static --base /tool/  # custom base
my-tool mcp                                    # stdio MCP server
```

`dev` is the default command. Built-in flags: `--port`, `--host`, `--open` / `--no-open`.

## `cli` Definition Options

```ts
defineDevframe({
  cli: {
    command: 'my-tool',          // binary name; default: the `id`
    port: 9876,                  // preferred port; default: 9999
    portRange: [9876, 10000],    // forwarded to get-port-please
    random: false,               // prefer random open port
    host: 'localhost',           // --host overrides
    open: true,                  // auto-open browser, embeds OTP
    flags: appFlags,             // typed flags via defineCliFlags
    configure(cli) {             // contribute cac options/commands
      cli.option('--my-flag <value>', 'Tool-specific flag')
    },
  },
  setup(ctx, { flags }) { /* parsed cac bag + typed schema flags */ },
})
```

## Typed CLI Flags

Declare with any Standard Schema validator; validated at parse, typed at call site:

```ts
import { defineCliFlags, type InferCliFlags } from 'devframe/adapters/cac'
import * as v from 'valibot'

const appFlags = defineCliFlags({
  depth: v.pipe(v.number(), v.integer()),
  config: v.optional(v.string()),
  verbose: v.optional(v.boolean()),
})

// setup(ctx, info): const flags = info.flags as InferCliFlags<typeof appFlags>
```

Booleans → `--verbose` / `--no-verbose`; others → `--depth <value>`. camelCase keys map to kebab-case flags (`configFile` → `--config-file`). Flags outside the schema pass through. For custom CLI frameworks (commander/yargs), validate a raw bag with `parseCliFlags(schema, rawBag)`.

## Package Layout For A Shipped CLI

```
my-tool/
├── bin.mjs                  # shebang + import './dist/cli.mjs'
├── src/
│   ├── cli.ts               # defineDevframe + createCac
│   ├── rpc.ts               # RPC function definitions
│   └── data.ts              # domain logic
├── app/                     # Nuxt / Vue / React SPA source
├── dist/
│   ├── public/              # built SPA → clientAssets
│   └── cli.mjs              # bundled node entry
└── package.json
```

## Custom CLI Framework

`createCac` is a convenience over three factories — use them directly with commander/yargs/oclif:

- `createDevServer(def, { port, flags, onReady })` → `StartedServer` (`origin`, `port`, `app`, `ws`, `rpcGroup`, `connectionMeta()`, `close()`)
- `createBuild(def, { outDir })`
- `createMcpServer(def, { transport: 'stdio' })`
