---
name: follow-create-bot-github
description: Build a GitHub bot or GitHub App — auth, webhooks, events, deploy
argument-hint: "[features]"
related:
  - follow-create-bot
  - follow-create-bun-cli
  - follow-create-web
  - follow-deploy
  - follow-lang-typescript
  - follow-secret-manager
  - follow-service-cloudflare
  - follow-service-vercel
  - follow-tool-github-actions
---

## Goal

Build a GitHub bot with TypeScript/Bun — either a Probot/Octokit bot or a real GitHub App registered through the manifest flow, with JWT auth, installation tokens, webhook handlers, and a production deploy

## Scope

Covers app registration (manual or manifest), permissions per least-privilege, webhooks (`issues`, `pull_request`, `push`, `check_suite`), local tunneling, tests, installation, and deploy
- Family dispatcher: `/follow-create-bot` — when the bot only needs to run inside Actions with a plain token, skip the App registration steps

## Execute

### 1. Review Tech Stack

> Goal: Verify the tech stack before building

1. Run `/deep-research` + `/follow-best-practice` to confirm the latest versions and patterns
2. Run `/deep-review` to summarize the stack in use
3. Record the stack and library choices with reasons for later reference

### 2. Gather Requirements

> Goal: Know what the bot must do

1. Ask the user: name, purpose (checks, PR automation, issue triage, sync), and the events to subscribe to
2. Identify permissions per least-privilege: `issues`, `pull_requests`, `checks`, `contents`, `metadata`
3. Identify the runtime: `Bun` (default) or `Node.js`
4. Identify the hosting: webhook endpoint (Workers/Vercel/Railway) or self-hosted

### 3. Choose Stack

> Goal: Pick the library and project shape

1. Use `probot` when you want a framework with built-in webhook dispatch and `context.octokit` (default for event-driven bots)
2. Use `@octokit/app` + `@octokit/webhooks` when you want full control or a serverless deploy
3. Use `/search-npm-libraries` to confirm the current versions before adding a dependency
4. Use `/follow-create-bun-cli` when the bot is a Bun CLI + server
5. Use `/follow-create-web` when the bot has a dashboard or configuration UI

### 4. Register GitHub App

> Goal: Have complete app credentials

1. Open the creation page with `/open-web`, or guide the user to `Settings → Developer settings → GitHub Apps → New`
2. Or use the app manifest flow: POST the manifest JSON, redirect the user to receive a `code`, then exchange it for credentials
3. Set the Homepage URL, Webhook URL, and Webhook Secret
4. Select permissions and subscribe to events per step 2
5. Store `APP_ID`, `PRIVATE_KEY` (PEM), `WEBHOOK_SECRET`, `CLIENT_ID`, `CLIENT_SECRET`
6. Use `/follow-secret-manager` for storage — never commit or log the private key
7. Install the app on the target repositories or organization

### 5. Setup Project

> Goal: Project structure ready with auth

1. Create `{bot-name}/` with `package.json` (`name: github-bot-{name}`) and `tsconfig.json` with `strict: true`
2. Install dependencies per stack:
   - Probot: `bun add probot @probot/adapter`
   - Octokit: `bun add @octokit/app @octokit/webhooks @octokit/rest`
   - Serverless: `bun add @octokit/app`
3. Create `src/app.ts`, `src/index.ts`, `src/handlers/`, `src/config.ts`, `src/domain/`
4. Create `.env.example` with `APP_ID`, `PRIVATE_KEY`, `WEBHOOK_SECRET`, `WEBHOOK_PROXY_URL`, `CLIENT_ID`, `CLIENT_SECRET`
5. Use `/follow-lang-typescript` for type-safe payloads

### 6. Implement Webhook Handlers

> Goal: Handlers wired to the subscribed events

1. Create a handler per event in `src/handlers/`: `issues.ts`, `pull-request.ts`, `push.ts`, `check-suite.ts`
2. Use the Probot pattern:
   ```ts
   import { Probot } from "probot";
   export default (app: Probot) => {
     app.on("issues.opened", async (context) => { ... });
   };
   ```
