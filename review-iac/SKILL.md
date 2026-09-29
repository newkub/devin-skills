---
name: review-iac
description: Review IaC — Terraform/Pulumi/CDK/K8s manifests, state, secrets, drift, tagging
argument-hint: "[scope]"
related:
  - scan-codebase
  - review-security
  - review-cost
  - review-delivery
  - review-compliance
  - deep-review-then-fix
  - report
  - suggest-next-action
---

## Goal

Review infrastructure-as-code — Terraform, Pulumi, CDK, Helm, K8s manifests — ตรวจ state safety, secrets, plan drift, provider pinning, tagging, module hygiene — report-only

## Scope

ใช้กับ repo ที่มี `*.tf`, `Pulumi.yaml`, `cdk.json`, `Chart.yaml`, `k8s/` manifests, `wrangler.jsonc`, หรือ equivalent — ไม่รวม application security (`/review-security`), infra cost deep-dive (`/review-cost`), CI/CD pipeline (`/review-delivery`)

## Execute

### 1. Prepare And Inventory

> Goal: รู้ว่า IaC stack ไหน อยู่ที่ไหน

1. ทำ `/scan-codebase` — หา `*.tf`, `*.tfvars`, `Pulumi.*.yaml`, `cdk.json`, `k8s/`, `helm/`, `*.yaml` manifests
2. ระบุ tool versions, backends, workspaces/stacks, environments (dev/staging/prod)

### 2. Check State And Safety

> Goal: state ปลอดภัย ไม่พัง production

1. backend เป็น remote state (S3/GCS/Terraform Cloud) พร้อม locking — ไม่ commit `*.tfstate`
2. `lifecycle` blocks — `prevent_destroy` บน stateful resources (databases, buckets)
3. `.gitignore` ครอบคลุม `*.tfstate*`, `.terraform/`, `*.tfvars` ที่มี secrets
4. secrets ใน tfvars/env — hardcoded credentials, tokens, keys → Critical

### 3. Check Drift And Pinning

> Goal: infra reproducible และ drift ตรวจได้

1. provider/module versions pinned (`required_providers`, lock file `.terraform.lock.hcl` committed)
2. plan drift detection — CI มี `plan` on PR, `apply` ต้อง approve
3. no `count = 0` หรือ commented-out resources ที่ทำให้ state ไม่ตรง
4. mutable patterns — `latest` tags, unpinned AMIs, `master` branches

### 4. Check K8s/Helm Manifests

> Goal: workload specs ปลอดภัยและ production-ready

1. `resources` requests/limits ตั้งครบ, `securityContext` (non-root, readOnlyRootFilesystem)
2. `livenessProbe`/`readinessProbe`, `PodDisruptionBudget`, replica strategy
3. image tags pinned (ไม่ใช่ `latest`), imagePullPolicy ถูกต้อง
4. RBAC least-privilege, NetworkPolicy, secrets เป็น Secrets/ESO ไม่ใช่ plaintext env

### 5. Check Hygiene And Tagging

> Goal: maintainable, auditable, cost-visible

1. consistent tagging/labels — env, owner, cost-center, managed-by
2. modules/DRY — ไม่ copy-paste resource blocks ข้าม envs
3. naming convention สม่ำเสมอ, outputs มี description
4. docs — README ต่อ stack, architecture notes

### 6. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence (file path + resource name)
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: secrets/credentials hardcoded, `*.tfstate` committed, public exposure (0.0.0.0/0 ingress, public S3), no state locking, `prevent_destroy` ขาดบน production DB
- `High`: unpinned providers/images, no plan-on-PR, missing resource limits/probes, plaintext secrets in env
- `Medium`: tagging gaps, module duplication, drift-prone patterns, missing PDB
- `Low`: naming inconsistency, missing output descriptions, docs gaps


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `drift`, `pinning` — state vs reality, locked versions | `subskills/check-drift/SKILL.md` |
| `k8s`, `helm`, `kubernetes` — manifest resources/security | `subskills/check-k8s/SKILL.md` |
| `state`, `backend` — state locking, secrets, prevent_destroy | `subskills/check-state/SKILL.md` |

## Check: Infra

### Goal

ตรวจสุขภาพ infrastructure ของ domains/endpoints — DNS records ถูกต้อง, TLS certificate ไม่ใกล้หมดอายุ, พร้อม renewal

### Scope

- `--dns` → เช็คเฉพาะ DNS; `--ssl` → เช็คเฉพาะ certificate; ไม่ระบุ → เช็คทั้งสอง
- Read-only: รายงานสถานะ ไม่แก้ไข config

### Execute

#### 1. Inventory Endpoints

> Goal: รวบรวม domains/endpoints ที่ต้องตรวจ

1. อ่านจาก argument, deploy config, `wrangler.toml`, `vercel.json`, DNS provider หรือ env vars
2. รวมทุก domain/subdomain ที่ project ใช้

