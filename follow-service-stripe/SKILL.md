---
name: follow-service-stripe
description: Use Stripe for payments, subscriptions, checkout, customer portal, and webhooks
argument-hint: "[project-path]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-product
  - follow-create-web
  - follow-service-workos
  - follow-lib-zod
  - follow-lib-unocss
  - deploy-to-vercel
  - deploy-to-cloudflare

---

## Goal

Install and use Stripe for a product, covering pricing, checkout, subscriptions, customer portal, and webhook handling

## Scope

- Supports one-time payments, recurring subscriptions, and usage-based pricing
- Create `/pricing`, `/user/billing`, `/dashboard` pages
- Handle customer portal and webhook events
- Use Stripe test mode before switching to live

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

- Setup: SDK/CLI install, API keys, webhook signing → `## Merged Details → setup-stripe`
- Config: products, prices, webhook endpoints, customer portal, test→live → `## Merged Details → config-stripe`
- Verify: keys valid, correct mode (test/live), webhook secret ready → `## Merged Details → verify-connection`

### 1. Setup Credentials

> Goal: Prepare the Stripe SDK and API keys

Latest: `stripe@22.6.2` (server), `@stripe/stripe-js@9.17.0` (client) (verified 2026-09-24)

1. Install the Stripe SDK with `bun add stripe` for the server
2. Install the client SDK with `bun add @stripe/stripe-js`
3. Create a Stripe account and open Developers > API keys
4. Store `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` in `/follow-secret-manager`, not the real `.env`
5. Install the Stripe CLI for webhook forwarding with `mise use -g stripe` or `scoop install stripe`

### 2. Define Products And Prices

> Goal: Define the pricing model

1. Create products in the Stripe dashboard or via the API
2. Create prices for one-time, monthly, yearly, usage-based
3. Save each plan's `price_id` in config
4. Specify the default plan and featured plan for the `/pricing` page

### 3. Build Pricing Page

> Goal: Create an attractive `/pricing` page

1. Do `/follow-lib-unocss` for UnoCSS and HSL theme tokens
2. Design cards for each plan with price, features, CTA
3. Call `/deep-review` before deploying the pricing page
4. Pass the price_id to the checkout session

### 4. Implement Checkout

> Goal: Create the checkout session and redirect

1. Create server route `/api/checkout` with `stripe.checkout.sessions.create`
2. Pass `price_id`, `customer_email`, `success_url`, `cancel_url`
3. Call the session from the client and redirect to `session.url`
4. Save `session_id` and `customer_id` in the database

### 5. Manage Subscriptions

> Goal: Manage the subscription lifecycle

1. Create subscriptions with `stripe.subscriptions.create` or via checkout
2. Check the `active`, `past_due`, `canceled` statuses
3. Create route `/api/subscriptions/update` for upgrade/downgrade
4. Create route `/api/subscriptions/cancel` with `cancel_at_period_end`

### 6. Customer Portal

> Goal: Let users manage their own billing

1. Configure the customer portal in Stripe settings
2. Create route `/api/billing/portal-session` with `stripe.billingPortal.sessions.create`
3. Set `return_url` pointing to `/user/billing`
4. Add a "Manage billing" button on the `/user/billing` page

### 7. Webhook Handling

> Goal: Receive and respond to Stripe events securely

1. Create route `/api/webhooks/stripe`
2. Use `stripe.webhooks.constructEvent` to verify the signature
3. Handle the key events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Save the event in the database with an idempotency key
5. Run `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe` during local dev

### 8. User And Dashboard Pages

> Goal: Connect Stripe with the user pages

1. Create `/user/billing` showing subscription status, payment method, invoice list
2. Create `/dashboard` showing usage, plan limits, upgrade CTA
3. Fetch data from `stripe.customers.retrieve` and `stripe.subscriptions.list`
4. Use `/follow-service-workos` or `/follow-lib-better-auth` for user auth

### 9. Test

> Goal: Test all flows in test mode

1. Use Stripe test card `4242 4242 4242 4242`
2. Test checkout, subscription, cancel, portal
3. Test webhook events and database updates
4. Test edge cases such as payment failed, incomplete subscription

### 10. Go Live

> Goal: Switch to production

1. Replace the API keys with live keys
2. Configure the webhook endpoint on the production domain in the Stripe dashboard
3. Verify the webhook endpoint uses HTTPS
4. Do `/deploy-to-vercel` or `/deploy-to-cloudflare`
5. Test live checkout with a real card at minimum

