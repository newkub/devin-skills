# Use Case — Stream a Fast Shell With Deferred Data

> Send the page immediately and let the slow section fill in, instead of holding the whole response for the slowest query. Source: https://tanstack.com/start/latest/docs/framework/react/guide/deferred-data (accessed 2026-10-20)

## 1. Split loader work into now and later

```tsx
// src/routes/_app/dashboard.tsx
import { defer } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  loader: () => {
    const header = api.summary();          // fast, awaited → part of the SSR HTML
    const activity = api.activity();       // slow, deferred → streamed later
    return { header: header, activity };   // a promise inside the object is the marker
  },
  component: Dashboard,
});
```

```tsx
function Dashboard() {
  const { header, activity } = Route.useLoaderData();
  return (
    <>
      <SummaryCard data={header} />
      <Suspense fallback={<ActivitySkeleton />}>
        <Await promise={activity} errorComponent={({ error }) => <InlineError error={error} />}>
          {(rows) => <ActivityList rows={rows} />}
        </Await>
      </Suspense>
    </>
  );
}
```

The header renders on the server; the activity section streams in behind a skeleton. The page's TTFB no longer depends on the slowest query.

## 2. Keep the awaited value out of render assumptions

```tsx
// ❌ schedules it in the initial HTML and blocks the stream
const rows = await activity;

// ✅ pass the promise down and let <Await> resolve it
return { header, activity };
```

An `await` inside the loader puts the promise back in the blocking path. The deferred value must reach the component unresolved.

## 3. Give the deferred section its own failure UI

```tsx
<Await
  promise={activity}
  fallback={<ActivitySkeleton />}
  errorComponent={({ error }) => (
    <InlineError error={error} retry={() => router.invalidate()} />
  )}
>
  {(rows) => <ActivityList rows={rows} />}
</Await>
```

A deferred failure must not blank the shell — the header already rendered. Without `errorComponent`, the error bubbles to the route boundary and the user loses the entire page for one slow widget.

## 4. Use it only for content below the fold

| Content | Loader | Why |
|---|---|---|
| Page title, primary entity | awaited | needed for SEO and first paint |
| Comments, activity, recommendations | deferred | below the fold, non-critical |
| Anything the meta tags need | awaited | deferred data cannot set `<title>`/OG |

Deferring the primary entity makes the page feel faster and look worse — the user sees a skeleton where the subject should be.

## 5. Verify

1. `/run-dev` — `curl` the page: the summary HTML is present, the activity section is a skeleton
2. Throttle to Slow 3G — the shell paints before the slow response finishes
3. Force `api.activity()` to reject — the inline error shows and the summary stays
4. View source — meta tags contain the awaited data, not placeholders
5. `/run-typecheck` — the `Await` callback argument is typed from the promise
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `await`ing the deferred promise in the loader → the stream is lost and TTFB returns to the slowest query.
- `<Suspense>` without an `errorComponent` → one failed section replaces the whole route.
- Deferring data that feeds `<meta>` → crawlers and link previews see a skeleton.
- A skeleton with the wrong height → the page jumps when the real content lands.
- Deferring three sections that each need the same fetch → three round trips; fetch once and defer the shared promise.

## Related

- `references/apis.md`
- `best-practices/tanstack-start.md`
- `usecases/ssr-loader-and-pending-ui.md`
- `usecases/verified-webhook-api-route.md`
