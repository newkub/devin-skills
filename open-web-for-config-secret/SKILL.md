---
name: open-web-for-config-secret
description: Read .env.example, open URLs to create API keys and secret manager dashboard for the user to fill
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - follow-create-product
  - follow-create-web
  - follow-deploy
  - deploy-to-cloudflare
  - deploy-to-vercel
  - deploy-to-railway
  - run-dev
  - run-audit
---

## Goal

Read `.env.example` then open all URLs needed to set up secrets — both external service pages for creating API keys and the secret manager dashboard for pasting values, with the user entering everything themselves

## Scope

Use when onboarding a new project or when connecting external services to the secret manager; not involved in deploying or running the app

## Execute

### 1. Read Env Example

> Goal: Collect the keys that must be configured

1. Read `.env.example` from the project root
2. If missing → generate it from the project manifest (`package.json`, `wrangler.jsonc`, etc.)
3. Extract the environment variable names
4. Filter out internal values (localhost, `127.0.0.1`, paths)

### 2. Build Key Inventory Table

> Goal: Build a clear inventory before opening URLs — the user sees at a glance which key is missing, where to get it, and where to paste it

1. Compare the keys in `.env.example` against the real env files (`.env`, `.env.local`, `.dev.vars`) and code usage (`process.env.*`, `Bun.env.*`, `import.meta.env.*`)
2. Assign a Status per key:
   - `set` — a real value exists in an env file or the secret manager
   - `placeholder` — the key exists but the value is a placeholder (`your-*`, `xxx`, `changeme`, sample `sk_test_...`)
   - `localhost` — the value points at `localhost`/`127.0.0.1` but no local service runs
   - `missing` — no key in any env file
3. Split into 2 groups ordered by boot/feature importance:
   - `Required (Blockers)` — keys the app throws/hangs on at boot or runtime (`DATABASE_URL`, `*_SECRET_KEY`, `ENCRYPTION_KEY`, `REDIS_URL`, etc.)
   - `Feature-Gated` — keys that may be absent without blocking boot (LINE/Twilio/FCM/AI/OAuth keys)
4. Always render each group as a chat table with these columns:

   `| No. | Key | Status | Fill where | Get key from URL | Format example | Why it is needed |`

   - `Fill where` — the real destination, e.g. `Infisical → env dev`, `.dev.vars`, Vercel env
   - `Get key from URL` — the provider console URL at the exact key-creation page (table in the next step)
   - `Format example` — prefix/format only (`sk_test_...`, `whsec_...`), never real values
   - `Why it is needed` — the feature/impact when absent (e.g. "routes that query DB hang ~4s")
5. Use this table as the source of truth for the next steps — open URLs only for keys whose status is not `set`

### 3. Identify External Services

> Goal: Find the service behind each variable

Map variable names to services:

| Variable prefix | Service | Key type |
|---|---|---|
| `OPENAI_*` | OpenAI | API key / Project key |
| `ANTHROPIC_*` | Anthropic | API key |
| `GOOGLE_*`, `GEMINI_*`, `GCP_*` | Google AI Studio / GCP | API key |
| `GITHUB_*` | GitHub | Personal Access Token |
| `SUPABASE_*` | Supabase | Project API keys / JWT |
| `STRIPE_*` | Stripe | Secret key, publishable key, webhook secret |
| `CLOUDFLARE_*` | Cloudflare | API token, Account ID, Zone ID |
| `VERCEL_*` | Vercel | Token, Org ID, Project ID |
| `RAILWAY_*` | Railway | Token |
| `WORKOS_*` | WorkOS | API key, client ID |
| `DATABASE_URL` | the chosen database | Connection string |
| `REDIS_*` | Redis provider | URL / password |
| `LINE_*` | LINE Developers | Channel access token, secret |
| `DISCORD_*` | Discord Developer Portal | Bot token, application ID |
| `TELEGRAM_*` | @BotFather | Bot token |

### 4. Open Service Dashboard URLs

> Goal: Open the API-key creation pages for each service

Open the URLs in the unavoidable order:

