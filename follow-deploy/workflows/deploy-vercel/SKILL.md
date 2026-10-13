---
name: follow-deploy-deploy-vercel
description: Deploy to Vercel by delegating to the /deploy-to-vercel skill
argument-hint: "[target]"
related:
  - deploy-to-vercel
  - follow-service-vercel
  - follow-secret-manager
  - ask-me
  - resolve-errors
---

## Goal

Map the generic `/follow-deploy` flow to Vercel by delegating all platform-specific work to `/deploy-to-vercel`

## Scope

- Use when the parent `/follow-deploy` selects Vercel as the target platform
- This workflow is a dispatch layer only — the real workflow lives in `/deploy-to-vercel` and `/follow-service-vercel`
- Suits Next.js, React applications, and frontend frameworks supported by Vercel

## Execute

### 1. Confirm Target

> Goal: confirm the target is Vercel and the project is ready

1. Check project type — Next.js/React or a framework Vercel supports (`vercel.json`, framework detection)
2. If unclear → `/ask-me`
3. Check prerequisites: env vars/secrets complete via `/follow-secret-manager` — set them in the Vercel dashboard or CLI

### 2. Map Generic Requirements

> Goal: map the parent flow's concepts to Vercel equivalents

1. env vars/secrets → Vercel environment variables (dashboard or CLI) via `/follow-secret-manager`
2. staging environment → Vercel preview deployment
3. deployment URL → `*.vercel.app` or the attached custom domain
4. version id → Vercel deployment id from the deploy command output

### 3. Delegate To Platform Skill

> Goal: use the platform-specific skill instead of the generic flow

1. Follow the whole `/deploy-to-vercel` flow — link project, deploy preview, deploy production, post-deploy verify
2. If extra setup/config is needed → follow `/follow-service-vercel`

### 4. Report

> Goal: report deploy results per the parent's generic contract

1. report deployment URL, deployment id, and post-deploy verify results
2. if fail → `/resolve-errors` max 3 rounds, then stop and report

## Rules

### 1. Delegate Only

- never duplicate platform logic in this workflow — always delegate to `/deploy-to-vercel`
- if `/deploy-to-vercel` doesn't cover the case → use `/follow-service-vercel`

### 2. Safety

- preview deployment before production per the parent's rules
- secrets only via `/follow-secret-manager` — never hardcode

## Expected Outcome

- deploy via `/deploy-to-vercel` succeeds with URL + deployment id
- results reported back to the parent flow of `/follow-deploy`
