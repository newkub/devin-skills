# deploy-* Template

deploy application หรือ service ไปยัง target platform จน live และ verify ได้ — ครอบคลุม build, config, secrets, post-deploy checks

## Execute Pattern

- ตรวจ readiness ก่อน deploy — build ผ่าน, tests เขียว, config/env/secrets ครบ (ทำ `/follow-secret-manager`). ระบุ target platform ชัดเจน. ถ้ามี `deploy-to-<platform>` skill เฉพาะ → ใช้ตัวนั้นแทน generic flow
- deploy ตาม official docs/CLI ของ platform — ใช้ staging/preview ก่อน production ถ้า platform รองรับ. เก็บ deployment URL และ version/revision id เสมอ. destructive settings (delete, rollback, prod secrets) ต้อง confirm ก่อน
- post-deploy verify — smoke test endpoint/page จริง, เช็ค logs และ health ถ้า fail → rollback หรือ `/resolve-errors` max 3 รอบ แล้ว stop report. สำเร็จ → report URL + version แล้ว `/suggest-next-action`
