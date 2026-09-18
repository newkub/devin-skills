# review-business — Full Dimension Checklist

## 1. Payment

- [ ] checkout flow: cart → payment → confirmation → receipt
- [ ] idempotent payment ops, double-charge protection
- [ ] webhook signature verification, replay handling
- [ ] refunds, partial refunds, disputes, chargebacks
- [ ] currency/rounding, tax handling, PCI scope

## 2. Subscription

- [ ] plan lifecycle: trial → active → past_due → canceled
- [ ] proration, upgrades/downgrades, dunning
- [ ] entitlements sync กับ billing provider
- [ ] grace periods, cancellation UX, win-back

## 3. Multi-Tenancy

- [ ] tenant isolation: data, compute, secrets
- [ ] tenant-scoped queries ทุกจุด (no cross-tenant leak)
- [ ] per-tenant config, quotas, billing
- [ ] tenant onboarding/offboarding, data export/delete

## 4. Feature Flags

- [ ] flag lifecycle: create → rollout → cleanup (no zombie flags)
- [ ] targeting rules, percentage rollouts, kill switches
- [ ] flag evaluation consistency ข้าม layers (server/client)

## 5. Realtime

- [ ] presence, sync conflict resolution, offline queue
- [ ] message ordering, delivery guarantees
- [ ] scaling: connection limits, fan-out cost

## 6. Email And Notifications

- [ ] transactional templates, unsubscribe/preferences
- [ ] deliverability: SPF/DKIM/DMARC, bounce handling
- [ ] notification channels: email/push/in-app consistency
- [ ] rate/digest controls, quiet hours

## 7. Domain Completeness

- [ ] happy path + error path + recovery ทุก flow
- [ ] edge cases: concurrent ops, retries, partial failures

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