#### 2. Dispatch To Subskills

> Goal: ตรวจแต่ละด้านผ่าน subskill ที่เฉพาะเจาะจง

| Flag    | Subskill |
|---------|----------|
| `--dns` | ``#### Dns`` — A/AAAA/CNAME, TTL, dangling records |
| `--ssl` | ``#### Ssl`` — cert expiry, chain, renewal readiness |

1. ถ้าระบุ `--dns` → อ่านและทำตาม ``#### Dns``
2. ถ้าระบุ `--ssl` → อ่านและทำตาม ``#### Ssl``
3. ถ้าไม่ระบุ → ทำทั้งสองตามลำดับ

#### 3. Report

> Goal: สรุปสถานะพร้อม action

1. ใช้ `/report` คอลัมน์: No., Endpoint, Area, Status, Severity, Action
2. ระบุวันหมดอายุและช่องทาง renewal

### Rules

- Evidence-based — ตรวจจริง ไม่เดา
- Read-only
- รายงานทั้ง endpoint ที่ผ่านและไม่ผ่าน

### Expected Outcome

- ตารางสุขภาพ DNS + TLS พร้อม severity และ renewal actions

### Dns

##### Goal

ตรวจ DNS configuration ของ domains ที่เกี่ยวข้อง — records ถูกต้อง, ไม่มี stale/missing records, TTLs เหมาะสม และไม่มี misconfig ที่ทำให้ down ได้

##### Scope

- ตรวจ DNS records ของ domains ที่ project ใช้: A/AAAA, CNAME, MX, TXT, NS, CAA
- ครอบคลุม: record correctness, TTL sanity, dangling CNAMEs, DNSSEC, propagation consistency
- Read-only: ตรวจอ่าน DNS เท่านั้น — แก้ที่ DNS provider โดย user

##### Execute

###### 1. Inventory Domains

> Goal: รวบรวม domains/subdomains ที่เกี่ยวข้อง

1. หาจาก config: env vars, deploy configs (`wrangler.toml`, `vercel.json`), docs, certs
2. ระบุ apex + subdomains ที่ใช้งาน (www, api, app, staging)
3. ถ้า argument ระบุ domain → ตรวจตัวนั้นเจาะลึก

###### 2. Check Core Records

> Goal: ตรวจ records หลักต่อ domain

1. `nslookup`/`Resolve-DnsName` per type: A/AAAA → IPs ที่ตอบ, CNAME → target ถูก
2. Dangling CNAME: target ที่ไม่ resolve แล้ว (subdomain takeover risk — severity สูง)
3. CNAME at apex: invalid ตาม DNS spec — flag
4. NS records: nameservers ตอบ consistent, ไม่มี lame delegation
5. CAA records: จำกัด CA ที่ออก cert ได้ — missing CAA = info

###### 3. Check TTLs And Consistency

> Goal: ตรวจ TTL และ propagation

1. TTL sanity: ต่ำเกิน (<60s = resolver load), สูงเกินบน records ที่เปลี่ยนบ่อย
2. เช็คจากหลาย resolvers (8.8.8.8, 1.1.1.1, local) — propagation ไม่สม่ำเสมอ = recent change หรือ split-horizon
3. flag: records ที่ตอบต่างกันข้าม resolvers โดยไม่ตั้งใจ

###### 4. Check Related Records

> Goal: ตรวจ records รองที่สำคัญ

1. MX records ถ้า domain รับ email — ทำ `/review-delivery` ในส่วน `## Verify` สำหรับ SPF/DKIM/DMARC
2. TXT records: verification tokens ที่ค้าง, legacy records
3. HTTPS/SVCB records ถ้ามี

###### 5. Report

> Goal: สรุป DNS health

1. ใช้ `/report table`: `No.`, `Domain`, `Record`, `Issue`, `Severity`, `Fix`
2. Severity: `critical` (dangling CNAME, NXDOMAIN บน live service), `high` (missing MX ที่ต้องมี), `medium` (TTL issues), `info` (missing CAA/DNSSEC)
3. ระบุ exact changes ที่ต้องทำที่ DNS provider

##### Rules

###### 1. Evidence-Based

- ทุก finding จาก actual DNS lookups — ระบุ resolver และเวลา
- propagation issues ต้องเช็คหลาย resolvers ก่อนสรุป

###### 2. Read-Only

- ไม่แก้ DNS — ระบุ changes ที่ต้องทำให้ user ไปแก้ที่ provider
- ระวัง flag records ที่ตั้งใจ (CDN anycast, split-horizon)

###### 3. Context Aware

- wildcard records, geo-DNS, failover configs อาจตอบต่างกันโดยตั้งใจ — flag info ไม่ใช่ violation
- TTL สูงบน stable records เป็นเรื่องดี — context matters

##### Expected Outcome

- DNS health report ต่อ domain พร้อม actual records
- Dangling/misconfig findings พร้อม severity
- รายการ DNS changes ที่ต้องทำ

