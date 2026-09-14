# Dimension Map

(merged from: review-improvement)

ใช้เมื่อต้องสแกน scope แบบกว้างหา "improve อะไรได้บ้าง" — ตรวจแต่ละ dimension แบบเบา (ไม่ใช่ deep review เต็มรูปแบบ) แล้ว map ไปยัง section `## Fix` ของ `review-*` ที่ตรง domain

| No. | Dimension | ดูอะไร | Fix Skill |
|-----|-----------|--------|-----------|
| 1 | Architecture | boundaries, coupling, SRP, layer violations | `/review-architecture` |
| 2 | Security | secrets, auth, injection, headers, deps vulns | `/review-security` |
| 3 | Performance | bundle, rendering, queries, memory, network | `/review-performance` |
| 4 | Quality | naming, duplication, complexity, dead code | `/deep-review-then-fix` |
| 5 | Dependencies | outdated, vulnerable, unused, licenses | `/review-dependencies` |
| 6 | Accessibility | WCAG violations, keyboard, contrast | `/review-accessibility` |
| 7 | Docs | stale docs, missing guides, broken links | `/review-docs` |
| 8 | Tests | coverage gaps, missing edge cases | `/review-test` |
| 9 | Observability | missing logs, metrics, alerts | `/review-observability` |
| 10 | Stability | error handling, retries, degradation | `/review-stability` |
| 11 | API | validation, errors, versioning, contract drift | `/review-api` |
| 12 | Auth | sessions, tokens, OAuth, authz matrix | `/review-auth` |
| 13 | Database | queries, indexes, N+1, migrations, PII | `/review-database` |
| 14 | SEO | meta, OG, structured data, sitemap | `/review-seo` |
| 15 | Config | env drift, defaults, secrets in config | `/review-config` |
| 16 | Delivery | CI/CD speed, caching, Docker, releases | `/review-delivery` |
| 17 | Cost | idle resources, over-provisioning, egress | `/review-cost` |
| 18 | Frontend | components, state, rendering, resilience | `/review-frontend` |
| 19 | Backend | services, jobs, idempotent consumers | `/review-backend` |
| 20 | UXUI | design system, interaction, handoff | `/review-uxui` |
| 21 | CLI | commands, help, exit codes, output | `/review-cli` |
| 22 | i18n | catalogs, hardcoded strings, RTL, formats | `/review-i18n` |
| 23 | Mobile | touch, safe areas, lifecycle, offline | `/review-mobile` |
| 24 | AI | prompts, token cost, guardrails, evals | `/review-ai` |
| 25 | MCP | tool schemas, safety, server config | `/review-mcp` |
| 26 | Events | event schemas, idempotency, DLQ | `/review-events` |
| 27 | Migration | unsafe ops, rollback, ordering | `/review-migration` |
| 28 | Compliance | GDPR/PDPA, consent, retention | `/review-compliance` |
| 29 | Business | payments, tenancy, flags, realtime | `/review-business` |
| 30 | DataValidation | schemas, boundary validation | `/review-data-validation` |
| 31 | Algorithm | complexity, data structures, hot paths | `/review-algorithm` |
| 32 | Assets | images, fonts, media, caching | `/review-bundle` |
| 33 | Bundle | code splitting, tree shaking, size | `/review-bundle` |
| 34 | Workspace | monorepo graph, circular deps | `/review-workspace` |
| 35 | Writing | naming, readability, discoverability | `/review-writing` |

## Rules

- สแกนกว้างไม่ลงลึก — ถ้าต้องการ depth ให้ใช้ `review-*` เฉพาะด้านหรือ `/deep-review`
- ทุก finding ต้องมี evidence ไม่เดา
- แสดงเฉพาะ findings ที่มี fix path ชัดเจน — ถ้าไม่มี skill ตรงให้ระบุ "no skill" พร้อมแนวทาง
- ไม่แก้ไข code ระหว่าง scan — ส่งต่อ section `## Fix` ของ `review-*` เท่านั้น
- ไม่สร้าง findings จาก style preference ที่ไม่มีผลจริง
