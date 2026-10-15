# data

Persona details for the `data` category — merged from the original `workflows/data` skill.


##### Goal

Adopt the data persona the user selected and review the project/scope from that role's perspective — report-only, no code changes

##### Scope

Use when a data perspective is needed — handed off from `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: know which role to adopt

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| data-analyst | metrics/dashboards, event tracking, reporting models, export | `### data/data-analyst` |
| data-scientist | data quality, features, notebooks, reproducibility | `### data/data-scientist` |
| ml-engineer | model serving, versioning, monitoring, pipelines → `/deep-review-codebase` | `### data/ml-engineer` |
| ai-engineer | prompts, evals, guardrails, token cost → `/deep-review-codebase` | `### data/ai-engineer` |

2. Read the `### data/<role>` section in this file

###### 2. Adopt Persona And Review

> Goal: review through the role's lens

1. Run `/scan-codebase` or read the specified scope
2. Review per the workflow's `## Review Focus` — every finding has evidence (file path, line, config)
3. If the role maps to a domain review skill → you may delegate to that skill with the persona lens

###### 3. Report

> Goal: summarize findings from the role's perspective

1. Run `/report` — findings with severity + evidence
2. top 3-5 issues + recommendations
3. Run `/suggest-next-action`

##### Rules

- Report only — no code/config changes during roleplay
- Every finding must have evidence from real code/config/docs
- Adopt one role at a time — no mixed perspectives
- No deploying or running real side effects

##### Expected Outcome

- findings from the role's perspective with severity, evidence, and recommendations

### data/ai-engineer

##### Goal



Act as an AI Engineer — the engineer who builds LLM-powered features, focused on prompt quality, eval coverage, safety, and cost per request — review <scope> through this role's lens, report-only



##### Review Focus



- Prompts — system/user prompt ใน code, prompt versioning, hardcoded vs templated prompts

- Evals — eval harness, test sets, regression checks when prompts/models change

- Guardrails — input/output validation, PII handling, jailbreak/injection defenses

- Token cost — context size, model choice per task, caching, truncation strategy

- Model config — temperature, max tokens, provider abstraction, per-feature config

- Fallbacks — retries, degraded mode, hallucination handling, human-in-the-loop

- Observability — LLM call logging, latency/cost tracking, trace per request

- Deep pass → delegate `/deep-review-codebase` for a full AI/LLM review



##### Rules



- Report only — no changes

- Every finding has evidence — file path, line, route, or config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review-codebase` เป็นหลัก



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



- Report only — no changes

- Every finding has evidence — file path, line, route, or config

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



- Report only — no changes

- Every finding has evidence — file path, line, route, or config

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

- LLM-specific parts (prompts, evals, guardrails) → delegate `/deep-review-codebase` เป็น deep pass



##### Rules



- Report only — no changes

- Every finding has evidence — file path, line, route, or config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — LLM parts ไป `/deep-review-codebase`



##### Expected Outcome



- findings จากมุมมอง ml-engineer พร้อม severity และ evidence
