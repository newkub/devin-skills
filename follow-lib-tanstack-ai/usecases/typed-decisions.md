# Use Case — Typed Decisions for Routing and Gating

> A ticket needs a queue, an urgency, and a yes/no answer your code can branch on. `decide()` takes one state and a map of questions, returns typed fields, and never streams. Source: https://tanstack.com/ai/latest/docs/evaluate/evaluate (accessed 2026-10-20)

## 1. Ask every question in one call

```ts
// src/lib/triage.ts
import { decide, choice, score, boolean } from "@tanstack/ai";
import { typesafeDecider } from "@tanstack/ai-typesafe";

const ADAPTER = typesafeDecider("jev-latest");

export type Ticket = { subject: string; body: string };

export async function triageTicket(ticket: Ticket, signal?: AbortSignal) {
  return decide({
    adapter: ADAPTER,
    state: ticket,
    questions: {
      queue: choice({
        instructions: "Which team should handle this ticket?",
        options: {
          billing: "Payments, invoices, refunds",
          tech: "Bugs, outages, integrations",
          sales: "Pricing, upgrades, new accounts",
        },
      }),
      urgency: score({
        instructions: "How urgent is this ticket?",
        levels: ["low", "medium", "high"],
      }),
      refund: boolean({
        instructions: "Is the customer asking for a refund?",
        criteria: {
          true: "Mentions a refund, chargeback, or duplicate charge",
          false: "No money is being asked back",
        },
      }),
    },
    ...(signal ? { abortSignal: signal } : {}),
  });
}

export type Triage = Awaited<ReturnType<typeof triageTicket>>;
```

Each question key becomes a top-level property on the result. `meta` is reserved — a question named `meta` throws before any request. `state` can be a string, object, or array, but an array is one state, not a batch of independent decisions.

## 2. Branch on the union, not on strings

```ts
const result: Triage = await triageTicket(ticket);

switch (result.queue.value) {
  case "billing":
    return routeTo("billing", ticket);
  case "tech":
    return routeTo("tech", ticket);
  case "sales":
    return routeTo("sales", ticket);
}
```

The keys of `options` become the union on `.value`, so a misspelled case is a type error. Leave the `default` off — adding an option then breaks the build, which is the point.

## 3. Gate low-confidence answers to a human

```ts
const AUTO_ROUTE_MIN = 0.8;

if (result.queue.confidence < AUTO_ROUTE_MIN) {
  return queueForHuman({
    ticket,
    guess: result.queue.value,
    probabilities: result.queue.probabilities,
  });
}

return routeTo(result.queue.value, ticket);
```

`.value` is the pick, `.probability` is P(pick), `.probabilities` is the full map, and `.confidence` is the aggregate the adapter reports. Escalate instead of guessing — a 0.4/0.35 split is not a routing decision.

## 4. Read the ordered score correctly

```ts
const rank = Object.values(result.urgency.legend).indexOf(result.urgency.value);
const SLA_BY_RANK = ["72h", "8h", "1h"] as const;

const dueIn = SLA_BY_RANK[rank] ?? "72h";
```

`score()` requires at least two `levels`. `.value` is the nearest level label, `.score` is the raw fraction, `.probability` is P(that level), and `.legend` maps each level index to its label. Do not use `.score` as a probability; they answer different questions.

## 5. Act on the boolean without inventing confidence

```ts
if (result.refund.value && order.amount <= AUTO_REFUND_LIMIT) {
  await refund(order.id);
}
```

`boolean()` has no `.confidence`. `.value` is `true` when P(true) is at least 0.5, and `.probability` is P(true) — so a money-moving action should gate on `.probability` and a human approval above the limit.

## 6. Keep the call on the server

```ts
// src/routes/api/triage.ts
import { createFileRoute } from "@tanstack/react-router";
import { triageTicket, type Ticket } from "@/lib/triage";

export const Route = createFileRoute("/api/triage")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body: unknown = await request.json();
        if (
          typeof body !== "object" ||
          body === null ||
          !("ticket" in body)
        ) {
          return new Response("Invalid request body", { status: 400 });
        }
        const result = await triageTicket(
          body.ticket as Ticket,
          AbortSignal.timeout(5_000),
        );
        return Response.json(result);
      },
    },
  },
});
```

The decider adapter reads its key from the server environment (`TYPESAFE_API_KEY`, `OPENROUTER_API_KEY`, `AI_GATEWAY_API_KEY`, or Cloudflare credentials). Calling `decide()` in the browser leaks it. `abortSignal` cancels the in-flight request; `result.meta.model` and `result.meta.usage` record what was spent, and a `middleware: [{ name: "usage-logger", onUsage }]` entry logs the same numbers.

## 7. Verify

1. Send a duplicate-charge ticket — `queue.value` is `billing`, `refund.value` is `true`, urgency lands on `high`
2. Send an ambiguous ticket — the human-escalation branch runs with a populated `probabilities` map
3. Remove `"sales"` from `options` — the `switch` stops typechecking
4. Pass an empty `questions` object — `decide()` throws before any network call
5. Rename a question key to `meta` — throws immediately
6. Abort after 1 ms — the call rejects and no routing or refund branch runs
7. Log `result.meta.usage` — token counts are non-zero and match the `onUsage` callback

## Pitfalls

- Treating an array `state` as a batch — it is one state judged by every question, not one result per element.
- Reading `.confidence` on a `boolean()` answer — it does not exist; use `.probability`.
- Using `.score` as a probability — it is the raw fraction; `.probability` is P(level).
- Trusting `.value` at a near-0.5 boundary instead of setting a product threshold.
- Calling `decide()` from client code — the adapter needs a server-side API key.
- Keeping a `default` branch in the `switch`, which silently absorbs a new option.
- Installing only `@tanstack/ai` — evaluate needs a decider package such as `@tanstack/ai-typesafe`, `@tanstack/ai-openrouter`, or `@tanstack/ai-openai`.
- Assuming this API is stable — `decide()` is 0.x, so confirm the `choice`/`score`/`boolean` exports in the version you installed.

## Related

- `references/apis.md`
- `best-practices/tanstack-ai.md`
- `usecases/structured-output-table.md`
- `usecases/persistence-and-resume.md`
