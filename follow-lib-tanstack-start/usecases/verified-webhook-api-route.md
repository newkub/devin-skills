# Use Case — A Verified Webhook Route Alongside Server Functions

> Expose one HTTP endpoint for a third party that cannot call a server function, with the signature check before the body is trusted. Source: https://tanstack.com/start/latest/docs/framework/react/guide/server-routes (accessed 2026-10-20)

## 1. Choose the right tool first

| Caller | Tool | Why |
|---|---|---|
| Your own UI | `createServerFn` | typed RPC, no URL contract |
| Stripe, GitHub, another service | API route | stable HTTP contract, raw body, headers |
| Cron or another internal service | API route | plain HTTP, no client bundle involved |

A webhook is an external contract: the sender knows only a URL, a method, and a body. `createServerFn` is for the app's own client.

## 2. Read the raw body before parsing

```ts
// src/routes/api/stripe.ts
import { createFileRoute } from "@tanstack/react-router";
import { stripe } from "../../server/stripe";

export const Route = createFileRoute("/api/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("missing signature", { status: 400 });

        const raw = await request.text();          // raw, not JSON — the signature covers bytes
        try {
          stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch {
          return new Response("bad signature", { status: 400 });
        }

        const event = JSON.parse(raw);
        await handleEvent(event);
        return new Response(null, { status: 200 });
      },
    },
  },
});
```

Signature verification needs the exact bytes. `await request.json()` first is the classic bug: re-serialising changes whitespace and every signature check fails in production but passes in a hand-made test.

## 3. Return fast, work idempotently

```ts
async function handleEvent(event: Stripe.Event) {
  const seen = await db.webhookEvents.findUnique({ where: { id: event.id } });
  if (seen) return;                                    // retries are guaranteed, duplicates are not free
  await db.webhookEvents.create({ data: { id: event.id, type: event.type } });
  await queue.enqueue(event.type, event.data.object);
}
```

Providers retry on any non-2xx *and* sometimes on a 2xx that timed out. An idempotency record keyed by the provider's event id makes the handler safe to run twice; a 30-second import inside the request is how you get that second run.

## 4. Keep secrets on the server module only

```ts
// src/server/stripe.ts
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

Import this module from route handlers and server functions only. Importing it from a component pulls the SDK and, worse, tempts a `process.env` read into client code that the bundler then inlines.

## 5. Verify

1. `/run-dev` — `curl -X POST localhost:3000/api/stripe` with no signature: 400, no side effect
2. Send the same event id twice — one database row, one queued job
3. Send a body with one extra space and the original signature: rejected (proves raw-body handling)
4. Grep the client bundle for the secret env name — absent
5. `/run-typecheck` + `/run-deploy`, then replay a real event from the provider's dashboard
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `await request.json()` before verifying → signatures never match; the body must stay a string.
- Verifying after parsing but comparing a re-stringified body → same failure, harder to spot.
- Doing the full job inside the handler → provider timeout, retry, duplicated work.
- No idempotency key → a retry doubles the charge or the email.
- Returning 200 for a payload you could not process → the provider never retries and the event is lost silently.

## Related

- `references/apis.md`
- `best-practices/tanstack-start.md`
- `usecases/server-functions-with-middleware.md`
- `usecases/streaming-with-deferred-data.md`
