# Vivari + TanStack Composition

Each library owns a different layer. Do not let them overlap.

| Layer | Library | Owns |
|-------|---------|------|
| Runtime | Vivari | VFS, processes, dev server, preview |
| UI state | TanStack Store | phases, streaming text, selection, status |
| Collections | TanStack DB | sessions, versions, project snapshots (persisted) |
| Model transport | TanStack AI | streaming adapter, tool calls, abort |

## Shape

```ts
// runtime: authoritative files live in the VFS
const vivari = await Vivari.boot({ timeout: 30_000 })
await vivari.mount(treeFromSnapshot)

// UI state: never mirror the whole tree
const uiStore = new Store({
  phase: "idle" as "idle" | "planning" | "writing" | "running" | "done",
  streamed: "",
  activePath: "src/App.tsx",
  dirty: new Set<string>(),
})

// collections: persisted metadata, not file contents
const projects = createCollection(
  localStorageCollectionOptions({
    storageKey: "create-projects:v1",
    getKey: (p) => p.id,
  }),
)
```

## Generation Pipeline

```ts
async function generate(prompt: string) {
  uiStore.setState((s) => ({ ...s, phase: "planning", streamed: "" }))

  const stream = await chat({
    adapter: createSandboxAdapter(),
    messages: [{ role: "user", content: prompt }],
  })

  for await (const chunk of stream) {
    if (chunk.type !== "text") continue
    uiStore.setState((s) => ({ ...s, phase: "writing", streamed: s.streamed + chunk.delta }))
  }

  const files = parseFiles(uiStore.state.streamed)
  for (const [path, contents] of Object.entries(files)) {
    await vivari.fs.writeFile(path, contents)
  }

  uiStore.setState((s) => ({ ...s, phase: "running" }))
  const proc = await vivari.spawn("npm", ["install"])
  for await (const chunk of proc.output) appendTerminal(chunk)
  if ((await proc.exit) !== 0) {
    uiStore.setState((s) => ({ ...s, phase: "idle" }))
    return
  }

  void vivari.spawn("npm", ["run", "dev"])
  uiStore.setState((s) => ({ ...s, phase: "done" }))
}
```

## Persistence

- Snapshot: `const { files } = await vivari.export("/", { exclude: ["dist"] })` → store the tree in TanStack DB.
- Rehydrate: `await vivari.mount(tree)` on load.
- Keep `node_modules` out of persistence — it is always skipped by `export()` and should be re-installed.
- Version the storage key (`create-projects:v1`) so a schema change does not corrupt old rows.

## Rules

- VFS is the single source of truth for file contents; the store holds only paths, dirty flags, and UI state.
- Stream into one string signal; do not create a signal per chunk.
- Abort the model stream and kill the process on route change.
- Do not put the Vivari instance inside a reactive proxy — use a plain module-level variable plus a status signal.
