# Use Case — Retry, Timeout, and Delays

> Wrap an unstable call with bounded retries and a hard timeout, and test it without real waiting. Source: https://es-toolkit.dev/reference/async/retry.html (accessed 2026-10-20)

## 1. Retry with a bound

```ts
import { retry } from "es-toolkit";

export async function fetchInvoice(id: string) {
  return retry(
    async () => {
      const response = await fetch(`/api/invoices/${id}`);
      if (!response.ok) throw new Error(`invoice ${id}: ${response.status}`);
      return response.json();
    },
    { retries: 3, delay: 200 },
  );
}
```

`retries` is the number of additional attempts, so three retries means up to four calls. `delay` accepts a number or a function of the attempt index for exponential backoff (`(attempt) => 2 ** attempt * 100`).

Retry only idempotent work. A retried `POST /orders` without an idempotency key creates duplicate orders — the library cannot know that.

## 2. Bound the whole attempt with a timeout

```ts
import { withTimeout } from "es-toolkit";

const invoice = await withTimeout(fetchInvoice("inv_123"), 5000, "invoice fetch");
```

`withTimeout` rejects when the promise does not settle in time, even if the inner call eventually succeeds. Without it, a hung socket holds the request until the platform kills it.

The inner work is not cancelled — pair it with `AbortController` when the underlying call supports a signal:

```ts
const controller = new AbortController();
const work = fetch(url, { signal: controller.signal });
const result = await withTimeout(work, 5000).catch((error) => {
  controller.abort();
  throw error;
});
```

## 3. Await between attempts

```ts
import { delay } from "es-toolkit";

export async function pollUntilReady(id: string, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const state = await fetchState(id);
    if (state === "ready") return state;
    await delay(500 * (i + 1));
  }
  throw new Error("not ready after polling");
}
```

`delay` returns a promise instead of blocking the thread. Do not use `setTimeout` with a manual promise when the helper exists — the abort story is the same, but the code is shorter.

## 4. Verify

1. `/run-test` with a fake that fails twice — the third call succeeds and only three attempts run
2. A call that never resolves rejects at the timeout, not at the test timeout
3. `/deep-test api` — an idempotent GET retries; a POST without a key does not
4. Backoff is visible in logs: 100, 200, 400ms

## Pitfalls

- Retrying a non-idempotent request, which duplicates side effects.
- `retries: Infinity` in a request handler, pinning the worker until a platform timeout.
- Awaiting a debounced or throttled function's result — those return the last call, not the current one.
- `withTimeout` without aborting the inner work, leaving a request running after the caller gave up.
- Fixed 1s polling with no attempt cap, so a stuck job runs forever.

## Related

- `references/apis.md`
- `best-practices/es-toolkit.md`
- `usecases/debounce-and-throttle.md`
- `usecases/deep-clone-and-equality.md`
