# Deep Test — Smoke Domain

Run smoke tests — minimal critical-path checks after build/deploy to confirm the system is alive and core flows respond (merged from `/test-smoke`)

Signals: `smoke` scripts/tags (`test:smoke`, `@smoke`), `*.smoke.*` files, health endpoints, deploy hooks

- Full functional coverage → `/deep-test unit` / `/deep-test e2e`; performance under load → `/deep-test load`; deployed-URL liveness → `/watch-deploy`
- Smoke = a quick gate, not a correctness suite — select only critical paths (boot, health, auth, main flow)

## 1. Detect

> Goal: find the smoke suite or fall back to an ad-hoc check

1. `test:smoke`/`smoke` in package.json scripts, `*.smoke.*` files, tagged tests (`@smoke`, `-t smoke`), health endpoint (`/health`, `/healthz`, `/api/health`)
2. No suite exists → ad-hoc smoke: app responds + health 200 + critical route/endpoint OK
3. App not running yet → `/check-open-ports` then `/run-dev`

## 2. Run

> Goal: the fastest possible end-to-end liveness signal

1. Tagged runner → `--grep smoke` / `-t @smoke`
2. Ad-hoc → `curl -sf <base>/health` plus the critical endpoints, or `autocannon -c 1 -d 5` for a response check
3. Target <2 minutes — anything longer is not smoke

## 3. Classify

> Goal: fail fast with a clear cause

1. App won't start / port conflict → environment
2. Health 5xx / boot crash → source → `/resolve-errors`
3. Smoke check outdated → test → `/update-tests`
4. Same failure repeating ≥3 → stop + report

## 4. Report

> Goal: one pass/fail checklist

1. Persist → `.devin/temp/report/<workspace>/smoke-test-<time>.md` — checklist with pass/fail + latency per check, and the target env
2. All passed → `/run-verify` or hand off to the deploy gate

## Rules

### 1. Stay Small

- Critical paths only; never run a full suite under the name of smoke

### 2. Target Consent

- Never hit production without explicit user approval — always state the target env in the report

### 3. No Masking

- Never hide a failure with `.skip` or retries — fail = fail

## Expected Outcome

- Smoke checklist pass/fail reported as a fast gate
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/`
