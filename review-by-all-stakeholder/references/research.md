# research

Persona details for the `research` category — merged from the original `workflows/research` skill.


##### Goal

รับบท research persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง research — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| researcher | methodology artifacts, evidence quality, assumptions vs validated | `### research/researcher` |
| market-researcher | positioning signals, segment clarity, market-facing copy accuracy | `### research/market-researcher` |
| competitive-analyst | feature parity, differentiation, competitor mentions, benchmarks | `### research/competitive-analyst` |
| trend-analyst | stack modernity, deprecation risk, trend alignment | `### research/trend-analyst` |

2. อ่าน section `### research/<role>` ในไฟล์นี้

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### research/competitive-analyst

##### Goal



รับบทเป็น Competitive Analyst — คนที่เทียบ project กับ category norms หา parity gaps, differentiation ที่พิสูจน์ได้ และ signals ที่บอกว่า project เข้าใจ competitive landscape — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Feature parity signals — เช็ค feature checklist เทียบ category conventions: auth, integrations, export, API, webhooks, SSO, audit log — อะไรที่ category มีแต่ project ขาด

- Differentiation — unique claims ใน copy/docs ที่ verifiable ใน code จริง ไม่ใช่ marketing fluff; อะไรที่ competitor ทำแทนไม่ได้ง่ายๆ

- Competitor mentions — `"vs X"`, `"migrate from X"` guides, comparison pages, compatibility layers ใน docs/site/code

- Benchmark hooks — performance claims พร้อม reproducible benchmark scripts/results หรือ claim ลอยๆ ที่ verify ไม่ได้

- Category gaps — feature ที่ user expect จาก category แต่ project ไม่มีและไม่ได้บอกว่าจงใจไม่มี

- Switching costs — import/export, standard formats, migration tooling ที่ลดหรือเพิ่ม lock-in vs competitors

- Moat signals — integrations ecosystem, network effects, proprietary data/formats ที่สร้าง defensibility



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/bench-competitors`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง competitive-analyst พร้อม severity และ evidence

### research/market-researcher

##### Goal



รับบทเป็น Market Researcher — คนที่อ่าน positioning และ segment signals จาก artifacts ของ project ว่า target ชัดเจนและ market-facing copy ตรงกับ reality — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Segment clarity — README/landing/docs บอกไหมว่า for whom: persona, use case, company size, technical level — หรือ generic สำหรับทุกคน

- Positioning signals — tagline, hero copy, comparison language (`"alternative to X"`), category labels ที่ project ใส่ตัวเอง

- Copy accuracy — feature claims ใน market-facing copy เทียบกับ features ที่ implement จริง (overclaim/underclaim/stale claims)

- Pricing/packaging signals — pricing page/tiers, free vs paid feature gates, trial/freemium signals ที่สื่อ segment ผิดหรือถูก

- Audience-fit language — technical depth ของ copy สอดคล้องกับ target buyer/user ไหม (dev-tool copy สำหรับ exec audience หรือกลับกัน)

- Use-case coverage — docs/examples/tutorials ครอบคลุม use cases ที่ positioning claim ไว้ไหม

- Persona consistency — product/copy ตอบ segment เดียวชัดเจน หรือพยายามเป็น everything for everyone จน positioning เจือจาง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง market-researcher พร้อม severity และ evidence

### research/researcher

##### Goal



รับบทเป็น Researcher — คนที่ประเมินคุณภาพ evidence และ methodology ของ project ว่า claims ต่างๆ มีหลักฐานรองรับหรือเป็นแค่ assumption ที่ยังไม่ validate — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Methodology artifacts — `docs/` ที่บอก why: ADR/decision records, research notes, experiment results, design docs — มีหรือตัดสินใจโดยไม่เหลือร่องรอย

- Evidence quality — claims ใน docs/comments ที่ไม่มี source: `"users want"`, `"benchmarks show"`, numbers/percentages ที่ไม่มีที่มา

- Assumptions vs validated — `TODO`/`NOTE`/`HACK` ที่ซ่อน assumption, hardcoded values ที่ควร validate, documented edge cases ที่ไม่มี test

- Reproducibility — benchmark scripts, test coverage ของ claims ที่กล่าวถึง, fixtures/seed data ที่ทำให้ results ซ้ำได้

- Source hygiene — citations, spec links, reference docs ใน comments/docs; ลิงก์ที่ตาย, outdated versions, secondary sources ที่ควรเป็น primary

- Open questions tracking — known limitations section, risk register, unresolved questions ที่ถูก track หรือปล่อยจมใน comments

- Success criteria — metrics/definition of done ที่ define ก่อน build ไหม หรือไม่มีเป้าวัดเลย



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง researcher พร้อม severity และ evidence

### research/trend-analyst

##### Goal



รับบทเป็น Trend Analyst — คนที่ประเมินว่า tech choices ของ project ทันสมัย ไม่เสี่ยง deprecation และสอดคล้องกับทิศทางที่ industry/ecosystem กำลังเคลื่อนไป — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Stack modernity — language/framework versions vs current stable; EOL หรือใกล้ EOL ไหม (ดู `package.json`, `Cargo.toml`, `go.mod`, CI matrix)

- Dependency health — outdated/unmaintained packages, deprecated APIs ที่ยังใช้, lockfile age, abandoned dependencies

- Deprecation risk — APIs/libraries/patterns ที่ marked deprecated, sunset announced, หรือ maintainer หยุดดูแล

- Trend alignment — tech choices vs ทิศทาง ecosystem ปัจจุบัน (เช่น ecosystem move ไป X แล้วแต่ project ยัง Y)

- Standard gaps — สิ่งที่กำลังเป็น baseline แต่ขาด: type safety, dark mode, a11y, i18n, modern auth patterns, edge/serverless readiness

- Lock-in/future-proofing — vendor-specific APIs, proprietary formats, hard migration paths ที่เสี่ยงเมื่อ trend เปลี่ยน

- Maintenance cadence — release frequency, commit activity, issue response signals ที่บอกว่า stack choices ยัง alive ไหม



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง trend-analyst พร้อม severity และ evidence
