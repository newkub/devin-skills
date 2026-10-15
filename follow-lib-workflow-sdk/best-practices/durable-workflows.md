# Workflow SDK best practices

## Do

- Separate `workflows/<name>/index.ts` (orchestration) from `steps.ts`/`steps/` (work) + `shared/` for common steps — reduces bundler bugs
- Make steps idempotent — the 3x retry may re-run; charge/email/webhook side-effects need a dedup key
- Always return data from a step — pass-by-value, mutations don't come back to the workflow
- Use `sleep()`/`createWebhook()` instead of polling loops — suspension doesn't burn compute
- Generate tokens/secrets inside a step (workflow-seeded random is not a real secret)

## Don't

- Never call network/fs/db inside `"use workflow"` — that runtime doesn't exist and it breaks replay → `"use step"` only
- Never assume step context when calling a step outside a workflow — the directive is a no-op, `getStepMetadata()` throws
- Never deploy to Vercel without enabling System Env Vars — Local World fallback + read-only FS = every run fails
- Never carry ever-growing state through step args — replay recompute is better; pass an id and fetch inside the step

## Perf (v5)

- Inline steps run many per suspension — fan out with `Promise.all` is cheaper than sequential
- Payloads are compressed + encrypted before storage — large streams (AI tokens) shrink by ~80%
- Prefer many small steps on Vercel — batching + sealed log make it up to ~80% cheaper on compute
