# Deep Test — Contract Domain

Verify that service contracts match on both sides — consumer expectations vs provider implementation — without deploying both at the same time (contract testing / Pact-style) — use when multiple services talk to each other: microservices, frontend-backend, provider-consumer APIs

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
3. Run `/review-api` jointly for spec-level drift

## 5. Report

> Goal: summarize contract verification

1. Use `/report`: `No.`, `Interaction`, `Consumer`, `Provider`, `Status`, `Mismatch`
2. Verdict per contract: `verified`, `drift`, `broken`
3. Recommend: fix provider, update contract, or version the API (`/review-api`)

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
