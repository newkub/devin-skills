---
name: email-review
description: ครอบคลุมทุก email dimension
---

# Email Review

Review email ครอบคลุม template rendering, validation, unsubscribe, deliverability, SPF/DKIM/DMARC

## Goal

ครอบคลุมทุก email dimension

## Checks

1. ตรวจสอบ email template rendering, dynamic content, และ template versioning
2. ตรวจสอบ email validation, bounce handling, และ suppression list management
3. ตรวจสอบ unsubscribe handling, consent management, และ CAN-SPAM compliance
4. ตรวจสอบ deliverability: SPF, DKIM, DMARC, และ email authentication headers
5. Critical: broken unsubscribe, no SPF/DKIM, email injection vulnerability
6. High: missing bounce handling, broken template, no DMARC

