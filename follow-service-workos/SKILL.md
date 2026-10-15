---
name: follow-service-workos
description: Use WorkOS for SSO, Directory Sync, and Authentication
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-product
  - follow-lib-better-auth

---

## Goal

Configure and use WorkOS APIs for authentication and identity management

## Scope

Use in projects that need WorkOS SSO, SCIM, User Management, or Admin Portal

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

- Setup: SDK install, `WORKOS_API_KEY`/`WORKOS_CLIENT_ID`, client init → `## Merged Details → setup-workos`
- Config: AuthKit/SSO, redirect URIs, organizations/connections, Directory Sync webhooks → `## Merged Details → config-workos`
- Verify: API key/client id valid, organizations reachable → `## Merged Details → verify-connection`

### 1. Install SDK

Prepare the SDK for WorkOS
> Goal: Install the SDK and prepare credentials to be ready

Latest: `@workos-inc/node@10.14.0` (verified 2026-09-24) — AuthKit/User Management API is the modern path, `sso.*` is the legacy flow

1. Install the package per runtime (`bun add @workos-inc/node`, `workos-python`, etc.)
2. Create an API key from the WorkOS Dashboard
3. Store `WORKOS_API_KEY` and `WORKOS_CLIENT_ID` in `/follow-secret-manager`, then inject them into the environment

### 2. Configure WorkOS

Configure WorkOS to be ready to use
> Goal: Set the environment, redirect URI, and organization

1. Set `WORKOS_API_KEY` and `WORKOS_CLIENT_ID`
2. Set the redirect URI and allowed origins
3. Create organizations and connections per provider (SAML, OIDC, Microsoft, Google)

### 3. Implement SSO

Use SSO with WorkOS APIs
> Goal: Create the authorization flow and manage the user session

1. Create the `authorization_url` with `workos.sso.getAuthorizationURL`
2. Receive the `code` callback and call `workos.sso.getProfileAndToken`
3. Create/update the user session
4. Validate `state` and `code_challenge` for PKCE

### 4. Directory Sync

Manage Directory Sync and webhook events
> Goal: Directory Sync

1. Create a directory for the connection
2. Set a webhook endpoint for events
3. Handle users/groups from the `dsync.*` APIs
4. Verify the webhook signature

## Rules

### 1. Security

- Do not hardcode the API key in code
- Store `WORKOS_API_KEY` in `/follow-secret-manager`
- Validate webhook signatures every time
- Handle state securely

### 2. Configuration

- Use environment-based config

- Use /open-web-for-config-secret if needed (service workos)
- Use /follow-create-product if needed
- Use /follow-lib-better-auth if needed

## Merged Details

### config-workos

##### Goal

Set/edit WorkOS configuration — AuthKit, SSO connections, Directory Sync, redirect URIs, and session config — without clobbering existing settings

##### Scope

- Define env vars and redirect URIs
- Configure AuthKit/User Management or the legacy `sso.*` flow
- Create organizations, connections (SAML/OIDC), and Directory Sync webhooks
- Does not cover first-time SDK install → use `## Merged Details → setup-workos`

##### Execute

###### 1. Read Current Config

> Goal: Know the current state before editing

1. Read `.env*` and the existing auth module to identify the flow in use (AuthKit vs `sso.*`)
2. Do `/check-secrets env-vars` to identify missing vars
3. Check the redirect URIs and connections already configured in the dashboard — use `/open-web-for-config-secret` (service workos)
4. If the SDK/credentials are not there yet → do `## Merged Details → setup-workos` instead

###### 2. Configure Env And Redirects

> Goal: Set env vars and redirect URIs completely

1. Define `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` (API key is server-only)
2. If using AuthKit sessions → define a cookie password env such as `WORKOS_COOKIE_PASSWORD` (long random value, stored in `/follow-secret-manager`)
3. Set the redirect URI and allowed origins in the dashboard to match app routes such as `/callback`
4. Merge only the necessary keys — never overwrite the existing env/config

###### 3. Configure AuthKit Or SSO

> Goal: Enable the auth flow that matches the product

1. AuthKit (modern path): enable AuthKit in the dashboard and use User Management APIs for authorization URL, code exchange, and sessions
2. Legacy SSO: use `workos.sso.getAuthorizationURL` and `workos.sso.getProfileAndToken`
3. Create organizations and connections per provider (SAML, OIDC, Google, Microsoft)
4. Set `state` and PKCE (`code_challenge`) for flows that support them

###### 4. Configure Directory Sync And Webhooks

> Goal: Receive user/group events securely

1. Create a directory for the connection that needs sync
2. Set a webhook endpoint in the dashboard and store the webhook secret in `/follow-secret-manager`
3. Verify the webhook signature every time per the official docs
4. Map `dsync.*` events to the app's user/group handlers

###### 5. Verify

> Goal: Confirm the auth flow works end-to-end

1. Test authorization URL → callback → session in dev
2. Do `/run-verify` and test webhook delivery if present
3. If it fails → revert the changed keys, do `resolve-errors`, then report the diff

