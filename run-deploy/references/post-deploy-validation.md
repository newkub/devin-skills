# Post-Deploy Validation

Thoroughly inspect the deployment after a successful deploy to confirm the application really works in production

## When To Use

- After a successful deploy when the deployment is live
- Before closing a task or handing over work
- When there are critical paths to test, e.g. auth, checkout, API endpoints

## Steps

### 1. E2E Test Critical Paths

Run `/run-test` (e2e) to test critical paths after deploy:

- Login/auth flow
- Main user journey (search, create, update, delete)
- Important API endpoints
- Payment/checkout (if any)

### 2. Health Endpoint Check

Check the health endpoint and readiness probes:

- `GET /health` or `GET /api/health` must return 200
- Check readiness probes if the platform supports them (Kubernetes, Cloudflare)
- Check response time < 1000ms

### 3. Error Log Monitoring

Check error logs for 5-10 minutes after deploy:

- Check platform logs (Cloudflare dashboard, Vercel logs, Railway logs)
- Check browser console errors via `/watch-browser fix`
- Check network errors in browser DevTools
- If critical errors are found → roll back immediately and run `/resolve-errors`

### 4. Smoke Test Checklist

| Check | Method | Expected |
|-------|--------|----------|
| Page load | Open the URL in a browser | HTTP 200, page renders fully |
| API response | `curl` or browser | 200 OK, no 500/502 |
| Assets | Check CSS/JS loading | No 404 |
| Database | Check queries work | No connection error |
| Auth | Test login | Succeeds, token is correct |

## Rollback Trigger

If critical errors are found during validation:

1. Roll back immediately (see `references/rollback-recovery.md`)
2. Run `/resolve-errors` to find the root cause
3. Fix, then redeploy
4. Repeat validation until it passes