## Rules

### 1. Security

- Never hardcode Stripe keys
- Store `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` in `/follow-secret-manager`
- Verify the webhook signature every time
- Use HTTPS for webhooks in production

### 2. Idempotency

- Handle duplicate webhook events with the event id
- Record processed events
- Respond `200` immediately after acknowledging an event even if processing did not succeed

### 3. Data Flow

- `price_id` must match the products in the Stripe dashboard
- Use Stripe's `customer_id` linked to the app's user
- Use `subscription.status` to gate feature access

### 4. UX

- Show a loading state when pressing subscribe
- Show a clear error if payment fails
- Let users manage billing themselves

- Use /open-web-for-config-secret if needed (service stripe)
- Use /follow-create-product if needed
- Use /follow-create-web if needed
- Use /follow-lib-zod if needed

## Merged Details

### config-stripe

##### Goal

Set/edit Stripe configuration — products, prices, webhook endpoints, customer portal, and mode (test/live) — without clobbering existing settings

##### Scope

- Create/edit products and prices, then save `price_id` into config
- Configure the webhook endpoint and subscribed events
- Configure the customer portal and switch test → live mode
- Does not cover SDK install/keys → use `## Merged Details → setup-stripe`

##### Execute

###### 1. Read Current Config

> Goal: Know the current state before editing

1. Read the pricing config, `.env*`, and Stripe-related routes in the project
2. Do `/check-secrets env-vars` to identify missing keys
3. Check existing products/prices/webhooks in the dashboard — use `/open-web-for-config-secret` (service stripe)
4. If there is no SDK/keys yet → do `## Merged Details → setup-stripe` instead

###### 2. Configure Products And Prices

> Goal: Define the pricing model matching the product

1. Create products in the dashboard or via `stripe.products.create`
2. Create prices for one-time, monthly, yearly, usage-based with `stripe.prices.create`
3. Save each plan's `price_id` in the project's config file (not hardcoded in a component)
4. Specify the default plan and featured plan — merge with the existing config, never delete existing plans

###### 3. Configure Webhook Endpoint

> Goal: Receive events securely and idempotently

1. Create route `/api/webhooks/stripe` that verifies with `stripe.webhooks.constructEvent`
2. Add the endpoint in the dashboard (Developers > Webhooks) with the production URL
3. Subscribe only to events actually used, e.g. `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Store each environment's `STRIPE_WEBHOOK_SECRET` in `/follow-secret-manager`
5. Record processed event ids to prevent duplicates

###### 4. Configure Portal And Mode

> Goal: Set up the customer portal and prepare for go live

1. Enable the customer portal in dashboard settings and define the allowed features (cancel, update payment method)
2. Set `return_url` to the app's billing page
3. Before go live: replace test keys with live keys, confirm the webhook endpoint is HTTPS
4. Do `/deep-review` domain `review-config` across test/live configs if needed

###### 5. Verify

> Goal: Confirm the config works end-to-end

1. Test checkout with test card `4242 4242 4242 4242`
2. Trigger events with `stripe trigger <event>` and check the handler
3. Do `/run-verify` — if it fails → revert the keys just changed, do `resolve-errors`, then report the diff

##### Rules

- `price_id` must match the products in that environment's dashboard
- Secrets/keys only through `/follow-secret-manager` — never commit
- The production webhook endpoint must be HTTPS and verify the signature every time
- Merge the existing config — never overwrite live products/prices
- If unsure about an API field/option → check official docs or `learn` (web)

##### Expected Outcome

- Products/prices correct and `price_id` saved in config
- Webhook endpoint secure, idempotent, and subscribed to the needed events
- Portal config ready and the test → live checklist passed

### setup-stripe

##### Goal

Install the Stripe SDK (server/client), prepare API keys from the dashboard, and set up webhook signing for local dev — first-time setup only

##### Scope

- Install `stripe`, `@stripe/stripe-js`, and the Stripe CLI
- Create and store `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Init the server client and webhook forwarding
- Does not cover products/prices/webhook endpoint config → use `## Merged Details → config-stripe`

##### Execute

###### 1. Check Prerequisites

> Goal: Confirm the current state before installing (idempotent)

1. Read `package.json` to identify runtime and package manager
2. Check whether `stripe`/`@stripe/stripe-js` are already installed → if so, skip to verify
3. Do `/check-secrets env-vars` to see whether Stripe keys already exist
4. If there is no Stripe account → stop and tell the user to create one from the dashboard

