---
name: resolve-cicd-verify-resolved
description: Confirm after `/resolve-cicd` that the pipeline really came back green on the remote — not just that the local fix passed
related:
  - resolve-cicd
---

## Goal



Confirm after `/resolve-cicd` that the pipeline really came back green on the remote — not just that the local fix passed



## Scope



- Use when the parent dispatches to `verify` or it is called after resolving a CI/CD failure

- Covers: re-run status, all jobs green, deploy target healthy

- Read-only: watch/inspect — no edits



## Execute



### 1. Trigger Or Watch Re-Run



> Goal: Get the new run result from the remote



1. If the fix is committed → the new run auto-triggers — watch with `gh run watch` or `gh run list`

2. If it does not auto-trigger → `gh run rerun <run-id>` (or `--failed` for failed jobs only)

3. Wait until the run completes — do not give a verdict before the run finishes



### 2. Verify All Jobs Green



> Goal: Not just the failed job — every job passes



1. `gh run view <run-id>` — every job is `success`

2. Flag jobs that were skipped/cancelled unintentionally

3. If a new job fails → verdict `not-resolved` with a logs pointer



### 3. Verify Deploy Target



> Goal: The CD side succeeds if there is a deploy



1. Cloudflare: `wrangler deployments list` — the new deployment is active

2. Others: check the deploy step in the run + the target URL responds

3. If the deploy target is unhealthy → verdict `degraded`



### 4. Report



> Goal: Summarize the pipeline status



1. Use `/report` with columns: `No.`, `Job/Check`, `Result`, `Evidence`

2. Verdict: `green` / `not-resolved` / `degraded` with the run URL



## Rules



- The verdict must be based on the latest remote run — a local pass is not enough

- If the re-run fails → report back for `/resolve-cicd` to loop again — do not fix it yourself

- Always state the run URL + commit sha in the report



## Expected Outcome



- A verdict from a real remote run with the run URL

- A list of jobs/deploys that are not yet green, if any
