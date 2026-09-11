# review-release — Full Dimension Checklist

## 1. Version And Semver

- [ ] version bump correct per semver, manifests synced
- [ ] tag/changelog/version consistency

## 2. Changelog And Notes

- [ ] changelog complete: feat/fix/breaking sections
- [ ] release notes drafted, highlights accurate
- [ ] contributors/credits ถ้ามี

## 3. Breaking Changes

- [ ] breaking changes documented + migration notes
- [ ] deprecations honored, removed APIs listed

## 4. Platform And Rollback

- [ ] target platforms built/tested, artifacts verified
- [ ] rollback plan: previous version restorable
- [ ] staged rollout/canary plan ถ้าเหมาะสม

## 5. License And Legal

- [ ] license consistent, third-party licenses bundled
- [ ] export/compliance notes ถ้าจำเป็น

## 6. Deployment Readiness (merged: review-deploy)

- [ ] env vars + secrets provisioned (references/deploy-env-secrets.md)
- [ ] build artifacts, health checks, rollback (references/deploy-*.md)
- [ ] zero-downtime strategy, migration scripts
- [ ] DNS/CDN/SSL readiness

## 7. Post-Deploy Verify

- [ ] health endpoints, smoke tests, error rates (references/deploy-verify.md)
- [ ] `/watch-deploy`, `/run-test-api`, `/check-security-headers`
- [ ] rollback trigger criteria

## Scoring

- ตาม references/scoring.md; grade A (90+), B (80+), C (70+), D (60+), F (<60)