3. Or wire `@octokit/webhooks` directly:
   ```ts
   import { Webhooks } from "@octokit/webhooks";
   const webhooks = new Webhooks({ secret: Bun.env.WEBHOOK_SECRET });
   webhooks.on("issues.opened", async ({ payload }) => { ... });
   ```
4. Verify signatures with `WEBHOOK_SECRET` (HMAC-SHA256) and compare with `crypto.timingSafeEqual`
5. Use installation tokens via `context.octokit` — never a personal access token in place of the app identity
6. Keep business logic in `src/domain/` and separate it from webhook wiring
7. Add error handling and idempotency (GitHub may redeliver events)

### 7. Test Locally

> Goal: Test before a real install

1. Run `bun dev` and tunnel the webhook with Smee (`bunx smee -u <url> -p 3000`) or `cloudflared`
2. Set `WEBHOOK_PROXY_URL` in `.env`
3. Test the auth chain: JWT generation → installation token → API call
4. Create `test/handlers/` with fixtures from `test/fixtures/` and mock Octokit calls with `nock` or `msw`
5. Run `/run-test` or `bun test`; check idempotency and error paths

### 8. Install And Deploy

> Goal: The app works on real repos and in production

1. Deploy the webhook endpoint with `/deploy-to-cloudflare`, `/deploy-to-railway`, or `/deploy-to-vercel`; VPS/container → Docker + `bun start`
2. Set environment variables on the platform
3. Update the Webhook URL in the app settings
4. Install the app on the target repo/org via the installation URL
5. Verify with a real event and check the health endpoint `/health` or `/`

### 9. Ship

> Goal: Deliver the work

1. Run `/ship`
2. If `ship` fails → report the status

## Rules

### 1. Naming

- Use `github-bot-{name}` for bot-specific projects
- Use `probot-{name}` for Probot-based ones
- The GitHub App name in GitHub settings should match the repo name

### 2. Security

- Never hardcode `APP_ID`, `PRIVATE_KEY`, `WEBHOOK_SECRET`, or client secrets — use `/follow-secret-manager`
- Never commit `.env`, `.pem`, or app credentials
- Verify the signature of every webhook and use `crypto.timingSafeEqual`
- Always use installation tokens — never a PAT in place of the app identity

### 3. Webhooks

- Ack 200 OK within the timeout, then process async
- Handle idempotency with the `delivery` ID
- Tolerate GitHub retries without repeating work
- Request only the permissions actually needed

### 4. Error Handling

- Log errors with context (event, repository, action)
- Never expose stack traces or secrets in HTTP responses
- Provide a fallback handler for unhandled events

### 5. Testing

- Test every handler with fixtures
- Mock all Octokit API calls
- Test error paths

- Use /open-web-for-config-secret if needed
- Use /use-github-ship-bots if needed

## Expected Outcome

- The GitHub App is registered with complete, secure credentials and installed on the target repos
- The webhook endpoint verifies signatures and dispatches every subscribed event
- Tests pass for every event type
- Secrets live in a secret manager, never in source
- The deploy is live with a health endpoint

## Examples

```text
my-github-bot/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── config.ts
│   ├── handlers/
│   │   ├── issues.ts
│   │   ├── pull-request.ts
│   │   └── push.ts
│   ├── domain/
│   │   └── auto-label.ts
│   └── github/
│       └── client.ts
├── test/
│   ├── fixtures/
│   └── handlers/
│       └── issues.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Guide

- `follow-create-bun-cli` — Bun CLI setup
- `follow-lang-typescript` — typed payloads
- `follow-secret-manager` — credential storage
- `follow-service-cloudflare` — Cloudflare Workers deploy
- `follow-service-vercel` — Vercel deploy
- `follow-deploy` — deployment configuration
- `follow-tool-github-actions` — GitHub Actions CI/CD
- [GitHub Apps Docs](https://docs.github.com/en/apps)
- [Probot Docs](https://probot.github.io/docs/)
