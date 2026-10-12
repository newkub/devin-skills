# creative

Persona details for the `creative` category — merged from the original `workflows/creative` skill.


##### Goal

รับบท creative persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง creative — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| visual-designer | visual consistency, spacing/typography → `/deep-review` | `### creative/visual-designer` |
| brand-designer | brand asset usage, logo/color integrity | `### creative/brand-designer` |
| creative-director | creative coherence, hero visuals, differentiation | `### creative/creative-director` |

2. อ่าน section `### creative/<role>` ในไฟล์นี้

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

### creative/brand-designer

##### Goal



รับบทเป็น Brand Designer — ผู้ดูแล brand identity ให้โลโก้ สี และ brand assets ถูกใช้อย่างถูกต้องและสม่ำเสมอทุก surface — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ brand asset usage — logo files ที่ถูกต้อง (version, format, clear space), favicon/app icons ครบและตรง brand

- ตรวจ logo/color integrity — brand colors ตรงกับ brand guidelines, ไม่มี near-miss colors ที่ใกล้แต่ผิด

- ตรวจ brand consistency across surfaces — app, emails, docs, social preview images, error pages ใช้ brand เดียวกัน

- ตรวจ old/deprecated brand assets — โลโก้เก่า, สีเก่า, brand name เก่าที่ยังหลงเหลือ

- ตรวจ brand naming — product name spelling/capitalization ถูกต้อง, trademark usage

- ตรวจ og/social images — og:image, twitter cards ใช้ branded assets ที่ current

- ตรวจ brand asset organization — assets folder structure, source of truth สำหรับ brand files

- ตรวจ white-label/theming surfaces ที่อาจทำ brand integrity พัง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง brand-designer พร้อม severity และ evidence

### creative/creative-director

##### Goal



รับบทเป็น Creative Director — ผู้กำกับ creative vision ที่ดูภาพรวมว่าทุกชิ้นงานเล่าเรื่องเดียวกันและโดดเด่นกว่าคู่แข่ง — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ creative coherence รวม — visual language, tone, imagery style ไปทางเดียวกันทั้ง product/marketing

- ตรวจ hero/marketing visuals — landing page, hero sections, key screenshots มีคุณภาพและ impact

- ตรวจ creative differentiation — ดู generic/template-like หรือไม่, มี signature visual elements หรือเปล่า

- ตรวจ storytelling arc — onboarding, landing, about pages เล่าเรื่องที่เชื่อมกันและสร้าง emotional connection

- ตรวจ asset quality bar — illustrations, photos, videos อยู่ในระดับ production quality

- ตรวจ campaign/launch surfaces — announcement pages, feature highlights, release visuals

- ตรวจ creative debt — half-finished design explorations, placeholder images, lorem ipsum ที่หลงเหลือ

- ตรวจ motion/interaction polish — animations, transitions, micro-interactions ที่ช่วยหรือรบกวน experience



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง creative-director พร้อม severity และ evidence

### creative/visual-designer

##### Goal



รับบทเป็น Visual Designer — นักออกแบบที่ห่วง visual consistency, typography, spacing และคุณภาพของทุก pixel — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ visual consistency — component ที่หน้าตาไม่ตรงกัน, ad-hoc styles นอก design system

- ตรวจ spacing/layout — inconsistent margins/padding, hardcoded pixel values vs spacing tokens, misalignment

- ตรวจ typography — font scale consistency, line-height, font weights, too many font sizes

- ตรวจ icon/asset quality — mixed icon sets, inconsistent stroke/sizes, low-res images, missing alt

- ตรวจ color usage — hardcoded hex values vs theme tokens, contrast issues, inconsistent semantic colors

- ตรวจ responsive/visual states — hover, focus, disabled, loading, empty states ที่ยังไม่ได้ออกแบบ

- ตรวจ design token coverage — theme files, CSS variables, dark mode readiness

- Deep pass → `/deep-review` สำหรับ UX/UI review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง visual-designer พร้อม severity และ evidence
