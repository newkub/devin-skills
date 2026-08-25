# Backward Compatibility Checks

## Goal

ตรวจ backward compatibility ก่อน migration

## Checks

### Breaking Changes Detection

1. ตรวช breaking changes ใน dependency version ใหม่จาก changelogs
2. ตรวช breaking changes ใน framework version ใหม่จาก migration guides
3. ตรวช API changes ที่อาจทำลาย existing consumers
4. ตรวช config format changes ที่ต้อง migrate

### Compatibility Strategy

1. ตรวช backward compatibility strategy: expand-contract, versioned API
2. ตรวช deprecated APIs มี migration path
3. ตรวช fallback mechanisms สำหรับ old format
4. ตรวช compatibility layer หรือ adapter มี (ถ้าจำเป็น)

### Consumer Impact

1. ตรวช consumers ของ API ที่เปลี่ยน
2. ตรวช downstream effects ของ breaking changes
3. ตรวช integration points ที่อาจได้รับผลกระทบ
4. ตรวช shared modules ที่ใช้ร่วมกัน

### Version Compatibility

1. ตรวช peer dependencies ยัง compatible
2. ตรวช runtime version ยัง compatible (Node.js, Bun, Rust edition)
3. ตรวช platform compatibility (OS, architecture)
4. ตรวช version range ที่รองรับ

## Severity

- Critical: breaking change ไม่มี migration path, API break ไม่ระบุ, consumer impact ไม่ตรวจ
- High: compatibility strategy ขาด, deprecated API ไม่มี fallback, peer deps ไม่ compatible
- Medium: compatibility layer ขาด, version range ไม่ชัด, downstream effects ไม่ตรวจ
- Low: deprecation notes ขาด, compatibility documentation ไม่ครบ
