# Lib Effect Ts CLI

Effect core library ไม่มี CLI — แต่มี `@effect/cli` package สำหรับสร้าง CLI apps:

## Install

```sh
bun add @effect/cli
```

## Usage

```ts
import { Command, Options } from '@effect/cli'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'

const command = Command.make('hello')
const cli = Command.run(command, { name: 'app', version: '1.0.0' })
Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain,
)
```

## Testing

- `bunx vitest` + `@effect/vitest` (`it.effect`, `TestClock`, `TestContext`)
