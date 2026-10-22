# Use Case — Error Boundaries and Recovery

> A render error unmounts the whole tree unless a boundary catches it. Boundaries catch rendering, not event handlers — so the recovery UI and the reset path have to be designed, not assumed. Source: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary (accessed 2026-10-20)

## 1. A minimal boundary class

```tsx
"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: (error: Error, reset: () => void) => ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    reportError(error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) return this.props.fallback(this.state.error, this.reset);
    return this.props.children;
  }
}
```

`getDerivedStateFromError` renders the fallback on the next render; `componentDidCatch` is the side-effect hook for logging. `reset` clears the error and re-renders the children — the retry path the user needs.

## 2. Place boundaries per risky region

```tsx
export default function Dashboard({ user }: { user: User }) {
  return (
    <main>
      <Header user={user} />
      <ErrorBoundary fallback={(error, reset) => <PanelError error={error} onRetry={reset} />}>
        <RevenueChart userId={user.id} />
      </ErrorBoundary>
      <ErrorBoundary fallback={(error, reset) => <PanelError error={error} onRetry={reset} />}>
        <RecentOrders userId={user.id} />
      </ErrorBoundary>
    </main>
  );
}
```

One boundary around the whole app turns a single broken chart into a blank page. Boundaries around independent panels keep the rest of the dashboard usable, and each retry only re-mounts its own subtree.

## 3. Combine with Suspense for loading and failure

```tsx
import { Suspense } from "react";

<ErrorBoundary fallback={(error, reset) => <PanelError error={error} onRetry={reset} />}>
  <Suspense fallback={<ChartSkeleton />}>
    <RevenueChart userId={user.id} />
  </Suspense>
</ErrorBoundary>
```

`Suspense` handles the pending state, the boundary handles the rejection. Order matters: the boundary outside, the fallback inside. A rejected promise thrown during render reaches the nearest boundary, so the skeleton is replaced by the error panel rather than spinning forever.

## 4. In the Next.js App Router, use the file conventions

```tsx
// app/dashboard/error.tsx
"use client";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section role="alert">
      <h2>This panel could not load</h2>
      <p>{error.digest ? `Reference: ${error.digest}` : "Please try again."}</p>
      <button onClick={reset}>Retry</button>
    </section>
  );
}
```

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <ChartSkeleton />;
}
```

`error.tsx` wraps that route segment in a boundary, and `reset` re-renders it. `digest` is the server-side id that matches a log entry — show it, but never the raw server message, which can leak internals.

## 5. Reset when the input changes

```tsx
export function RetryablePanel({ userId, children }: { userId: string; children: ReactNode }) {
  return (
    <ErrorBoundary
      key={userId}
      fallback={(error, reset) => <PanelError error={error} onRetry={reset} />}
    >
      {children}
    </ErrorBoundary>
  );
}
```

An error boundary does not retry by itself. Remounting it with a new `key` — a different user, a different filter, a new route param — drops the error state and refetches. That is the cheapest correct reset when the cause was the previous input.

## 6. Verify

1. Throw in a child component — the panel fallback renders, the header stays interactive
2. Click retry — the child re-renders and succeeds once the cause is gone
3. Throw inside an event handler — the boundary does not catch it; the handler's own try/catch must
4. Slow the chart request — the skeleton shows, then the chart, with no error panel flash
5. Reject the request — the error panel replaces the skeleton instead of hanging
6. Change `userId` — the boundary remounts and the error clears
7. `/run-test` — a test rendering a throwing child and asserting the fallback and retry behaviour

## Pitfalls

- One boundary at the root, turning a broken widget into a blank page.
- Expecting a boundary to catch event handlers, timers, or rejected promises outside render — those need `try/catch` or a `.catch`.
- Logging `error.message` from a server component straight to the browser, leaking internal details.
- No retry path, so the user's only recovery is a full reload.
- A `key` that never changes, so a stale error survives navigation to another record.
- Catching the error but rendering the same broken props, which throws again immediately.
- Wrapping every component in its own boundary, which hides bugs in development instead of surfacing them.

## Related

- `references/apis.md`
- `best-practices/react.md`
- `usecases/data-fetching-with-suspense.md`
- `usecases/optimistic-updates-and-rollback.md`
