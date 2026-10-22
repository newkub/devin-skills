# Use Case — Build a Product Panel With a Typed Event Client

> Expose product runtime state beside the library inspectors using one typed event channel. Source: https://tanstack.com/devtools/latest/docs/building-custom-plugins (accessed 2026-10-20)

## 1. Define the event map

```ts
type JobEvents = {
  'job-started': { jobId: string; queue: string }
  'job-progress': { jobId: string; percent: number }
  'job-finished': { jobId: string; durationMs: number }
  reset: void
}
```

Keys are suffixes only. The client prepends `pluginId`, so `pluginId: 'jobs'` plus `job-progress` becomes `jobs:job-progress` on the bus. Use `void` for events with no payload.

## 2. Create the client

```ts
import { EventClient } from '@tanstack/devtools-event-client'

class JobsClient extends EventClient<JobEvents> {
  constructor() {
    super({ pluginId: 'jobs' })
  }
}

export const jobsClient = new JobsClient()
```

| Option | Default | Use |
|--------|---------|-----|
| `pluginId` | required | identifies the plugin in the event system |
| `debug` | `false` | verbose console logging while authoring |
| `enabled` | `true` | disconnect without removing the calls |
| `reconnectEveryMs` | `300` | retry interval when the bus is not up yet |

## 3. Emit from the code that owns the state

```ts
export function startJob(queue: string) {
  const jobId = crypto.randomUUID()
  jobsClient.emit('job-started', { jobId, queue })

  return {
    report(percent: number) {
      jobsClient.emit('job-progress', { jobId, percent })
    },
    finish(durationMs: number) {
      jobsClient.emit('job-finished', { jobId, durationMs })
    },
  }
}
```

Emit from the mutation, the subscriber callback, or a middleware layer. Events emitted before the workbench mounts are queued and flushed on connect; if no connection succeeds, they are dropped after a few retries, so the calls are safe to leave in place.

## 4. Render the panel

```tsx
import { useEffect, useState } from 'react'
import { jobsClient } from './jobs-client'

export function JobsPanel() {
  const [rows, setRows] = useState<Array<{ jobId: string; percent: number }>>([])

  useEffect(() => {
    const offStarted = jobsClient.on('job-started', (e) => {
      setRows((prev) => [...prev, { jobId: e.payload.jobId, percent: 0 }])
    })
    const offProgress = jobsClient.on('job-progress', (e) => {
      setRows((prev) =>
        prev.map((row) => (row.jobId === e.payload.jobId ? { ...row, percent: e.payload.percent } : row)),
      )
    })

    return () => {
      offStarted()
      offProgress()
    }
  }, [])

  return <pre>{JSON.stringify(rows, null, 2)}</pre>
}
```

`on()` takes the suffix and returns a cleanup function. Return it from the effect, or every re-mount adds another listener and the panel shows duplicated events.

## 5. Register the panel

```tsx
<TanStackDevtools
  plugins={[
    {
      id: 'jobs',
      name: 'Background Jobs',
      render: <JobsPanel />,
      defaultOpen: false,
    },
  ]}
/>
```

`id` keeps the tab identity stable across renames; `name` is the visible tab title. Vue, Svelte, and Angular pass `component: JobsPanel` instead of `render`.

## 6. Add a command channel when the panel must act

```ts
// app side
jobsClient.on('reset', () => {
  queue.clear()
})

// panel side
jobsClient.emit('reset', undefined)
```

The same client carries commands back to the app. Keep commands explicit in the event map so both directions stay typed.

## 7. Prefer a factory when packaging the plugin

`@tanstack/devtools-utils` exposes `createReactPlugin()`, `createSolidPlugin()`, `createVuePlugin()`, and `createPreactPlugin()`. Each returns a `[Plugin, NoOpPlugin]` tuple, wires the `theme` prop, and keeps the devtools tree-shakeable from production builds.

## 8. Verify

1. `/run-dev` — the tab appears and shows events as the product state changes
2. The app behaves normally when the workbench is closed or not mounted
3. Navigating away and back does not duplicate rows, which proves the cleanup ran
4. `/run-build` — the panel component is absent from production output
5. `/run-typecheck` — every emit/on pair matches the event map

## Pitfalls

- Prefixing event names with `pluginId`, producing `jobs:jobs:progress` on the bus.
- Omitting the cleanup returned by `on()`, so listeners accumulate on every mount.
- Emitting a payload shape that the map does not describe; the client types the call but not the runtime data.
- Expecting events to persist — they are in-memory and dropped once no connection succeeds.
- Building a second EventClient class for the panel instead of importing the shared instance.
- Reaching for `/production` on the event client when only development needs the panel.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/query-and-router-devtools.md`
- `usecases/keep-devtools-out-of-production.md`
