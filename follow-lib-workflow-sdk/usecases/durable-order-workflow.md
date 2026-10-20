# Use Case — A Durable Multi-Step Order Workflow

> Keep a checkout sequence correct when step three fails and the whole flow replays. Source: https://workflow-sdk.dev (accessed 2026-10-20)

## 1. Split orchestration from work

```ts
// workflows/order/index.ts
import { chargePayment, fetchOrder, sendReceipt } from "./steps";

export async function processOrderWorkflow(orderId: string) {
  "use workflow";

  const order = await fetchOrder(orderId);
  const payment = await chargePayment(order.id, order.total);
  await sendReceipt(order.id, payment.id);

  return { orderId, status: "completed" as const };
}
```

```ts
// workflows/order/steps.ts
import Stripe from "stripe";

export async function fetchOrder(orderId: string) {
  "use step";
  return db.orders.findUniqueOrThrow({ where: { id: orderId } });
}

export async function chargePayment(orderId: string, total: number) {
  "use step";
  const stripe = new Stripe(process.env.STRIPE_KEY!);
  return stripe.charges.create(
    { amount: total, currency: "usd", source: "tok_visa" },
    { idempotencyKey: `order-${orderId}` },
  );
}
```

The workflow function contains no I/O — it can be replayed from the event log. Everything that touches the network or the database lives in a step, and each step's result is persisted when it finishes.

## 2. Make every step idempotent

A step retries up to three times by default, so a charge that succeeded but whose response was lost will be attempted again. The idempotency key is what makes that safe:

1. Derive the key from durable inputs (`order-${orderId}`), never from a timestamp or a random value
2. Apply the same rule to emails, webhooks, and inserts that have no natural key
3. A step with no external side effect needs nothing extra — a pure computation is already idempotent

## 3. Pass data by value

```ts
// wrong: the mutation is lost on the next replay
await enrich(order);
return order;

// right: return the change
const enriched = await enrich(order);
return enriched;
```

A step receives a serialised copy. Mutating an argument has no effect back in the workflow, and the replay produces a different value than the first run did.

## 4. Keep the workflow deterministic

`Math.random()` and `Date` are frozen by the framework, so they are safe — but the current time is the *replay's* value. Anything that must be identical across replays (a token, a signature, a batch id) is generated in a step and passed forward.

## 5. Verify a real failure path

1. `bun run dev` and start a workflow through the app entry point
2. `bunx workflow inspect runs` — confirm one run with steps `completed` in order
3. Kill the process after the charge step, restart, and trigger the same order — the charge must not be duplicated, and the run must resume at the next step
4. `/run-test` an e2e through the workflow entry, asserting the final state and the step count
5. Check `.workflow-data/` is gitignored; local state must never be committed

## Pitfalls

- Writing `"use step"` inside the workflow file for convenience, which produces bundler failures that only appear in production.
- A step that returns a Stripe object with class instances — the workflow cannot serialise it, so return the fields you need.
- Retrying a non-idempotent step by "being careful", when the retry is the framework's default.
- Assuming `.workflow-data/` is the production store; locally it is, on Vercel the run lives in the managed backend.
- `"use workflow"` on a function that is called outside a workflow entry, where it silently behaves as a plain function with no persistence.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/durable-workflows.md`
- `usecases/human-approval-with-webhook.md`