- OpenAI: `https://platform.openai.com/api-keys`
- Anthropic: `https://console.anthropic.com/settings/keys` (redirects to `https://platform.claude.com/settings/keys`, verified 2026-09-12)
- Google AI: `https://aistudio.google.com/app/apikey`
- GitHub tokens: `https://github.com/settings/tokens`
- Supabase: `https://supabase.com/dashboard/project/_/settings/api`
- Stripe: `https://dashboard.stripe.com/test/apikeys`
- Stripe webhooks: `https://dashboard.stripe.com/webhooks`
- Cloudflare API tokens: `https://dash.cloudflare.com/profile/api-tokens`
- Cloudflare dashboard: `https://dash.cloudflare.com/`
- Vercel tokens: `https://vercel.com/account/tokens`
- Railway: `https://railway.com/account/tokens`
- WorkOS: `https://dashboard.workos.com/api-keys`
- LINE: `https://developers.line.biz/console/`
- Discord: `https://discord.com/developers/applications`

Tell the user per URL which key to create:

```text
Open `https://dashboard.stripe.com/test/apikeys` then copy `STRIPE_SECRET_KEY` into the secret manager
```

### 5. Open Secret Manager Dashboard

> Goal: Open the secret manager page for the user to paste keys

1. Detect the secret manager the project uses (default is Infisical)
2. Open the URL:
   - Infisical Cloud: `https://app.infisical.com/`
   - Infisical EU: `https://eu.infisical.com/`
   - Self-hosted: use the configured `INFISICAL_DOMAIN`
3. Direct the user to the path:
   - `Project → Secrets → Add Secret`
   - or `Project → <environment> → Add Secret`

### 6. Guide Manual Entry

> Goal: The user fills secrets themselves with the AI never seeing values

1. Produce a key list per environment:
   ```text
   Environment: dev
   - STRIPE_SECRET_KEY (copy from the Stripe dashboard)
   - OPENAI_API_KEY (copy from the OpenAI dashboard)
   - CLOUDFLARE_API_TOKEN (copy from the Cloudflare dashboard)
   ```
2. Tell the user to:
   - Click "Add Secret" in the secret manager
   - Set `Key` = the variable name
   - Set `Value` = the copied key value
   - Choose the correct `Environment`
3. Reiterate that the AI should never see the values
4. If a key exists in several environments (dev/staging/prod), re-add it in each environment

### 7. Verify In Secret Manager

> Goal: Confirm completeness

1. Have the user review the list in the secret manager dashboard
2. Check that all keys have values
3. If anything is missing → reopen that service URL
4. If complete → invoke `/follow-secret-manager` to set up `infisical run`

## Rules

### 1. AI Does Not Read Secret Values

- The AI only opens URLs; it never accepts key values from the user
- Do not print key values the user copied into the secret manager
- Do not store keys in files; do not write `.env.local` for the user

### 2. User Does Manual Entry

- The user must copy-paste values from the service dashboard to the secret manager themselves
- The AI only states the steps and URLs
- If the user is unsure, reopen the URL or explain each page

### 3. Service Mapping Accuracy

- Verify variable names before mapping them to services
- If unsure → ask the user what the service is
- Never guess a URL without confidence

### 4. Post-Action

- After the user finishes entry, continue with `/follow-secret-manager`
- Do not let the user deploy before confirming secrets are complete
- Never recommend storing values in `.env`
- If `open-web-for-config-secret` was triggered because the app cannot start from missing keys → check that the app has a setup/onboarding UX instead of a blank/white screen before opening URLs

- Use /follow-secret-manager if needed
- Use /follow-create-product if needed
- Use /follow-create-web if needed
- Use /follow-deploy if needed
- Use /deploy-to-cloudflare if needed
- Use /create-cloudflare-token if needed
- Use /deploy-to-vercel if needed
- Use /deploy-to-railway if needed
- Use /run-dev if needed
- Use /run-audit if needed

## Expected Outcome

- `.env.example` is read and its keys extracted
- The key inventory table (status/destination/console URL/format/impact) renders in chat, split Required vs Feature-Gated
- External service URLs open only for keys not yet `set`
- The secret manager dashboard URL opens for pasting keys
- The user fills secrets themselves with the AI never seeing values
- The list of missing or complete keys is accurate
- If the app cannot start from missing keys, it has a setup/onboarding UX instead of a blank/white screen before URLs open
- Ready to invoke `/follow-secret-manager` to use the secrets
