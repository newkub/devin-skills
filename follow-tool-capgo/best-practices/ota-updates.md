# Capgo OTA Best Practices

แนวทางใช้ `@capgo/capacitor-updater` สำหรับ OTA updates ของ Capacitor apps — update flow, channels, rollback และ CI upload

## Recommended Patterns

### Update Flow

- เรียก `CapacitorUpdater.notifyAppReady()` หลัง app boot สำเร็จเสมอ — ถ้าไม่เรียกภายใน timeout plugin จะ rollback bundle อัตโนมัติ (นี่คือ safety mechanism ไม่ใช่ optional)
- เรียก `notifyAppReady()` หลังจาก critical render เสร็จ ไม่ใช่ตอน process start — ถ้าเรียกเร็วเกิน bundle ที่ render พังจะถือว่า "ready" ผิดพลาด
- เลือก mode ให้ตรง use case:
  - `autoUpdate: true` — เหมาะกับ content apps ที่ต้องการ update เร็ว
  - Manual `download()` → `set()` → `reload()` — เหมาะกับ app ที่ต้องเช็คเงื่อนไขเอง (เช่น รอ user idle)
- Listen `updateAvailable`/`downloadComplete` events เพื่อ telemetry — รู้ว่า update ถึง device จริงหรือไม่
- ทำ staged rollout ผ่าน channels: `internal` → `staging` → `production` — อย่า push production ตรงจาก local build

### Channel Strategy

- อย่างน้อย 2 channels: `production` (public) และ `staging` (QA/internal testers)
- Assign channel ด้วย `capgo channel set --channel <name> --latest` หลัง upload — ทำขั้นนี้เป็น step แยกจาก upload เพื่อ review bundle ก่อน promote
- ใช้ versioned channels (`v2-hotfix`) เมื่อต้อง pin bundle ให้ app version เฉพาะ

### Rollback Readiness

- ทดสอบ rollback path จริง: upload bundle ที่พัง (เช่น throw ตอน boot) ไป staging → verify app revert กลับ bundle ก่อนหน้าเอง
- เก็บ previous bundle บน device — updater ทำให้อัตโนมัติ แต่อย่าลบ cache มือ
- ถ้า bundle ใหม่พังหลัง `notifyAppReady` แล้ว (crash ช้า) — ใช้ `CapacitorUpdater.reset()` หรือ channel revert จาก Capgo dashboard/CLI
- Monitor crash-free rate หลัง deploy — rollback mechanism จับ boot failure ได้แต่จับ runtime crash ช้าไม่ได้

### Signing And Security

- เปิด signed updates (`capgo key save` + config) สำหรับ production — device verify signature ก่อน apply bundle ป้องกัน MITM/tampered bundles
- `CAPGO_TOKEN` เป็น CI secret เท่านั้น — ห้าม embed ใน app code หรือ commit
- App-side config (`capacitor.config` updater section) เก็บ appId/channel ได้ แต่ห้ามเก็บ private keys

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| ลืม `notifyAppReady()` | app rollback ทุกครั้งหลัง update | เรียกหลัง boot สำเร็จ + integration test path นี้ |
| OTA ทับ native change | plugin ใหม่หา native code ไม่เจอ crash | OTA เฉพาะ web assets — native deps เปลี่ยนต้อง store release |
| nativeVersion mismatch | bundle ไม่ apply | ตั้ง compatibility ให้ bundle ผูกกับ native version ที่รองรับ |
| Update กลาง session | user เสีย state | manual flow + update ตอน app restart/idle |
| First launch ช้า | download ทั้ง bundle ตอนเปิด app แรก | delay update check หลัง critical path หรือ background download |
| `cap sync` ลืมหลัง add plugin | native side ไม่มี updater | `cap sync` ทุกครั้งหลังเปลี่ยน plugin/version |
| Token ใน repo | CI secret leak | `CAPGO_TOKEN` ผ่าน secrets manager เท่านั้น |

## Do / Don't

| Do | Don't |
|---|---|
| test broken-bundle rollback ใน staging | assume auto-rollback ทำงานโดยไม่เคยทดสอบ |
| separate `staging`/`production` channels | push ตรง production จาก dev machine |
| signed bundles สำหรับ production | skip signing เพราะ "แค่ web assets" |
| telemetry บน update events | push update แล้วไม่รู้ว่า reach devices ไหม |
| bump store release เมื่อ native deps เปลี่ยน | force OTA ทับ app ที่ native ไม่รองรับ |
| document channel map ใน repo | ให้ deployer จำชื่อ channel เอง |

## Performance And CI Notes

- Bundle ที่ upload คือ web build output (`dist/` หรือ `www/`) — minify + tree-shake ก่อน upload; bundle เล็ก = update เร็วบนเครือข่ายช้า
- CI pipeline: `build web` → `capgo bundle upload --channel staging` → promote `--latest` หลัง QA pass
- แยก upload job จาก promote job — promote ควรเป็น manual/approved step สำหรับ production
- Updater เช็ค update ตอน app resume/start — ไม่ต้อง polling เอง; ถ้าต้องการ control ใช้ manual flow
- `bunx capgo app add` ทำครั้งเดียวต่อ app — เก็บ appId ใน config file ที่ commit ได้ (ไม่ใช่ secret)
- ถ้า self-hosting backend ให้ระบุ `autoUpdateURL` ใน config — default ชี้ Capgo cloud

## Config Guidance

`capacitor.config.ts` (ตัวอย่าง concept — ตรวจ key names กับ plugin version ที่ใช้):

```ts
plugins: {
  CapacitorUpdater: {
    autoUpdate: false,        // manual flow ถ้าต้อง control
    // appId, channel, statsUrl ฯลฯ
  }
}
```

- เก็บ updater config ใน version control — behavior ของ update flow คือ product decision
- Document rollout checklist: staging verify → rollback test → production promote → monitor
