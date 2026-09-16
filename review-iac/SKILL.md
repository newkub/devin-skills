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

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence — file path + resource/module name (ห้ามเดา)
- security findings ที่เป็น app-level (auth, injection) → `/review-security`; cost estimation deep-dive → `/review-cost`
- ใช้ `/use-subagents` ถ้า multi-stack/multi-env
- ใช้ `/review-compliance` ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix → `/deep-review-then-fix`

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
