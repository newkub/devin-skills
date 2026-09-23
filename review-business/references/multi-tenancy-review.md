---
name: multi-tenancy-review
description: ครอบคลุมทุก multi-tenancy dimension
---

# Multi-Tenancy Review

Review multi-tenancy isolation ครอบคลุม data partitioning, tenant context, cross-tenant leak prevention

## Goal

ครอบคลุมทุก multi-tenancy dimension

## Checks

1. ตรวจสอบ tenant context propagation ผ่านทุก layer: API → service → database
2. ตรวจสอบ data isolation: tenant_id filtering ในทุก query, missing tenant scope, cross-tenant data access
3. ตรวจสอบ tenant-specific configuration: per-tenant settings, feature flags, rate limits
4. ตรวจสอบ resource isolation: per-tenant quotas, storage limits, compute limits
5. ตรวจสอบ tenant onboarding/offboarding: provisioning, data migration, data deletion
6. Critical: cross-tenant data access, missing tenant_id filter, tenant context leak
7. High: inconsistent tenant propagation, missing tenant isolation ใน shared resources

