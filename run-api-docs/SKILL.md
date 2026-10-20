---
name: run-api-docs
description: Start a Scalar API docs server from an OpenAPI spec with a browser preview
argument-hint: "[scope]"
related:
  - follow-tool-scalar
  - deep-review
  - run-dev
  - resolve-errors

---

## Goal

Start a Scalar API Reference server from an OpenAPI spec (`scalar document serve`), with spec verification and a browser preview

## Scope

Use for projects that have an OpenAPI spec or want a local API docs preview — focused on executing the docs server, not a general guide (guide → `/follow-tool-scalar`)

## Execute

> Pre-Run: always run `/deep-review` first — `run-*` skills must be reviewed/assessed before the main action, never skip; if findings are blockers, fix or report them before running (api docs)

### 1. Locate OpenAPI Spec

> Goal: find the spec file or URL to serve

1. Find the spec in the repo: `openapi.json`, `openapi.yaml`, `docs/openapi.*`, `api/spec.*`
2. If the framework can generate one → find a route such as `/openapi.json`, `/docs/json` (Elysia/Hono/Fastify/oRPC `OpenAPIGenerator`)
3. If no spec exists yet → run the framework generator to create one from code first, then use the resulting file
4. Validate before serving: `bunx @scalar/cli document validate <spec>`

### 2. Install Scalar CLI

> Goal: have a usable `scalar` binary

1. If the project has `@scalar/cli` in devDependencies → use `bunx scalar`
2. If not → `bun add -D @scalar/cli` or use `bunx @scalar/cli` directly (requires Node >=24)
3. Latest: `@scalar/cli@2.5.2` (verified 2026-09-26)
4. Verify with `scalar --version`

### 3. Start Docs Server

> Goal: serve the API reference on a local port

1. Run `bunx scalar document serve <spec> --watch --port 7970`
2. Use another `--port` if 7970 is taken; `-w/--watch` reloads when the spec changes
3. `document serve <url>` also works if the spec lives on a running remote/dev server
4. Record the URL the server prints (default `http://localhost:7970`)

### 4. Preview In Browser

> Goal: open the docs so the user can view them

1. Open a browser preview or `/open-web` to `http://localhost:<port>`
2. Confirm the API reference renders fully — endpoints, schemas, examples
3. If the page is blank → check spec validity with `document lint` (spectral rules)

### 5. Alternatives And Errors

> Goal: cover cases where serving doesn't work

1. No live backend but want to try requests → `bunx scalar document mock <spec> --watch --port <port>` (validates requests against the contract)
2. Want docs embedded in the app → `@scalar/api-reference` standalone script tag (see `/follow-tool-scalar`)
3. If `scalar: command not found` → `bun add -D @scalar/cli`
4. If Node <24 → upgrade Node or use Docker/CI with Node 24
5. If it still fails → run `/resolve-errors`

## Rules

### 1. Spec Source

- Prefer a spec file generated from code (single source of truth) over a stale hand-written file
- Always validate the spec before serving — serving an invalid spec makes the page render silently broken

### 2. Port And Process

- Default port `7970` — on conflict, pick another port and tell the user
- Run as a background process; stop with Ctrl+C / taskkill when done, never leave it running

### 3. Non-Redundancy

- Do not duplicate `/follow-tool-scalar`, which covers the full toolchain — this skill only executes the serve
- If static docs are wanted instead of a server → `scalar document markdown <spec>` or `/update-docs`
- Use /run-dev if needed


## Expected Outcome

- Scalar API Reference running on `http://localhost:<port>` with `--watch`
- Spec validated before serving
- User can open the docs in a browser
- No leftover process after use
