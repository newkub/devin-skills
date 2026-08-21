---
name: follow-root-cause-analysis
description: วิเคราะห์หาสาเหตุหลักของปัญหาด้วยวิธีการเป็นระบบ
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

วิเคราะห์หาสาเหตุหลักของปัญหาด้วยวิธีการเป็นระบบเพื่อป้องกันปัญหาซ้ำ

## Execute

### 1. Gather Evidence

รวบรวมข้อมูลและ evidence ทั้งหมดที่เกี่ยวข้องกับปัญหา

1. ทำ `/debug-issue` เพื่อเก็บข้อมูลเบื้องต้น
2. เก็บ logs, metrics, traces ที่เกี่ยวข้อง
3. เก็บ screenshots, error messages, stack traces
4. เก็บ timeline ของเหตุการณ์
5. เก็บ environment information (version, config, dependencies)

### 2. Construct Causal Graph (Graph Theory)

สร้าง Directed Acyclic Graph (DAG) ของ causal relationships:

สูตร: G = (V, E) โดย V = nodes (events/variables), E = directed edges (causal links)

ขั้นตอน:
1. ระบุ nodes V = {v₁, v₂, ..., vₙ} ทั้งหมดที่เกี่ยวข้อง (deploy, config, traffic, error)
2. สร้าง directed edges E = {(vᵢ → vⱼ)} สำหรับ causal relationships
3. ตรวจสอบว่า graph เป็น DAG (ไม่มี cycles)
4. ใช้ Topological Sort เพื่อจัดลำดับ causal chain
5. ระบุ root nodes (nodes ที่ไม่มี incoming edges) เป็น potential root causes

### 3. Use 5 Whys (Causal Inference)

ใช้เทคนิค 5 Whys ร่วมกับ Causal Inference:

สูตร: P(Y | do(X)) = causal effect ของ X บน Y

ขั้นตอน:
1. เริ่มจากปัญหาที่เห็น (effect node)
2. ถาม "ทำไม" 5 ครั้ง โดย trace ย้อนกลับใน causal graph
3. แต่ละคำตอบต้องเป็น parent node ใน DAG
4. ใช้ do-calculus เพื่อตรวจสอบว่า intervention แก้ปัญหาได้จริง
5. หยุดเมื่อถึง root node ที่สามารถ intervene ได้

ตัวอย่าง:
- ปัญหา: Server crash
- ทำไม 1: Out of memory
- ทำไม 2: Memory leak
- ทำไม 3: Unclosed database connections
- ทำไม 4: Missing connection pool cleanup
- ทำไม 5: No proper shutdown handler in deployment script
- Root Cause: Deployment script ไม่มี shutdown handler

### 4. Analyze Causal Paths (Graph Theory)

วิเคราะห์ causal paths ใน DAG:

สูตร: Path(vᵢ → vⱼ) = sequence of edges จาก vᵢ ไป vⱼ

ขั้นตอน:
1. ระบุทุก causal paths จาก root nodes ไปยัง effect node
2. คำนวณ path length (จำนวน edges) และ path strength
3. ใช้ Betweenness Centrality เพื่อหา nodes ที่สำคัญที่สุด
4. ระบุ bottleneck nodes (nodes ที่อยู่ในหลาย paths)
5. เลือก root node ที่มี causal paths สั้นและ strong ที่สุด

### 5. Validate Causal Hypothesis (Causal Inference)

ตรวจสอบ causal hypothesis ด้วย intervention:

สูตร: P(Y | do(X)) ≠ P(Y | X) แสดงว่า X เป็น causal cause

ขั้นตอน:
1. ทำ `/use-bun-shell` เพื่อทดสอบ intervention do(X)
2. สร้าง test case ที่ reproduce ปัญหา
3. เปรียบเทียบ P(Y | do(X)) กับ P(Y | X)
4. ถ้า P(Y | do(X)) ≠ P(Y | X) → X เป็น causal cause
5. ตรวจสอบว่าไม่มี confounding variables ที่ซ่อนอยู่

### 6. Document Root Cause

บันทึก root cause และการวิเคราะห์อย่างละเอียด

1. เขียนรายงาน RCA (Root Cause Analysis)
2. ระบุ root cause อย่างชัดเจน
3. อธิบายวิธีการวิเคราะห์
4. แนบ evidence ทั้งหมด
5. ระบุ action items สำหรับ prevention

### 7. Define Preventive Actions

กำหนด action สำหรับป้องกันปัญหาซ้ำ

1. ทำ `/resolve-errors` เพื่อแก้ปัญหาปัจจุบัน
2. เพิ่ม monitoring/alerting สำหรับ detect ปัญหาล่วงหน้า
3. เพิ่ม test cases สำหรับป้องกัน regression
4. อัพเดท documentation และ runbooks
5. ทำ training หรือ knowledge sharing กับทีม

## Rules

### 1. Evidence-Based

ต้องมี evidence สนับสนุนทุกข้อสรุป

- เก็บ logs, metrics, traces ทั้งหมด
- ใช้ data ในการตัดสินใจ ไม่ใช้ความรู้สึก
- บันทึก source ของทุก evidence

### 2. 5 Whys Technique

ใช้เทคนิค 5 Whys อย่างถูกต้อง

- แต่ละคำตอบต้องเป็นสาเหตุ ไม่ใช่ symptom
- หยุดเมื่อถึงจุดที่สามารถแก้ไขได้
- อย่าหยุดที่ human error (มักเป็น symptom ของ process ที่ไม่ดี)

### 3. Causal Graph Theory

ใช้ Graph Theory สำหรับ causal analysis:

- สร้าง DAG (Directed Acyclic Graph) สำหรับ causal relationships
- ใช้ Topological Sort เพื่อจัดลำดับ causal chain
- ใช้ Betweenness Centrality เพื่อหา nodes สำคัญ
- วิเคราะห์ causal paths จาก root ไป effect
- ตรวจสอบว่าไม่มี cycles (confounding loops)

### 4. Causal Inference Standards

ต้อง validate causal hypothesis ด้วย intervention:

- ใช้ do-calculus เพื่อตรวจสอบ causal effect
- เปรียบเทียบ P(Y | do(X)) กับ P(Y | X)
- ตรวจสอบว่าไม่มี confounding variables
- ตรวจสอบว่า intervention แก้ปัญหาได้จริง

### 5. Documentation Requirements

บันทึก RCA อย่างละเอียด

- ระบุ root cause อย่างชัดเจน
- อธิบายวิธีการวิเคราะห์
- แนบ evidence ทั้งหมด
- ระบุ action items สำหรับ prevention

## Expected Outcome

- Root cause ถูกระบุอย่างชัดเจน
- มี evidence สนับสนุนทุกข้อสรุป
- มี preventive actions ที่ชัดเจน
- มี documentation ที่สมบูรณ์
- ปัญหาไม่เกิดซ้ำ
