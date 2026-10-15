---
name: run-preview
description: Run a preview build to test before an actual deploy
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - run-build
  - watch-browser
  - run-test
  - report
  - resolve-errors
  - run-deploy
  - run-dev
  - run-review
---

## Goal

Run a preview build to test before an actual deploy, covering build, start server, test, verify, and share preview

## Scope

Use for all kinds of preview, both a local preview server and a deployment preview (Vercel, Cloudflare, Netlify), before an actual deploy

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (preview)

### 1. Build Preview

> Goal: Build Preview

Create a preview build for testing

1. Run `/run-build` to create the preview build
2. Set the build mode to preview, not production
3. Check the build output for errors
4. For Vite: use `bun run build` then `bun run preview`
5. For Next.js: use `bun run build` then `bun run start`
6. For Nuxt: use `bun run build` then `bun run preview`
7. For Vercel: use `bunx vercel preview` for a deployment preview
8. For Cloudflare: use `bunx wrangler pages dev` for a local preview

### 2. Start Preview Server

> Goal: Start Preview Server

Run the preview server per the framework

1. Run the preview server command per the framework in use
2. Check that the server is running by watching the console output
3. Record the preview URL (local or deployment URL)
4. For a deployment preview, wait until the URL is ready

### 3. Test Preview

> Goal: Test Preview

Test the preview in the browser

1. Open the preview URL in the browser
2. Run `/watch-browser fix` to continuously check the page
3. Test the key features that changed recently
4. Check the console errors and warnings
5. Run `/run-test` for detailed testing

### 4. Verify Preview

> Goal: Verify Preview

Verify the correctness of the preview

1. Check that every page loads correctly
2. Check that assets and static files all load
3. Test the critical user flows
4. Check the responsive design across multiple screen sizes
5. Check that the API endpoints work correctly (if any)
6. Check that the environment variables are correct for the preview

### 5. Report Issues

> Goal: Report Issues

Report the issues found in a table

1. Run `/report` to format a table
2. Create a table with columns: Category, Issue, Severity, Location, Action Required
3. Categories: Build, Pages, Assets, API, Console Errors, Responsive
4. Order the issues by severity (critical, high, medium, low)

### 6. Share Preview

> Goal: Share Preview

Share the preview with the team and collect feedback

1. Share the preview URL with the team
2. Collect feedback and record the issues found
3. If there are issues, run `/resolve-errors` then rebuild the preview
4. If everything passes, run `/run-deploy` for the actual deploy

## Rules

- Use the preview build mode, not production
- Set separate environment variables for preview from production
- Use a preview or staging database if needed
- Test the most recently changed features first
- Always test the critical user flows
- Test the responsive design across multiple screen sizes
- Use `/watch-browser fix` for continuous checking
- Use `/run-test` for detailed testing
- Use `/report` to report issues
- Stop the preview server when not in use
- Periodically delete old preview builds
- Use preview URLs temporarily; never use them as production
- If there are issues, fix them before the actual deploy
- For a deployment preview, wait until the URL is ready before testing

## Common Mistakes

- Using a production build instead of a preview build
- Not setting environment variables for preview
- Testing only the changed pages and not the critical flows
- Not checking the console errors
- Forgetting to stop the preview server when not in use
- Using a preview URL as production

## Anti-Patterns

- Deploying for real without going through a preview first
- Using a production database for preview
- Skipping responsive design testing
- Not reporting the issues found in the preview
- Skipping API testing in the preview
- Use /run-dev if needed
- Use /run-review if needed

## Expected Outcome

- The preview build succeeds with no errors
- The preview server works
- Features work correctly in the preview
- The console has no errors or warnings
- The responsive design works on every screen size
- Issues are identified, reported in a table, and fixed before deploy
- Team feedback is collected
- Ready for `/run-deploy` for the actual deploy
