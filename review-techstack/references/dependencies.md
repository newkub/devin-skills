# Dependency Health Checks

Reference สำหรับ dependency review checks

## Versions And Freshness

1. ตรวจสอบ version ปัจจุบันเทียบกับ latest stable ด้วย `/update-dependencies-latest` (dry run)
2. ตรวจสอบ runtime versions ด้วย `/update-version-latest` (dry run)
3. ถ้าต้องการ update ทุก version รวมกัน ให้ใช้ `/update-version-latest` (dry run)
4. ระบุ dependencies ที่ outdated: major, minor, patch
5. ตรวจสอบ floating ranges (`latest`, `*`, unbounded `>=`) ที่ auto-resolve เป็น brand-new releases
6. ตรวจสอบ peer dependencies และ compatibility
7. ตรวจสอบ lockfile consistency กับ manifest

## Security

1. รัน `bun audit` หรือ `npm audit` หรือ `cargo audit` ตาม package manager
2. ทำ `/run-audit` สำหรับ security scan
3. ระบุ vulnerabilities ตาม severity: Critical, High, Medium, Low
4. ตรวจสอบ fixed versions ที่มีให้
5. ตรวจสอบ dependencies ที่ abandoned หรือ unmaintained

## Unused And Duplicate

1. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ได้ใช้
2. ทำ `/check-circular-dependencies` เพื่อหา circular dependencies
3. ระบุ duplicate dependencies ที่ทำงานเหมือนกัน
4. ตรวจสอบ dev dependencies ที่ควรเป็น production หรือกลับกัน
5. ตรวจสอบ dependencies ที่ประกาศแต่ไม่ import ใน code

## License Compliance

1. ระบุ license ของ dependencies ทั้งหมด
2. ตรวจสอบ compatibility กับ project license
3. ระบุ licenses ที่มีข้อจำกัด (GPL, AGPL, copyleft) ในโปรเจกต์ non-GPL
4. ระบุ licenses ที่ต้อง attribution หรือ notice
5. รายงาน license conflicts พร้อม recommendation

## Bundle Impact

1. ทำ `/report-bundle` เพื่อดู bundle size และ contribution ของแต่ละ dependency
2. ระบุ dependencies ที่มีขนาดใหญ่ผิดปกติ
3. ตรวจสอบ tree-shaking compatibility
4. ระบุ dependencies ที่ควรเป็น peer dependency แทน direct dependency
5. แนะนำ lightweight alternatives ถ้ามี

## Severity Mapping

- Critical: critical vulnerability, incompatible dependency
- High: high vulnerability, outdated major dependency version
- Medium: unused dependency, outdated minor dependency version
- Low: duplicate package, outdated patch version
