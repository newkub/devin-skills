---
name: optimize-mcp
description: ลด MCP context overhead — ปิด servers ที่ไม่ใช้, prune tools และ audit config
argument-hint: "[scope-or-server]"
related:
  - list-devin-global-mcp
  - update-devin-global-mcp
---

## Goal

ลด context/cost overhead จาก MCP servers — tools ที่ inject เข้า context ทุกครั้งแม้ไม่ได้ใช้, servers ที่ duplicate หน้าที่กัน และ config ที่หนักเกิน

## Scope

- ตรวจ MCP configs: `.devin/` project config, `~/.config/devin/` global, หรือ tool-specific (`mcp.json`, `claude_desktop_config`)
- ครอบคลุม: servers ที่ติดตั้งแต่ไม่ใช้, tool counts ต่อ server, context tokens ที่ tools กิน, duplicate capabilities ข้าม servers
- Action-oriented: แนะนำ/ปรับ config — เปลี่ยน config ผ่าน `/update-devin-global-mcp`

## Execute

### 1. Inventory MCP Setup

> Goal: map servers และ tools ทั้งหมดที่ load

1. ใช้ `/list-devin-global-mcp` ดู servers ที่ติดตั้ง
2. นับ tools ต่อ server — บาง server expose หลายสิบ tools ที่กิน context
3. ระบุ scope: global vs project-level installs

### 2. Measure Context Cost

> Goal: ประเมิน tokens ที่ MCP tools ใช้

1. ประมาณ schema size ต่อ tool (names + descriptions + input schemas)
2. รวมต่อ server และทั้งหมด — เทียบกับ context budget
3. flag servers ที่กิน context มากแต่ใช้น้อย/ไม่ใช้เลย

### 3. Find Waste

> Goal: หา servers/tools ที่ควรปรับ

1. Unused: servers ที่ไม่เคยถูกเรียกใน recent sessions (ดูจาก session history ถ้ามี)
2. Duplicates: servers ที่ทำหน้าที่ซ้ำ (เช่น github หลายตัว, docs servers ซ้อน)
3. Over-scoped: servers ที่ expose ทุกอย่างทั้งที่ใช้ subset (เช่น filesystem full access)
4. Heavy schemas: tools ที่ description ยาวมากหรือ schema ซับซ้อนเกิน

### 4. Optimize

> Goal: ปรับ MCP footprint ตาม findings

1. Disable/uninstall servers ที่ไม่ใช้ — แนะนำก่อนผ่าน `/ask-me` (config change ต้อง user เห็นด้วย)
2. แก้ scope: filesystem servers → restrict paths, API servers → ใช้ read-only mode ถ้ามี
3. รวม duplicates: เลือก server เดียวต่อ capability
4. Project-scoped: ย้าย servers ที่ใช้เฉพาะ project ไป project config แทน global
5. บันทึก decision: เหตุผลที่ปิด/จำกัดไว้ใน notes

### 5. Verify

> Goal: ยืนยัน context เบาลงและ tools ที่ต้องการยังมี

1. เทียบ tool count + estimated context ก่อน-หลัง
2. ยืนยัน workflows ที่ใช้ MCP ยังทำงาน — tools ที่ใช้จริงต้องไม่หาย
3. `/report-before-after` แสดง context savings

## Rules

### 1. User Confirmed Changes

- ห้าม disable/remove servers เอง — เสนอและรอ confirm เสมอ
- ระบุ capabilities ที่จะหายไปชัดเจนก่อนตัดสินใจ

### 2. Evidence-Based

- "unused" ต้องมี evidence (call history, session review) — ไม่เดา
- context estimates ระบุว่าเป็น estimate

### 3. Reversible

- ทุกการเปลี่ยนต้องย้อนได้ — บันทึก config เดิมก่อนแก้
- Prefer disable over uninstall — re-enable ง่ายกว่า

## Expected Outcome

- MCP context footprint ลดลงพร้อมตัวเลข
- Servers ที่เหลือคือที่ใช้จริงและ scope พอดี
- Config changes ที่ documented และย้อนได้
