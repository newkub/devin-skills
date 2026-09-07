# Verify Email Deliverability

## Goal

ตรวจว่า email จาก domain/service ส่งถึง inbox จริง — DNS records (SPF, DKIM, DMARC) ถูกต้อง, sender reputation ดี และ test delivery ผ่าน

## Scope

- ตรวจ domain DNS records ที่เกี่ยวกับ email + email service config (Resend, SendGrid, SES, SMTP)
- ครอบคลุม: SPF, DKIM, DMARC, MX records, bounce handling, sender identity verification
- Read-mostly: DNS อ่านอย่างเดียว — test send ต้อง user confirm (ส่งจริง)

## Execute

### 1. Check SPF

> Goal: SPF record ถูกต้องและครอบส่งจริง

1. `nslookup -type=TXT <domain>` หา `v=spf1` record
2. ตรวจ: includes ครอบ email provider ที่ใช้ (เช่น `include:amazonses.com`), ไม่มี `+all`, `~all` vs `-all` policy
3. flag: multiple SPF records (invalid), lookup count >10 (SPF limit)

### 2. Check DKIM

> Goal: DKIM signing เปิดและ keys valid

1. หา DKIM selectors จาก provider docs — `nslookup -type=TXT <selector>._domainkey.<domain>`
2. ตรวจ provider console/config ว่า DKIM enabled สำหรับ domain
3. flag: DKIM ไม่ setup, keys ที่ยัง pending verification

### 3. Check DMARC

> Goal: DMARC policy มีและเหมาะสม

1. `nslookup -type=TXT _dmarc.<domain>` — ต้องมี `v=DMARC1`
2. ตรวจ policy: `p=none` (monitor) → `quarantine` → `reject` ตาม maturity
3. flag: ไม่มี DMARC เลย, `p=none` ค้างนาน, ไม่มี `rua` reporting address

### 4. Check Service Config

> Goal: email provider ตั้งค่าถูก

1. Domain verified ใน provider console (Resend/SES/…)
2. From addresses ใช้ verified domain — ไม่ใช่ free domains (gmail.com)
3. Bounce/complaint handling: webhooks หรือ suppression lists
4. Reply-to และ sender identity สมเหตุสมผล

### 5. Test Send (Optional, Confirmed)

> Goal: ส่ง test email จริงยืนยัน end-to-end

1. ต้อง user confirm — ส่ง email จริงมีผลจริง
2. ส่ง test ไปยัง address ที่ user ระบุ หรือ mail-tester service
3. ตรวจ headers ที่ได้รับ: SPF/DKIM/DMARC pass results

### 6. Report

> Goal: สรุป deliverability posture

1. ใช้ `/report-table`: `No.`, `Check`, `Expected`, `Actual`, `Status`, `Fix`
2. Verdict: `deliverable`, `at-risk`, `broken` พร้อม evidence
3. แนะนำ DNS changes ที่ต้องทำ (user ทำเองที่ DNS provider)

## Rules

### 1. Evidence-Based

- DNS findings จาก actual lookups — ไม่เดาจาก config files
- ระบุ resolver ที่ใช้และเวลาที่ตรวจ (DNS propagation)

### 2. Real Sends Need Consent

- test email ต้อง user confirm — ส่งจริงมี side effects
- ไม่ส่งไปยัง addresses ที่ user ไม่ได้ให้

### 3. Read-Only On DNS

- ไม่แก้ DNS records — รายงาน records ที่ต้องเพิ่ม/แก้ให้ user ทำที่ provider
- ระบุ exact record values ที่ต้องใส่

## Expected Outcome

- SPF/DKIM/DMARC status พร้อม actual records
- Deliverability verdict พร้อม fixes ที่ระบุ record เฉพาะ
- Test send result ถ้า user ยืนยัน
