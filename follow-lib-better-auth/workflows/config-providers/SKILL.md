---
name: follow-lib-better-auth-config-providers
description: Configure Better Auth social providers, email plugins and options without clobbering the existing config
argument-hint: "[provider-or-plugin]"
related:
  - follow-lib-better-auth
  - follow-secret-manager
  - improve
  - report-before-after
  - learn
---

## Goal

Configure Better Auth providers (social OAuth, email/password options) and plugins in the existing `auth.ts` — merge with the current config, don't overwrite

## Scope

- Use when `auth.ts` is already set up and you need to add/change providers, plugins, session options
- Covers: `socialProviders`, `emailAndPassword` options, `plugins`, `trustedOrigins`, client plugin counterparts
- If there is no `auth.ts` yet → do `workflows/setup-auth/SKILL.md` first

## Execute

### 1. Read Current Config

> Goal: understand the existing config before editing

1. Read the whole `auth.ts` file — identify the existing database, plugins, providers
2. Check the env vars in use (`BETTER_AUTH_*`, provider `CLIENT_ID`/`CLIENT_SECRET`)
3. Run `/deep-review` dimension `config` if you suspect config differs across envs — if no config is found → do `setup-auth` instead

### 2. Configure Social Providers

> Goal: add OAuth providers correctly

1. Add to `socialProviders` e.g. `github: { clientId, clientSecret }` — read from env, never hardcode
2. Create the OAuth app in the provider console and set the callback URL exactly to `<BETTER_AUTH_URL>/api/auth/callback/<provider>`
3. Store `clientId`/`clientSecret` via `/follow-secret-manager`
4. Client side: `authClient.signIn.social({ provider: "github" })` — check the provider key matches

### 3. Configure Email And Plugins

> Goal: enable only the needed email options and plugins

1. `emailAndPassword`: `requireEmailVerification`, `sendResetPassword`, `minPasswordLength` as needed — requires a `sendEmail`/`sendVerificationEmail` implementation if verification is enabled
2. Add plugins in `plugins: [...]` — e.g. `twoFactor()`, `organization()`, `passkey()`, `admin()`
3. Every plugin with a client counterpart must be added on the client side too (`twoFactorClient()`, `organizationClient()`, etc.)
4. After adding a plugin with a schema → run `bunx auth@latest generate` or `migrate` so the tables match

### 4. Verify

> Goal: providers really work and the existing config isn't broken

1. Test a real OAuth flow against the provider — the callback returns with the session set correctly
2. Test the enabled email flows (verification, reset) — emails actually send or are mocked in dev
3. Run lint/typecheck — config keys must type-check
4. If broken → revert the key you just changed and report the diff; if passing → a short `/report-before-after`

## Rules

- Always read the existing config first — merge only the necessary keys, never rewrite the whole `auth.ts`
- Secrets (`clientSecret`, API keys) always via env vars — never put them in the config file
- Enable only the providers/plugins actually used — every plugin adds attack surface and tables
- `trustedOrigins` must cover any newly added origins — but stay strict always
- If unsure about an option/plugin → run `/learn-from-web` to check the official docs (better-auth.com)

## Expected Outcome

- The requested providers/plugins work fully on both server and client side
- The existing config isn't damaged — schema matches the enabled plugins
- OAuth/email flows verified through real runs
