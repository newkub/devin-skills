---
name: subscription-review
description: ครอบคลุมทุก subscription dimension
---

# Subscription Review

Review subscription lifecycle ครอบคลุม billing cycles, renewal, cancellation, proration, subscription state

## Goal

ครอบคลุมทุก subscription dimension

## Checks

1. ตรวจสอบ subscription creation: plan selection, trial period, payment method collection
2. ตรวจสอบ billing cycle: cycle period, billing date, timezone handling, leap year handling
3. ตรวจสอบ renewal process: auto-renewal, failed renewal, dunning management, retry logic
4. ตรวจสอบ cancellation: immediate vs end-of-period, cancellation reason, reactivation
5. ตรวจสอบ proration: upgrade/downgrade proration, mid-cycle change, credit calculation
6. ตรวจสอบ subscription state: state machine, state transitions, webhook synchronization
7. ตรวจสอบ subscription analytics: MRR, churn rate, LTV tracking
8. Critical: missing renewal handling, failed payment ไม่มี dunning, state desync
9. High: incorrect proration, missing cancellation handling, no webhook sync