### Ssl

##### Goal

ตรวจ TLS certificates ของ domains ที่ project ใช้ — expiry dates, renewal readiness, chain issues — เพื่อไม่ให้ cert หมดอายุจน service ล่ม

##### Scope

- ตรวจ certs ของ domains/endpoints ที่ project serve หรือพึ่งพา
- ครอบคลุม: expiry dates, SAN coverage, chain validity, renewal mechanism (auto vs manual), cert transparency
- Read-only: ตรวจ certs จาก remote — ไม่แก้ config

##### Execute

###### 1. Inventory Endpoints

> Goal: รวบรวม domains ที่ต้องเช็ค cert

1. หาจาก deploy configs, env vars, docs, DNS records (ทำ `## Check: Infra` --dns` ร่วม)
2. รวม external dependencies ที่ HTTPS-critical: APIs, CDNs, webhook targets
3. ระบุ cert provider ต่อ domain: Let's Encrypt, Cloudflare, ACM, manual

###### 2. Check Certificate Status

> Goal: ดึง cert info ต่อ endpoint

1. เช็ค cert จาก remote: PowerShell `TcpClient`+`SslStream` หรือ `openssl s_client -connect <domain>:443 -servername <domain>`
2. เก็บ: expiry date, days remaining, issuer, SANs, chain validity
3. flag: expiry <30 วัน (`high`), <7 วัน (`critical`), expired (`critical+`)

###### 3. Check Renewal Readiness

> Goal: ตรวจว่า renewal จะทำงานเมื่อถึงเวลา

1. Auto-renewal: platform-managed certs (Cloudflare, Vercel, ACM, Let's Encrypt via certbot/Caddy) — ตรวจว่า renewal job/service มีอยู่และทำงาน
2. Manual certs: flag ทุกตัวที่ expiry <60 วันและไม่มี auto-renewal
3. ACME challenges: HTTP-01 ต้องเข้าถึง `/.well-known/` ได้, DNS-01 ต้องมี API access — flag blockers
4. SAN coverage: cert ครอบ subdomains ที่ใช้จริงไหม (mismatch = browser warnings)

###### 4. Check Chain And Protocol

> Goal: ตรวจ cert chain และ TLS hygiene

1. Chain completeness — missing intermediates = some clients fail
2. Protocol versions: TLS 1.0/1.1 ที่ยังเปิด = flag (deprecated)
3. Weak ciphers ที่ยัง accept — ทำ `/review-security` ร่วม

###### 5. Report

> Goal: สรุป cert health พร้อม timeline

1. ใช้ `/report table`: `No.`, `Domain`, `Expiry`, `Days Left`, `Renewal`, `Severity`, `Action`
2. เรียงตาม days remaining — ใกล้หมดก่อน
3. แนะนำ: renewal steps, auto-renewal setup, monitoring/alerting สำหรับ expiry

##### Rules

###### 1. Evidence-Based

- expiry จาก cert จริงที่ serve — ไม่เดาจาก provider docs
- ระบุ check time — cert เปลี่ยนได้

###### 2. Read-Only

- ไม่ renew หรือแก้ cert config — รายงานให้ user/provider จัดการ
- ไม่ probe ports นอกเหนือ 443 โดยไม่จำเป็น

###### 3. Coverage

- SANs/wildcards ต้องครอบ domains ที่ใช้จริง — mismatch คือ finding
- internal/staging domains ที่ self-signed โดยตั้งใจ — flag info

##### Expected Outcome

- Cert inventory พร้อม expiry timeline
- Renewal readiness ต่อ domain — auto vs manual
- Early warnings ก่อน cert หมดอายุ

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `infra` | `## Check: Infra` |

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence — file path + resource/module name (ห้ามเดา)
- security findings ที่เป็น app-level (auth, injection) → `/review-security`; cost estimation deep-dive → `/review-cost`
- ใช้ `/use-subagents` ถ้า multi-stack/multi-env
- ใช้ `/review-compliance` ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. secrets: ย้ายไป Secrets Manager/ESO/Vault, rotate credentials ที่ leak แล้ว, ลบออกจาก history
2. state: migrate เป็น remote backend + locking, gitignore `*.tfstate*`, เพิ่ม `prevent_destroy`
3. pinning: lock providers/modules/images, commit lock files
4. k8s: เพิ่ม resources/securityContext/probes, pin image tags, เพิ่ม NetworkPolicy
5. hygiene: เพิ่ม tags standard, extract modules, เขียน README ต่อ stack
6. verify: `plan` สะอาด, ไม่มี diff ที่ไม่ตั้งใจ

## Expected Outcome

- ตาราง findings ต่อ dimension พร้อม severity และ evidence
- รู้ชัดว่า secrets/state/drift/k8s specs ปลอดภัยแค่ไหน
- Next action ชัดเจนผ่าน `/suggest-next-action`
