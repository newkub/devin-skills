---
name: follow-deploy-deploy-cloudflare
description: Deploy to Cloudflare by delegating to the /deploy-to-cloudflare skill
argument-hint: "[target]"
related:
  - deploy-to-cloudflare
  - follow-service-cloudflare
  - follow-secret-manager
  - ask-me
  - resolve-errors
---

## Goal

Map the generic `/follow-deploy` flow to Cloudflare by delegating all platform-specific work to `/deploy-to-cloudflare`

## Scope

- Use when the parent `/follow-deploy` selects Cloudflare as the target platform
- This workflow is a dispatch layer only — the real workflow lives in `/deploy-to-cloudflare` and `/follow-service-cloudflare`
- Suits edge computing, serverless Workers, Pages sites, and frameworks deployed to Cloudflare

## Execute

### 1. Confirm Target

> Goal: confirm the target is Cloudflare and the project is ready

1. Check project type — Workers/Pages (`wrangler.toml`/`wrangler.jsonc`) or a framework deployed to Cloudflare
2. If unclear whether Workers or Pages → `/ask-me`
3. Check prerequisites: env vars/secrets complete via `/follow-secret-manager`

### 2. Map Generic Requirements

> Goal: map the parent flow's concepts to Cloudflare equivalents

1. env vars/secrets → `wrangler secret put` or `vars` in `wrangler.toml`/`wrangler.jsonc`
2. staging environment → `wrangler deploy --env staging`
3. deployment URL → `*.workers.dev` or the bound custom domain
4. version id → output of `wrangler deploy` / `wrangler deployments list`

### 3. Delegate To Platform Skill

> Goal: use the platform-specific skill instead of the generic flow

1. Follow the whole `/deploy-to-cloudflare` flow — build, deploy, post-deploy verify
2. If wrangler setup/auth is needed first → follow `follow-service-cloudflare/workflows/setup-wrangler/SKILL.md`
3. If bindings/environments need changes → follow `follow-service-cloudflare/workflows/config-bindings/SKILL.md`
4. If deploying a worker only → follow `follow-service-cloudflare/workflows/deploy-worker/SKILL.md`

### 4. Report

> Goal: report deploy results per the parent's generic contract

1. report deployment URL, version/revision id, and post-deploy verify results
2. if fail → `/resolve-errors` max 3 rounds, then stop and report

## Rules

### 1. Delegate Only

- never duplicate platform logic in this workflow — always delegate to `/deploy-to-cloudflare`
- if `/deploy-to-cloudflare` doesn't cover the case → use the matching `/follow-service-cloudflare` workflow

### 2. Safety

- staging/preview before production per the parent's rules
- secrets only via `/follow-secret-manager` — never hardcode

## Expected Outcome

- deploy via `/deploy-to-cloudflare` succeeds with URL + version
- results reported back to the parent flow of `/follow-deploy`
