# Deep Test — Contract Domain

Verify that service contracts match on both sides — consumer expectations vs provider implementation — without deploying both at the same time (contract testing / Pact-style) — use when multiple services talk to each other: microservices, frontend-backend, provider-consumer APIs

## Run Quick Path

> Goal: run the existing contract suite only (merged from `/test-contract`) — use steps 1-5 below for the deep pass

1. Detect — `pacts/*.json`, pact-broker config, `*.contract.test.*`, `.proto`/JSON Schema; runner = Pact verifier, the project runner for schema conformance, or `schemathesis` for OpenAPI; identify consumer vs provider — must run in both directions
2. Run — consumer tests → generate/publish pact → provider verification against the pact; schema-only → validate responses against the schema; record per-interaction status, violations, breaking changes
3. Classify — provider violates the pact → breaking change in source → `/resolve-errors` or report a versioning decision; stale consumer expectation → `/update-tests`; broker/env not ready → environment; repeats ≥3 → stop+report
4. Report — persist → `.devin/temp/report/<workspace>/contract-test-<time>.md`; all pass → `/run-verify`

## 1. Identify Contracts

> Goal: map the consumer-provider pairs to test

1. Find service boundaries: cross-service API calls, event schemas, shared types
2. Identify existing contract artifacts: OpenAPI specs, shared types, Pact files
3. If there is no contract → run a framework generator or extract expectations from consumer code first

## 2. Capture Consumer Expectations

> Goal: record what the consumer expects

1. Extract request/response expectations from consumer code — fields actually used, required fields
2. Or write contract tests: define interactions (request → expected response shape)
3. Store them as a contract artifact (Pact JSON, schema file, test fixtures)

## 3. Verify Provider

> Goal: test that the provider responds per contract

1. Replay contract expectations against the provider — set up mock state as the test requires
2. Check: status codes, field presence, types, formats — the provider must satisfy every interaction
3. flag: extra fields the consumer does not expect (tolerance ok), missing/wrong-typed fields (violation)

## 4. Detect Drift

> Goal: find contract drift between the sides

1. Compare consumer expectations vs provider actuals — fields that differ
2. flag: consumer uses fields the provider does not send, provider removed fields the consumer uses
3. Run `/deep-review-codebase` (domain `review-api`) jointly for spec-level drift

## 5. Report

> Goal: summarize contract verification

1. Use `/report`: `No.`, `Interaction`, `Consumer`, `Provider`, `Status`, `Mismatch`
2. Verdict per contract: `verified`, `drift`, `broken`
3. Recommend: fix provider, update contract, or version the API (`/deep-review-codebase` domain `review-api`)

## Rules

### 1. Real Contracts

- contracts must come from real code/spec — never write expectations the consumer does not have
- verify against the real provider or a provider stub generated from real code

### 2. Bidirectional

- check both directions: consumer uses what the provider has + provider does not remove what the consumer uses
- fields the consumer does not use may change — flag as info, not a violation

### 3. CI Friendly

- contract tests should be runnable in CI — no dependency on live services
- artifacts (Pact files, schemas) must be versioned with the code

## Expected Outcome

- Contract verification results per consumer-provider pair
- Drift/mismatch findings with field-level detail
- Contract artifacts reusable in CI
