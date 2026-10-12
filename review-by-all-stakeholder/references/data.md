# data

Persona details for the `data` category — merged from the original `workflows/data` skill.


##### Goal

รับบท data persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง data — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| data-analyst | metrics/dashboards, event tracking, reporting models, export | `### data/data-analyst` |
| data-scientist | data quality, features, notebooks, reproducibility | `### data/data-scientist` |
| ml-engineer | model serving, versioning, monitoring, pipelines → `/deep-review` | `### data/ml-engineer` |
| ai-engineer | prompts, evals, guardrails, token cost → `/deep-review` | `### data/ai-engineer` |

2. อ่าน section `### data/<role>` ในไฟล์นี้

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

### data/ai-engineer

##### Goal



รับบทเป็น AI Engineer — engineer ที่สร้าง LLM-powered features สนใจ prompt quality, eval coverage, safety และ cost per request — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Prompts — system/user prompt ใน code, prompt versioning, hardcoded vs templated prompts

- Evals — eval harness, test sets, regression check เมื่อเปลี่ยน prompt/model

- Guardrails — input/output validation, PII handling, jailbreak/injection defenses

- Token cost — context size, model choice per task, caching, truncation strategy

- Model config — temperature, max tokens, provider abstraction, per-feature config

- Fallbacks — retries, degraded mode, hallucination handling, human-in-the-loop

- Observability — LLM call logging, latency/cost tracking, trace per request

- Deep pass → delegate `/deep-review` สำหรับ full AI/LLM review



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review` เป็นหลัก



##### Expected Outcome



- findings จากมุมมอง ai-engineer พร้อม severity และ evidence

### data/data-analyst

##### Goal



รับบทเป็น Data Analyst — analyst ที่ต้องตอบ business question จากข้อมูล ต้องการ tracking ครบ metric นิยามชัด และดึงข้อมูลออกได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Metrics/dashboards — KPI definitions, dashboard/reporting views, metric source of truth

- Event tracking coverage — analytics events, naming consistency, funnel gaps, untracked key actions

- Data models for reporting — schema design, reporting/denormalized tables, queryable structure

- Exportability — CSV export, data API, BI connector surface, warehouse sync

- Metric definitions — นิยาม metric ใน code/docs, conflicting definitions, single source of truth

- Data quality — validation, constraints, freshness checks, null/duplicate handling

- Self-serve surface — query/report builder, scheduled reports, alerting on metrics

- Data access — permissions, PII masking สำหรับ analyst access



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง data-analyst พร้อม severity และ evidence

### data/data-scientist

##### Goal



รับบทเป็น Data Scientist — scientist ที่สร้าง insight/model จากข้อมูล สนใจ data quality, feature surface และ reproducibility — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Data quality — missing-value handling, validation rules, schema enforcement, anomaly detection

- Feature engineering surface — feature pipeline, feature store, reusable transformations

- Experiment artifacts — notebooks, analysis scripts, ad-hoc queries ใน repo และ organization

- Reproducibility — random seeds, pinned dependencies, data versioning, environment capture

- Statistical rigor — test methodology, significance/confidence handling, multiple-comparison risk

- Labeling/ground truth — label sources, label quality checks, leakage risk

- Training-serving consistency — offline/online feature parity, skew risk

- Data access patterns — how scientist ดึงข้อมูล, sampling, privacy constraints



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง data-scientist พร้อม severity และ evidence

### data/ml-engineer

##### Goal



รับบทเป็น ML Engineer — engineer ที่รับผิดชอบ model ตั้งแต่ training ถึง production serving สนใจ reliability และ lifecycle ของ model — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Model serving — inference endpoints, latency budget, batching, scaling strategy

- Training/inference split — pipeline separation, feature parity offline vs online

- Model versioning — model registry, artifact storage, deploy/rollback path

- Model monitoring — drift detection, prediction logging, performance metrics, alerting

- Data pipelines — training ETL, feature freshness, pipeline failure handling

- Resource/cost — GPU/CPU usage, inference cost per request, caching

- Retraining — retraining triggers, data refresh cadence, eval gate ก่อน promote

- LLM-specific parts (prompts, evals, guardrails) → delegate `/deep-review` เป็น deep pass



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — LLM parts ไป `/deep-review`



##### Expected Outcome



- findings จากมุมมอง ml-engineer พร้อม severity และ evidence
