---
name: review-iac-check-k8s
description: Check K8s/Helm manifests — resources, probes, securityContext, network policy
argument-hint: "[manifests-or-scope]"
related:
  - review-iac
  - review-security
  - use-astgrep
  - report
---

## Goal

Run the K8s/Helm dimension of `/review-iac` แบบ focused — manifests production-grade และ secure

## Scope

- ใช้เมื่อ `/review-iac` dispatch มาที่ `k8s`/`helm`/`kubernetes` หรือเรียก standalone
- ครอบคลุม: Deployments, Services, Helm values/templates, probes, resources, security contexts

## Execute

### 1. Manifest Checks

> Goal: workloads survive และไม่ hog — parent Execute §4

1. resources — requests/limits ทุก container; missing limits = noisy neighbor risk
2. probes — liveness/readiness/startup ครบและต่างกันถูก (ไม่ copy liveness→readiness)
3. replicas/strategy — HA workloads >1 replica, PDB บน critical, rolling config
4. image tags — pinned, pull policy ถูก

### 2. Security Context Checks

> Goal: workloads least-privilege

1. `securityContext` — non-root, `readOnlyRootFilesystem`, drop capabilities
2. `NetworkPolicy` — ingress/egress จำกัด ไม่ใช่ open-all
3. RBAC/ServiceAccount — minimal permissions ไม่ใช่ cluster-admin
4. secrets — env from Secret objects ไม่ใช่ plaintext ใน manifest (deep scan → `/check-secrets`)

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Manifest/Kind`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี manifest file + line
- privileged container / missing securityContext บน public-facing = High

## Expected Outcome

- K8s findings แยก resources/probes/security/networking
- Helm template issues flagged แยกจาก rendered manifests
