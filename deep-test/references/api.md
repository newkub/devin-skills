# Deep Test — API Domain

Run API tests by calling real or mocked endpoints and inspecting responses to verify contracts and behavior — covering REST, GraphQL, tRPC, WebSocket

> Pre-Run: always run `/review-api` first — `run-*` skills must be reviewed/assessed before the main action; never skip; if a finding is a blocker, fix it or report before running

## 1. Prepare API Test Context

> Goal: prepare context before running API tests

1. Check `package.json` or config to find the test framework and scripts
2. Identify API endpoints from the codebase, OpenAPI, or existing tests
3. Check environment variables: `PORT`, `BASE_URL`, `API_KEY`
4. If there is an OpenAPI / tRPC router → read the schema to learn the request/response shape
5. If there is no test framework → run `/follow-test` to set one up

## 2. Select Test Runner

> Goal: pick the tool that fits the job

| Tool | When |
|-----------|---------|
| ad-hoc script (Bun `fetch`/`ofetch`/`ky`) | default — flexible logic, complex assertions, one-off checks |
| Hurl `.hurl` files (`hurl --test`) | diffable test files in Git, contract/smoke checks in CI — run `/follow-tool-hurl` |
| Bruno collections (`bru run`) | you already have `.bru`/OpenCollection, or want one GUI + CLI — run `/follow-tool-bruno` |
| Schemathesis | you have an OpenAPI spec and want property-based fuzzing to find edge cases |

If you choose a script → run `/use-scripts` to pick the shell and location; use `/use-astgrep` if you need to scan call sites or route definitions; the script must support base URL, headers, body, query params, expected status, and expected response shape with a `dryRun` option

## 3. Export OpenAPI → Bruno Flow

> Goal: convert the spec into a runnable collection when the team uses Bruno

1. Export the spec from code — framework generator (Elysia/Hono/Fastify route, oRPC `OpenAPIGenerator`)
2. If the spec is a Postman collection → convert with `bunx scalar document convert <collection.json>`
3. Import into Bruno: `bru import openapi --source <spec> --output tests/api --collection-name "API"` (default `opencollection`; use `--collection-format=bru` if you want classic `.bru`)
4. Add assertions/`tests` blocks to the generated requests — import gives only the request shape, not assertions
5. Run: `bru run tests/api --env <name> --reporter-junit junit.xml` or via `usebruno/bruno-cli-action@v1` in GitHub Actions — see `/follow-tool-bruno`
6. If you don't want Bruno → use Hurl or Schemathesis from the table above instead

## 4. Run API Tests

> Goal: run the script and record results

1. Run the script in `dryRun` mode first
2. If the dry run passes → run for real
3. Record the response status, headers, body, and latency of each endpoint
4. Validate responses against the schema or contract
5. If anything fails → go straight to the Validate/Report step; never fix source without evidence

## 5. All-Routes Check (merged from test-all-api-routes)

> Goal: hit every API route of the domain — status + response time + severity per route

Use when you need coverage of every route (not just spot assertions) — safe by default: fires only `GET`/`HEAD`/`OPTIONS`, mutation methods require `--allow-write` + user confirmation

1. Resolve the route source in order: `crw_map` (MCP) → `--routes-file` → OpenAPI spec paths → `--discover` (SPA same-origin links) → `/report-uxui-all-routes` from source code; if nothing can be found → stop and report
2. Run the route checker script:
   ```bash
   bun <skill-dir>/scripts/check-routes.ts --base <domain> --routes-file routes.txt
   ```
   options: `--method`, `--timeout`, `--slow`, `--header "Authorization: Bearer <token>"`, `--allow-write`, `--out`; fallback `scripts/check-routes.ps1` (PowerShell + curl.exe)
3. Classify severity per route: `ok` (2xx), `redirect` (3xx — an API should not redirect), `protected` (401/403), `slow` (>3000ms), `critical` (4xx/5xx unexpected, timeout, DNS/TLS), `skipped` (non-safe method), `missing` (in the spec but 404)
4. Report table: `No.`, `Method`, `Route`, `Status`, `Expected`, `Time (ms)`, `Severity`, `Recommendation`; persist → `.devin/temp/report/<workspace>/api-routes-<time>.md`
5. If there are many routes and they can be grouped → spawn the `route-checker` profile (`deep-test/SKILL.md ## Subagents`) one group at a time via `/use-subagents`, then merge the results
6. spec and implementation mismatch → `/review-api`; missing routes → framework generator

Additional rules: always mask credentials in reports; every route must have a tested or skipped result with a reason; never fire at production without confirmation

## 6. Validate And Report

> Goal: validate results and report

1. Run `/deep-validate` on the relevant source when an API test fails
2. Summarize results with `/report`: endpoint, status, latency, pass/fail
3. If the source is wrong → suggest `/resolve-errors` or `/edit`
4. If the test is wrong → suggest `/edit` on the test script
5. Run `/suggest-next-action` to suggest the next step

## Rules

### 1. Test Isolation

- Every API test must be independent, with no interdependencies
- Use a test database or mocks for side effects
- Specify cleanup/rollback for changed state

### 2. Response Validation

- Check the appropriate status code
- Check the response body against the schema or contract
- Check required headers, e.g. `content-type`
- Record latency for performance checks

### 3. Safety

- Do not run API tests against production unless the user confirms
- Do not edit source code or test assertions without evidence
- Use `dryRun` before real execution

### 4. Script Standards

- Use Bun native APIs if using `.ts`
- Use CDN imports for dependencies
- Keep permanent scripts in `.devin/scripts/` and temp scripts in `$env:TEMP`

## Expected Outcome

- API tests are run and responses recorded
- Pass/fail reported for each endpoint
- Failures classified as source or test errors
- Next action suggested
