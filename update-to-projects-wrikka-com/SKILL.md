---
name: update-to-projects-wrikka-com
description: Update and maintain the projects-wrikka-com project at D:\newkub\projects-wrikka-com
argument-hint: "[sync|ui|deploy|deps|all]"
related:
  - follow-create-web
  - deploy-to-cloudflare
  - follow-create-devin-project-skills
  - create-cloudflare
  - add-context-to-devin-global-skills
---

## Goal

Make updating the `projects-wrikka-com` project safe, verifiable, and complete without breaking what already works

## Scope

- Update the project dependencies
- Sync GitHub data or improve the server functions
- Improve UX/UI when the user asks (orange theme, icons, mobile-friendly)
- Maintain the routes `/`, `/projects`, `/projects/$repoName`
- Build, typecheck, and deploy to Cloudflare Workers
- Handle basic auth via `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`
- Create or edit this Devin skill when the project changes

## Execute

### 1. Prepare

> Goal: Prepare
1. Check the project state at `D:\newkub\projects-wrikka-com`
2. Read `package.json`, `wrangler.jsonc`, `vite.config.ts`, `src/lib/github.ts`, and `src/start.ts`
3. Check `GITHUB_TOKEN`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` in `.env` (local) and `wrangler secret` (production)
4. Check disk space before running the build

### 2. Sync GitHub Data

> Goal: Sync GitHub Data
1. Open `src/lib/github.ts`
2. Adjust the GraphQL query or REST endpoints for the new requirements
3. Always add `User-Agent` to every request
4. Run `bun run build` to typecheck
5. If there are errors → `resolve-errors`, up to 3 rounds

### 3. Update UI

> Goal: Update the UI
1. Edit the components in `src/components/`
2. Check responsiveness and mobile-friendliness with the `md:` breakpoints
3. Check syntax highlighting in `src/lib/markdown.ts`
4. Adjust the orange theme in `uno.config.ts` (brand 50-950)
5. Run the build again

### 4. Deploy

> Goal: Deploy
1. Run `bun run build`
2. Check `wrangler whoami`
3. If not authenticated → run `wrangler login` or ask for `CLOUDFLARE_API_TOKEN`
4. Set/update secrets with `bunx wrangler secret bulk .env` or `bunx wrangler secret put <key>`
5. Run `bun run deploy`
6. Verify the URL that comes back

### 5. Update Skill

> Goal: Update the skill
1. If the project structure or scripts change, update this `SKILL.md`
2. Check the `related` skills
3. Record the latest versions of the technologies in use

## Rules

1. Never commit or expose `GITHUB_TOKEN`, `BASIC_AUTH_PASS`
2. Never overwrite `dist` without a proper fresh build
3. Use `bun` as the primary package manager for this project
4. Run typecheck (`tsc --noEmit`) before every deploy
5. If the deploy fails, stop and report before retrying
6. Never delete `wrangler.jsonc`, `vite.config.ts`, `src/router.tsx`, `src/routes/__root.tsx`, `src/start.ts` without recreating them

- Use /follow-create-web (solid-tanstack-router) if needed
- Use /deploy-to-cloudflare if needed
- Use /follow-create-devin-project-skills if needed
- Use /create-cloudflare-token if needed
- Use /add-context-to-devin-global-skills if needed

## Expected Outcome

- The project builds and passes typecheck
- The deploy to Cloudflare Workers succeeds
- This Devin skill reflects the project's latest steps
- The user knows the URL, the credentials required, and any limitations hit

