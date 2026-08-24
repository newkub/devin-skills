---
name: follow-signoz
description: ติดตั้งและตั้งค่า SigNoz สำหรับ Node/Bun/TypeScript ด้วย OpenTelemetry
---

## Goal

ติดตั้ง กำหนดค่า และเชื่อมต่อแอป Bun/Node/TypeScript กับ SigNoz ผ่าน OpenTelemetry เพื่อให้ได้ traces, metrics และ logs

## Scope

- รองรับทั้ง SigNoz Cloud และ self-hosted บน Docker
- ใช้ OpenTelemetry auto-instrumentation สำหรับ Node.js และ Bun
- ครอบคลุมการส่ง traces, logs, metrics และตั้งค่า alerts เบื้องต้น
- ไม่รวมการปรับแต่ง infrastructure นอก scope ของแอป เช่น Kubernetes operator

## Execute

### 1. Assess Project And Prepare SigNoz

ประเมินโปรเจกต์และเตรียม backend ก่อนลงมือตั้งค่า
> Goal: ระบุ runtime, endpoint และ ingestion key ที่ถูกต้อง

1. อ่าน `package.json` เพื่อตรวจสอบ runtime ว่าเป็น `bun`, `node` หรือ TypeScript
2. ถามผู้ใช้ว่าต้องการ `SigNoz Cloud` หรือ `self-hosted`
3. ถ้าเป็น `self-hosted` ให้ใช้ `webfetch` อ่าน `https://signoz.io/docs/install/docker/`
4. ติดตั้ง SigNoz self-hosted ด้วย Foundry:
   - รัน `curl -fsSL https://signoz.io/foundry.sh | bash`
   - สร้าง `casting.yaml` ด้วย `flavor: compose` และ `mode: docker`
   - รัน `foundryctl cast -f casting.yaml`
5. บันทึก endpoint ที่จะใช้ เช่น `http://localhost:4318` สำหรับ self-hosted หรือ `https://ingest.<region>.signoz.cloud:443` สำหรับ cloud
6. สำหรับ SigNoz Cloud ให้ขอ ingestion key จากผู้ใช้

### 2. Instrument The Application

ติดตั้ง OpenTelemetry instrumentation ในโปรเจกต์
> Goal: ทำให้แอปส่ง telemetry ไปยัง SigNoz โดยอัตโนมัติ

1. ติดตั้ง package ที่จำเป็น:
   - `npm install --save @opentelemetry/api @opentelemetry/auto-instrumentations-node`
   - สำหรับ Bun ใช้ `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
2. ตั้งค่า environment variables ใน `.env` หรือ shell:
   - `OTEL_TRACES_EXPORTER=otlp`
   - `OTEL_EXPORTER_OTLP_ENDPOINT=<your-endpoint>`
   - `OTEL_SERVICE_NAME=<service-name>`
   - `OTEL_RESOURCE_ATTRIBUTES=service.version=<version>`
   - `OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<key>` สำหรับ cloud
   - `NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register`
3. สำหรับ Bun ให้ทดสอบ `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` และปรับตามผล
4. เรียกใช้ `bun run src/index.ts` หรือ `node app.js` เพื่อเริ่มต้น instrumentation
5. ถ้า TypeScript entry ไม่ทำงาน ให้เพิ่ม `import '@opentelemetry/auto-instrumentations-node/register'` หรือ `require(...)` ด้วยเงื่อนไขที่เหมาะสม

### 3. Send Logs, Metrics, And Traces

ส่ง telemetry ให้ครบทั้งสามประเภท
> Goal: ให้ traces, logs, metrics แสดงใน SigNoz UI

1. ใช้ `webfetch` อ่าน `https://signoz.io/docs/instrumentation/opentelemetry-nodejs/` เพื่อยืนยัน environment variables ล่าสุด
2. ตั้งค่า `OTEL_METRICS_EXPORTER=otlp` เพื่อส่ง metrics
3. ส่ง logs ผ่าน OTLP logs exporter หรือใช้ OpenTelemetry Collector ตามสถาปัตยกรรมของแอป
4. ตรวจสอบว่า console ไม่มี error เกี่ยวกับ exporter และพอร์ตถูกต้อง
5. ถ้าไม่มี telemetry ไหลเข้า ให้เปิด `OTEL_LOG_LEVEL=debug` เพื่อตรวจสอบ

### 4. Verify Data In SigNoz

ตรวจสอบว่า telemetry เข้า SigNoz แล้ว
> Goal: ยืนยันการส่งข้อมูลสำเร็จ

1. เปิด UI ที่ `http://localhost:8080` หรือ URL ของ SigNoz Cloud
2. ตรวจสอบ service name ในหน้า Services และ Traces
3. ดู logs ในหน้า Logs Explorer
4. ดู metrics ในหน้า Metrics Explorer หรือ Dashboards
5. ถ้าข้อมูลไม่ปรากฏภายใน 5 นาที ให้ตรวจสอบ ingestion key, endpoint, และ firewall

### 5. Configure Dashboards And Alerts

สร้าง dashboard และ alert พื้นฐาน
> Goal: ให้สามารถ monitor และแจ้งเตือนได้

1. ใช้ `webfetch` อ่าน `https://signoz.io/docs/userguide/alerts-management/`
2. สร้าง dashboard ที่มี panels สำหรับ request rate, latency, error rate
3. สร้าง alert rule อย่างน้อยหนึ่งรายการ เช่น `p95 latency > 500ms` หรือ `error rate > 5%`
4. ตั้งค่า notification channel ตามที่ SigNoz รองรับ
5. บันทึก configuration ที่ใช้เป็น reference สำหรับทีม

## Rules

### 1. General Safety

- ไม่ฝัง ingestion key หรือ secrets ลงใน code
- เก็บค่า endpoint และ key ใน `.env` หรือ secret manager
- ถามผู้ใช้ก่อนเปลี่ยนแปลง production หรือ deploy

### 2. Documentation And Verification

- ใช้ `webfetch` หรือ `learn-from-web` เพื่ออ้างอิงเอกสารล่าสุดของ SigNoz
- ตรวจสอบทุกขั้นตอนด้วย logs หรือ UI ก่อนขั้นต่อไป
- ใช้ backticks สำหรับ `commands`, `paths`, `skills`, และ `environment variables`

### 3. Scope And Exit

- ถ้าโปรเจกต์ไม่ใช่ Bun/Node/TypeScript ให้หยุดและแจ้งผู้ใช้
- ถ้าไม่สามารถติดตั้งหรือส่ง telemetry ได้หลังจากลอง 3 ครั้ง ให้หยุดและรายงาน

## Expected Outcome

- แอป Bun/Node/TypeScript ส่ง traces, metrics, logs ไปยัง SigNoz สำเร็จ
- สามารถดูข้อมูลใน SigNoz UI ได้
- มี dashboard และ alert อย่างน้อยหนึ่งรายการ
- บันทึก configuration ที่ใช้ไว้ชัดเจนโดยไม่มี secrets รั่วไหล