###### 2. Install SDKs And CLI

> Goal: Install the needed dependencies

1. Install the server SDK with `bun add stripe`
2. Install the client SDK with `bun add @stripe/stripe-js` if the client side must call Stripe.js
3. Install the Stripe CLI with `mise use -g stripe` or `scoop install stripe`
4. Log in the CLI with `stripe login`

###### 3. Store Keys And Init Client

> Goal: Prepare keys securely and init the client

1. Open Developers > API keys in the dashboard — use `/open-web-for-config-secret` (service stripe)
2. Store `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` in `/follow-secret-manager`, not the real `.env`
3. Start with test mode keys — never use live keys in dev
4. Init the server client with `new Stripe(process.env.STRIPE_SECRET_KEY!)` — if pinning `apiVersion` is needed, check official docs

###### 4. Setup Webhook Signing

> Goal: Configure the webhook secret for local dev

1. Run `stripe listen --forward-to http://localhost:<port>/api/webhooks/stripe`
2. Copy `whsec_...` from the output into `STRIPE_WEBHOOK_SECRET` in `/follow-secret-manager`
3. Verify events with `stripe.webhooks.constructEvent(rawBody, signature, secret)` — the raw request body is required
4. Do `/run-verify` and trigger a test event with `stripe trigger <event>` — if it fails → `resolve-errors` max 3 rounds

##### Rules

- Never hardcode keys or commit secrets — always use `/follow-secret-manager`
- `STRIPE_SECRET_KEY` is server-side only — the client uses the publishable key
- Webhooks must always verify the signature with the raw body
- Always use test mode first — live keys only at go live
- If unsure about an API/option → check official docs or `learn` (web)

##### Expected Outcome

- Stripe SDKs and CLI installed and ready
- All three keys secure and correctly injected
- Webhook forwarding + signature verification working locally

### verify-connection

##### Goal

Confirm after setup/config that Stripe really connects — secret key valid, expected mode, webhook secret present

##### Scope

- Used when `/follow-service-stripe` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not create charges/customers

##### Execute

###### 1. Check Keys Present

> Goal: keys complete and mode consistent

1. Check `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` exist (do not print values)
2. Check key prefixes: `sk_test_`/`pk_test_` vs `sk_live_`/`pk_live_` — secret/publishable must be the same mode
3. Flag test keys in production config (or vice versa)

###### 2. Smoke Test API Call

> Goal: the API responds with this key

1. `stripe balance retrieve` (CLI) or `stripe.balance.retrieve()` (SDK)
2. 200 = key valid; 401 = invalid/revoked
3. Record the mode the API confirms (test vs live)

###### 3. Check Webhook Readiness

> Goal: the webhook endpoint is ready to receive events

1. Check `STRIPE_WEBHOOK_SECRET` format (`whsec_...`)
2. Local dev → `stripe listen` runs and forwards to the correct URL
3. Production → the dashboard webhook endpoint points at the production URL (HTTPS)

###### 4. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `mode-mismatch` / `webhook-not-ready`

##### Rules

- Use read calls only — never create a checkout/charge
- Do not print key values — show only prefix/mode
- Mode mismatch = always flag (test key in prod = critical)

##### Expected Outcome

- Verdict with mode + account evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `stripe` |
| Registry | `npm` |
| Latest Version | `22.6.2` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Stripe |
| License | `MIT` |
| Repository | `https://github.com/stripe/stripe-node` |
| Website | `https://stripe.com/` |
| Documentation | `https://docs.stripe.com/api?lang=node` |
| Releases / Changelog | `https://github.com/stripe/stripe-node/releases` |

##### Install

```bash
bun add stripe
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@stripe/stripe-js` | `npm` | `9.16.0` | Client-side SDK for checkout redirects and elements |
| `stripe` (CLI) | `system` | `unknown` | Webhook forwarding in dev — install via `mise use -g stripe` or `scoop install stripe` |

##### Notes

- Breaking changes in latest major: each major tracks a Stripe API version — pin the API version in account settings; webhook signature verification via `constructEvent` is mandatory
- Version pinned in SKILL.md: `stripe@22.6.2`, `@stripe/stripe-js@9.16.0`

## Expected Outcome

- Stripe SDK installed and configured correctly
- `/pricing` page with a clear CTA
- Checkout session working
- Subscriptions and customer portal manageable
- Webhook events correct and secure
- `/user/billing` and `/dashboard` display Stripe data
- Ready to deploy to production