##### Rules

- Use environment-based config — never hardcode keys or commit secrets
- AuthKit/User Management API is the modern path — use `sso.*` only for existing legacy flows
- Validate webhook signatures every time
- Redirect URIs in the dashboard must match the real routes in every environment
- If unsure about an option/method → check official docs or `learn` (web)

##### Expected Outcome

- AuthKit/SSO flow works from authorize through session
- Redirect URIs, connections, organizations correct per environment
- Directory Sync webhook is secure and receives events
- Config merged without clobbering existing settings

### setup-workos

##### Goal

Install the WorkOS SDK, create credentials from the dashboard, and init the client so it can call the APIs — first-time setup only

##### Scope

- Install the SDK per runtime (`@workos-inc/node`, `workos-python`, etc.)
- Create and store `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` securely
- Init the client and smoke check
- Does not cover AuthKit/SSO/Directory config → use `## Merged Details → config-workos`

##### Execute

###### 1. Check Prerequisites

> Goal: Confirm the runtime and current state (idempotent)

1. Read `package.json` to identify the runtime and package manager
2. Check whether `@workos-inc/node` or another SDK is already installed → if so, skip to verify
3. Do `/check-secrets env-vars` to see whether `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` already exist
4. If there is no WorkOS account → stop and tell the user to create one from the dashboard

###### 2. Install SDK

> Goal: Install the SDK per runtime

1. Node/Bun: `bun add @workos-inc/node` (or the detected package manager)
2. Python: `pip install workos` — for other languages check official docs
3. Confirm the dependency is in the project manifest

###### 3. Create And Store Credentials

> Goal: Prepare the API key and client ID securely

1. Create an API key and read the client ID from the WorkOS Dashboard — use `/open-web-for-config-secret` (service workos) if the dashboard must be opened
2. Store `WORKOS_API_KEY` and `WORKOS_CLIENT_ID` in `/follow-secret-manager` — never put the real `.env`
3. Inject them into the dev/staging/prod environments separately

###### 4. Init Client And Verify

> Goal: init the client and smoke check against the real API

1. Create the client such as `new WorkOS(process.env.WORKOS_API_KEY)` in a server-side module
2. Smoke check with a read-only call such as listing users/organizations — check official docs for the latest methods
3. Do `/run-verify` — if it fails → do `resolve-errors` max 3 rounds, then stop and report

##### Rules

- Never hardcode the API key or commit secrets — always use `/follow-secret-manager`
- The client must be initialized server-side only — never expose `WORKOS_API_KEY` to the browser
- Separate keys per environment (dev/staging/prod)
- If unsure about an API/method → check official docs or `learn` (web) first

##### Expected Outcome

- WorkOS SDK installed and present in the manifest
- `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` secure and correctly injected
- Client initialized and smoke check passes

### verify-connection

##### Goal

Confirm after setup/config that WorkOS really connects — `WORKOS_API_KEY`/`WORKOS_CLIENT_ID` valid, API responds

##### Scope

- Used when `/follow-service-workos` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change organizations/connections

##### Execute

###### 1. Check Credentials

> Goal: key and client id complete

1. Check `WORKOS_API_KEY` (`sk_...` test / live format) and `WORKOS_CLIENT_ID` (`client_...`) exist — do not print values
2. flag test keys in production config (or vice versa)
3. If webhooks are used → `WORKOS_WEBHOOK_SECRET` exists

###### 2. Smoke Test API Call

> Goal: the WorkOS API responds

1. Call `workos.organizations.listOrganizations({limit: 1})` or an equivalent minimal call
2. 200 = key valid; 401 = invalid key
3. If using AuthKit → check the redirect URI config matches the app

###### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `env-mismatch` / `webhook-missing`

##### Rules

- Use list calls only — never create/update/delete
- Do not print key values — show only prefix/environment
- Auth failure → recommend `/follow-secret-manager` — do not fix it yourself

##### Expected Outcome

- Verdict with environment (test/live) evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `@workos-inc/node` |
| Registry | `npm` |
| Latest Version | `10.13.0` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | WorkOS |
| License | `MIT` |
| Repository | `https://github.com/workos/workos-node` |
| Website | `https://workos.com/` |
| Documentation | `https://workos.com/docs` |
| Releases / Changelog | `https://github.com/workos/workos-node/releases` |

##### Install

```bash
bun add @workos-inc/node
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `workos` | `PyPI` | `unknown` | `workos-python` SDK for Python backends |
| `@workos-inc/authkit-nextjs` | `npm` | `unknown` | AuthKit helpers for Next.js apps |

##### Notes

- Breaking changes in latest major: AuthKit / User Management API is the modern path; `sso.*` calls are the legacy flow
- Version pinned in SKILL.md: `10.13.0`

## Expected Outcome

- WorkOS SDK ready and configured correctly
- SSO/Dsync ready to use
- Credentials secure
- User data syncs correctly
