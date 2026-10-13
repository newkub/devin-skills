---
name: deep-research
description: ค้นหาข้อมูลลึกจาก multiple sources — packages, repos, docs, benchmarks, security, compatibility — dispatcher เข้า workflows
argument-hint: "[general|dependencies|setup|api-references|improve|report|query]"
related:
  - rethink
  - research-setup-integrations
  - follow-best-practice
  - learn
  - check-reference
  - deep-review
  - follow-improve
  - use-subagents
---

## Goal

ค้นหาข้อมูลลึกจาก multiple sources เพื่อให้ได้คำตอบที่ครบถ้วน ถูกต้อง และ current — dispatcher เข้า focused workflows

## Scope

ใช้สำหรับงานที่ต้องการข้อมูลลึกจากหลายแหล่ง เช่น เปรียบเทียบ libraries, หา best practices, ตรวจสอบ compatibility, benchmarks, security, migration, licensing ไม่ใช่การค้นหาเร็วๆ (ใช้ `/learn-from-web`) และไม่ใช่การอ่าน docs เฉพาะ library (ใช้ `/follow-best-practice`)

## Execute

### 1. Choose Workflow

> Goal: route ไป workflow ที่ตรงกับหัวข้อ

| หัวข้อ | Workflow |
|--------|----------|
| dependencies/libraries/packages (เลือก, เปรียบเทียบ, outdated) | `workflows/dependencies/SKILL.md` — `/deep-research dependencies` |
| setup/config/CI/boilerplate ของ tool/service | `workflows/setup/SKILL.md` — `/deep-research setup` |
| integrations: plugins, extensions, providers, adapters, marketplace | `/research-setup-integrations` (top-level) |
| API references ของ library/tool | `workflows/api-references/SKILL.md` — `/deep-research api-references` |
| research-driven improvement opportunities | `workflows/improve/SKILL.md` — `/deep-research improve` |
| สรุป report จาก findings ที่มีอยู่ | `workflows/report-findings/SKILL.md` — `/deep-research report` |
| หัวข้อทั่วไป / ไม่ตรงข้างบน | `workflows/general/SKILL.md` — full pipeline steps 1-9 |

1. ถ้า argument ตรง workflow → อ่าน `workflows/<name>/SKILL.md` แล้วทำตาม flow ในนั้น
2. ถ้าไม่ระบุ/ไม่ตรง → ทำ `workflows/general/` (full pipeline) — Step สุดท้าย execute `workflows/report-findings` หลัง synthesize

## Rules

### 1. When To Use

- ใช้เมื่อต้องเปรียบเทียบ tools, best practices หลายแหล่ง หรือตัดสินใจสำคัญ
- ไม่ใช้สำหรับอ่าน docs ตัวเดียว (ใช้ `/follow-best-practice`) หรือ low-risk
- ใช้ multiple sources: NPM, GitHub, DeepWiki, Context7, CRW, Windsurf WebSearch, security DB
- ดูรายละเอียดใน `references/research-rules.md`

### 2. Research Best Practices

- Official sources ก่อนเสมอ — docs > repo > registry > community; community เป็น fallback/corroboration เท่านั้น
- Cross-validate ≥ 2-3 sources ก่อนสรุป — claim ที่เห็นแหล่งเดียวระบุเป็น low confidence
- Freshness: ระบุ version + ปี ของทุก claim; เช็ค deprecation/breaking-change notices ก่อนเสนอแนะ
- Cite ทุก finding: source URL + accessed date + confidence (high/medium/low)
- Time-box ตามขนาดงาน (เล็ก ≤ 5 นาที, กลาง ≤ 15 นาที) — ลึกกว่านั้น fan-out ผ่าน profile `source-researcher` ใน `## Subagents` + `/use-subagents`
- แยก facts กับ assumptions/กับ gaps ชัดเจน — gaps เป็น output ที่มีค่า ไม่ใช่ความล้มเหลว
- Note conflicts ระหว่าง sources แทนที่จะเลือกเงียบๆ — แสดงทั้งสองฝั่งพร้อมเหตุผล
- ห้ามเดา API/command/version — ถ้าไม่มี evidence ให้ระบุว่า unverified

### 3. Routing Discipline

- หัวข้อที่มี focused workflow ต้อง route — ห้ามรัน general pipeline ทับ
- Workflow ที่เลือกเป็น canonical — ห้าม duplicate steps นอก workflow

- ใช้ /rethink ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น
- ใช้ /follow-improve ถ้าจำเป็น

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile อยู่ใน section นี้เลย ไม่ต้องมีไฟล์แยก

### source-researcher — ค้นคว้า source/topic เดียวเชิงลึกแล้วคืน findings พร้อม confidence

- **Inputs**: `topic` (หัวข้อที่ต้อง research เช่น `bun test coverage`, `hono middleware`), `source` (source เดียวที่รับผิดชอบ: `official-docs`/`github-repo`/`changelog`/`npm-registry`), `source-url` (optional — URL เฉพาะของ source เช่น repo URL หรือ docs root), `focus-questions` (optional — คำถามเฉพาะที่ต้องตอบจาก source นี้)
- **Tools**: `web_search`, `webfetch` (ค้นหา/อ่าน source), `mcp_call_tool` (DeepWiki, Context7, GitHub MCP ถ้า source เป็น repo/docs), `read`, `grep` (local references/cached docs)
- **Execute**: 1) ยืนยัน source ที่ได้รับและระบุ entry point ที่ authoritative ที่สุด (docs root, `CHANGELOG.md`, releases page) 2) ดึงข้อมูลหลักตาม source type: docs → guides/API reference, repo → README/issues/commits, registry → versions/metadata 3) ตอบ `focus-questions` ถ้ามี — แต่ละคำตอบต้องอ้าง URL ที่ตรวจย้อนได้ 4) ตรวจ freshness: version ล่าสุด, วันที่อัปเดต, breaking changes, maintenance status 5) จัด confidence ต่อ finding: `high` (official/primary), `medium` (secondary), `low` (inferred)
- **Output**: ตาราง findings `| No. | Finding | Source URL | Freshness | Confidence |` ปิดท้ายด้วย source summary (coverage ของ topic, gaps ที่ source นี้ตอบไม่ได้, version/date ล่าสุดที่พบ); ถ้า source เข้าถึงไม่ได้ → คืน `error` พร้อมสาเหตุและ alternative sources ที่แนะนำ
- **Constraints**: research เฉพาะ source เดียวที่ได้รับ — ห้ามข้าม source อื่น (parent แจกงานแล้ว); ทุก finding ต้องมี `source-url` ที่ตรวจย้อนได้ ห้ามตอบจาก memory; ระบุ version/date เสมอ — ข้อมูลเก่าต้อง flag `stale`; ถ้า source ขัดกับข้อมูลอื่น → ระบุ conflict ไม่ตัดสินเอง; คัดเฉพาะ findings ที่ตอบ `topic` จริง — ไม่เกิน ~10 findings ต่อ source; read-only — ห้ามใช้ `edit`/`write` (report only ไม่แก้ code)

## Expected Outcome

- ข้อมูลครบถ้วนจาก multiple sources ที่ cross-referenced
- สรุป findings พร้อม source, version, ปี, confidence — gaps/risks/breaking changes ระบุชัด
- คำตอบที่ credible และ actionable พร้อม report
