# Data Fetching And Async States Checklist — review-frontend

## Error Boundaries

- [ ] route-level boundaries — every route wrapped, crash ไม่ลากทั้ง app
- [ ] section boundaries — widgets/panels fail independently
- [ ] fallback UI — meaningful error display + retry action, not blank screen
- [ ] error reporting — boundary errors logged/reported (Sentry/console)
- [ ] reset mechanism — boundary can retry/reset without full reload

## Loading And Empty States

- [ ] loading states — every async surface has pending UI (skeleton > spinner)
- [ ] skeleton screens — layout-stable placeholders, no layout shift
- [ ] empty states — "no data" vs "error" vs "loading" distinct
- [ ] stale data — refetch indicator vs hard loading state
- [ ] timeouts — long-loading hint or timeout error, not infinite spinner

## Fetch Patterns

- [ ] cancellation — `AbortController` on unmount/navigation, no setState-after-unmount
- [ ] dedup — identical concurrent requests merged (library or manual)
- [ ] race-safe — latest request wins, stale responses discarded (or ignored)
- [ ] retry — transient failures retried w/ backoff, not permanent error UI
- [ ] pagination — cursor/infinite scroll handles race + dedup
- [ ] dependent queries — chained fetches don't waterfall unnecessarily

## Caching And Staleness

- [ ] cache strategy — SWR/react-query config per query type
- [ ] invalidation — mutations invalidate related queries, not manual refetch everywhere
- [ ] optimistic updates — UI updates before server confirm, rollback on error
- [ ] stale-while-revalidate — show cached + fetch fresh in background
- [ ] cache keys — normalized, include all deps (params, filters, user)

## Realtime And Subscriptions

- [ ] cleanup — subscriptions unsubscribed on unmount, no leaks
- [ ] reconnect — dropped connections auto-reconnect w/ backoff
- [ ] missed messages — catch-up mechanism or full refetch on reconnect
- [ ] auth — subscription auth tokens refreshed before expiry
- [ ] backpressure — high-frequency updates batched/throttled for UI

## Async Operations

- [ ] mutation states — pending/success/error handled per mutation
- [ ] concurrent mutations — ordering where dependent, parallel where not
- [ ] offline queue — mutations queued when offline, synced on reconnect (if applicable)
- [ ] debounce/throttle — search/input-triggered fetches limited
- [ ] error surfacing — mutation errors reach user (toast/inline), not swallowed

## Hydration And SSR

- [ ] hydration mismatch — server-rendered data matches client expectations
- [ ] SSR data — server-fetched data serialized correctly, not refetched client-side
- [ ] suspense boundaries — async components wrapped, streaming works
- [ ] island architecture — non-interactive content doesn't hydrate unnecessarily

## Detection

- grep fetch patterns — `useEffect` + `fetch`/`axios` manual calls vs library
- grep `AbortController`, `signal`, cleanup returns
- grep subscription APIs — `WebSocket`, `EventSource`, `subscribe`, `onSnapshot`
- grep error boundaries — `ErrorBoundary`, `componentDidCatch`, `onError`

Severity: no error boundary on app shell = High, stale-response overwrites fresh = High, unhandled fetch errors = Medium–High, missing loading states = Medium
