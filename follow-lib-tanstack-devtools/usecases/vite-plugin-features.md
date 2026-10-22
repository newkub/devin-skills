# Use Case — Configure Source Inspection, Console Piping, and the Event Bus

> Turn on the Vite plugin features that make the workbench useful, and turn off the ones that get in the way. Source: https://tanstack.com/devtools/latest/docs/vite-plugin (accessed 2026-10-20)

## 1. Install and place the plugin first

```bash
npm install -D @tanstack/devtools-vite
```

```ts
// vite.config.ts
import { devtools } from '@tanstack/devtools-vite'

export default {
  plugins: [devtools(), /* rest of your plugins */],
}
```

First in the array matters: source injection and build stripping must run before other plugins transform the module graph.

## 2. Enable go-to-source

```ts
devtools({
  injectSource: {
    enabled: true,
    ignore: {
      files: ['node_modules', /.*\.test\.(js|ts|jsx|tsx)$/],
      components: ['VirtualizedList', /.*Lazy$/],
    },
  },
})
```

Hold the inspect hotkey (default Shift+Alt+Ctrl/Meta), then click an element to open its exact file and line. The plugin injects `data-tsd-source` attributes through an AST transform, so ignoring generated components keeps the transform cheap.

## 3. Add an editor escape hatch

```ts
devtools({
  editor: {
    name: 'VSCode',
    open: async (path, lineNumber, columnNumber) => {
      const { exec } = await import('node:child_process')
      exec(
        `code -g "${path.replaceAll('$', '\\$')}${lineNumber ? `:${lineNumber}` : ''}${columnNumber ? `:${columnNumber}` : ''}"`,
      )
    },
  },
})
```

`launch-editor` handles most editors automatically. Override `editor.open` only when the default cannot find the binary.

## 4. Tune console piping

```ts
devtools({
  consolePiping: {
    enabled: true,
    levels: ['log', 'warn', 'error'],
  },
})
```

Browser logs appear in the terminal and server logs appear in the browser console. In an app that logs on every render, narrow `levels` or the terminal becomes unusable.

## 5. Disable the bus where it cannot work

```ts
devtools({
  eventBusConfig: {
    enabled: false,
  },
})
```

Storybook and Vitest do not run the app's Vite dev server, so the WebSocket/SSE event bus has nothing to connect to. Disable it there rather than debugging connection retries.

## 6. Keep logging on while wiring

```ts
devtools({ logging: true })
```

`logging` defaults to `true` and reports which sub-plugins activated. Turn it off only after the setup works — it is the fastest signal that a devtools feature did not load.

## 7. Verify

1. `/run-dev` — the console shows the devtools plugin activation lines
2. Hold the inspect hotkey and click a component — the editor opens the right file and line
3. A `console.log` in the browser appears in the terminal, and a server log appears in the browser console
4. A test run or Storybook session starts with no event-bus retry noise
5. `/run-build` — production output still has no devtools code

## Pitfalls

- Placing `devtools()` after a framework plugin, so source attributes are stripped or never injected.
- Enabling source injection across `node_modules`, which slows dev startup for no benefit.
- Piping every console level in a chatty app, making the terminal unreadable.
- Leaving the event bus enabled in Vitest, where connection retries dominate the test output.
- Turning `logging` off before the setup is verified, then guessing why a feature is missing.
- Assuming console piping works without the Vite dev server — preview builds do not run it.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/quick-start-framework-adapter.md`
- `usecases/keep-devtools-out-of-production.md`
