---
name: payment-review
description: ครอบคลุมทุก payment dimension
---

# Payment Review

Review payment processing ครอบคลุม checkout, subscription, refund, Stripe integration, payment security

## Goal

ครอบคลุมทุก payment dimension

## Checks

1. ตรวจสอบ checkout flow, payment intent creation, และ confirmation handling
2. ตรวจสอบ subscription lifecycle, billing cycles, และ proration logic
3. ตรวจสอบ refund processing, dispute handling, และ payment state transitions
4. ตรวจสอบ Stripe Connect integration, platform fee calculation, และ payout scheduling
5. ตรวจสอบ webhook signature verification, idempotency, และ payment event ordering
6. Critical: payment data leak, broken checkout, unverified webhook, missing refund path
7. High: missing idempotency, broken subscription renewal, incorrect fee calculation, missing payment state tracking

