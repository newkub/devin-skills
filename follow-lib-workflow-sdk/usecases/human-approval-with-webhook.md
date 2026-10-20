# Use Case — Pause a Workflow for Human Approval

> Suspend a run for days, resume it from an email link, and never burn compute while waiting. Source: https://workflow-sdk.dev (accessed 2026-10-20)

## 1. Create the webhook and send the link

```ts
// workflows/approval/index.ts
import { createWebhook, sleep } from "workflow";
import { sendApprovalEmail, sendReminder } from "./steps";

export async function approvalWorkflow(requestId: string) {
  "use workflow";

  const webhook = createWebhook();
  await sendApprovalEmail(requestId, webhook.url);

  await sleep("2d");
  await sendReminder(requestId, webhook.url);

  const decision = (await webhook) as { approved: boolean; reviewer: string };
  return { requestId, ...decision };
}
```

`createWebhook()` returns a URL that resumes the run when something POSTs to it. Between `sleep` and the `await webhook`, the workflow holds no compute — the state lives in the event log.

## 2. Keep the URL unguessable

The webhook URL is a capability: whoever has it can resume the run. If the claim must be tied to a request id that a user could guess, generate a token in a step instead of deriving it from the workflow's seeded random:

```ts
export async function issueToken(requestId: string) {
  "use step";
  return { token: crypto.randomUUID(), requestId }; // real randomness, persisted
}
```

## 3. Handle the resume payload defensively

1. Validate the body shape (`approved` is a boolean, `reviewer` is a non-empty string) before trusting it
2. Return a 4xx for an expired or already-used webhook — a resumed run must not accept a second decision
3. Log the reviewer id in the run so `workflow inspect runs` answers "who approved this"

## 4. Branch after the resume

```ts
if (!decision.approved) {
  await notifyRejected(requestId, decision.reviewer);
  return { requestId, status: "rejected" as const };
}

const published = await publish(requestId);
return { requestId, status: "approved" as const, publishedId: published.id };
```

Everything after the `await` executes on the resume, so the branch is normal deterministic code — no callback plumbing.

## 5. Verify the suspension

1. `bun run dev`, start the workflow, confirm the email step ran and the run is suspended
2. `bunx workflow inspect runs` — the run shows a waiting state with no active step
3. POST to the webhook URL with `{"approved": true, "reviewer": "ana"}` — the run resumes at the next step
4. POST again with the same URL — the second call must be rejected, not resume twice
5. Restart the dev server while suspended, then POST — the run must still resume (the state is durable, not in memory)

## Pitfalls

- Awaiting the webhook with no reminder path, so a forgotten approval blocks a record forever.
- A 2-day `sleep` implemented as a cron poll, which wakes the workflow every minute to check nothing.
- Reading `process.env.APPROVAL_SECRET` inside the workflow body — env access belongs in a step.
- Treating the webhook response as trusted because it is "internal"; the URL can leak through email forwards.

## Related

- `references/apis.md`
- `best-practices/durable-workflows.md`
- `usecases/durable-order-workflow.md`
