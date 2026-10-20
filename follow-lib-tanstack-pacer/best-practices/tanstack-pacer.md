# TanStack Pacer — Best Practices

Debounce, throttle, rate limit, queue and batch — pick by semantics

## Recommended Patterns

- Choose the utility by semantics: debounce waits for silence, throttle caps frequency, rate limiter enforces a quota, queuer serializes work, batcher collapses events
- Keep trailing as the default and switch to leading only when the first call must fire immediately
- Use the `enabled` flag to pause a utility instead of unmounting and rebuilding it
- Call `cancel()`/`flush()` on core class instances during teardown; hooks already clean up on unmount
- Tune waits to the interaction: around 300 ms for search-as-you-type, 50-150 ms for scroll/resize
- Test timing with fake timers and explicit advances rather than real sleeps
- Assert leading and trailing behavior separately, and call counts after a queue or batch flush

## Common Pitfalls

- Using debounce for scroll or pointer streams, where throttle or a rate limiter is the correct semantic
- Debouncing a submit action that users expect to fire immediately
- Leaving a core `Debouncer`/`Throttler` alive after teardown, so it updates state on an unmounted component
- Tests that `await sleep(...)` become flaky and slow
- Confusing the rate limiter window units (milliseconds) with the wait option of debounce
- A queue without a concurrency limit starves the event loop on bulk work
- Re-creating the utility on every render resets its internal timer

## Perf Notes

- Debounce search inputs and form validation; throttle progress/scroll updates
- Batch analytics and bulk writes so the network sees one request
- Cap queue concurrency for IO-bound work to avoid saturating sockets

## Do / Don't

| Do | Don't |
|----|-------|
| pick by semantics | debounce everything |
| leading only when needed | leading by accident |
| fake timers in tests | real sleeps |
| cancel core instances | leak timers past teardown |
| tune waits per interaction | one wait for every case |
