# Use Case — Webhook Receiver

> Accept external webhook posts (Stripe/GitHub/Slack), verify the signature, acknowledge fast, and process async. Source: https://nitro.build/docs/routing, /docs/tasks (accessed 2026-10-20)

## Shape of a good webhook handler

1. Read the **raw body** (signature is computed over bytes, not re-serialized JSON).
2. Verify the signature against a secret **before** trusting any payload field.
3. Respond `2xx` quickly; push heavy work to a task/queue so the sender doesn't retry.
4. Make the effect **idempotent** — providers redeliver on timeout.

## Verify signature + respond fast

```ts [server/routes/hooks/stripe.post.ts]
import { defineHandler, createError } from "nitro";
import { runTask } from "nitro/task";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default defineHandler(async (event) => {
  const rawBody = await event.req.text(); // raw text, not .json()
  const sig = event.req.headers.get("stripe-signature");
  if (!sig) throw createError({ statusCode: 400, statusMessage: "Missing signature" });

  let data: Stripe.Event;
  try {
    data = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid signature" });
  }

  await runTask("billing:handle-event", { payload: { type: data.type, data } });
  return { received: true }; // 200 fast; work happens in the task
});
```

## Process in a task

```ts [server/tasks/billing/handle-event.ts]
import { defineTask } from "nitro/task";

export default defineTask({
  meta: { name: "billing:handle-event", description: "Process a billing webhook event" },
  async run({ payload, context }) {
    const work = doBillingWork(payload);
    context.waitUntil?.(work); // keep the worker alive past the response where supported
    await work;
    return { result: "ok" };
  },
});
```

> Tasks are experimental — enable `experimental: { tasks: true }` with `serverDir` set. See `background-tasks.md`.

## Idempotency

- Key the effect on the provider's delivery id (e.g. `data.id`) and record it in storage before acting, so a redelivery short-circuits:

```ts
const seen = await useStorage().getItem(`hooks:stripe:${data.id}`);
if (seen) return { received: true, duplicate: true };
await useStorage().setItem(`hooks:stripe:${data.id}`, 1);
```

## Pitfalls

- Using `await event.req.json()` then re-`JSON.stringify` for signature checks → bytes differ → valid signatures fail.
- Verifying the signature **after** parsing/acting on the payload → attacker-controlled data already ran.
- Doing slow work inline in the handler → sender times out and retries → duplicate side effects (unless idempotent).
- Hardcoding the secret in the route file → put it in env / `wrangler secret` (see `edge-cloudflare.md`).
