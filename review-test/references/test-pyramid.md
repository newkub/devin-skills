# Test Pyramid Balance Checks

## Goal

ตรวจ test pyramid balance เหมาะสมใน test suite

## Checks

### Pyramid Distribution

1. ตรวจ unit tests ประมาณ 70% ของทั้งหมด
2. ตรวจ integration tests ประมาณ 20%
3. ตรวจ e2e tests ประมาณ 10%
4. ตรวจไม่มี inverted pyramid (e2e เยอะกว่า unit)

### Performance Targets

1. ตรวจ unit tests < 10ms ต่อ test
2. ตรวจ integration tests < 100ms ต่อ test
3. ตรวจ parallel execution เมื่อ tests ไม่ dependent กัน
4. ตรวจ e2e tests จำกัดเฉพาะ critical paths

### Test Types

1. ตรวจมี contract tests สำหรับ API compatibility
2. ตรวจมี property-based tests สำหรับ invariants
3. ตรวจมี mutation tests สำหรับ critical code (score > 80%)
4. ตรวจมี performance tests สำหรับ critical paths
5. ตรวจมี security tests สำหรับ auth, IDOR, injection
6. ตรวจมี accessibility tests สำหรับ UI components

### CI Integration

1. ตรวจ tests รันใน CI pipeline
2. ตรวจ coverage report สร้างใน CI
3. ตรวจ regression tests รันอัตโนมัติ
4. ตรวจ performance tests รันใน CI สำหรับ regressions

## Severity

- Critical: inverted pyramid, unit tests < 50%, ไม่มี CI integration
- High: unit tests < 70%, performance targets เกิน, ไม่มี security tests
- Medium: test types ขาด, parallel execution ไม่ใช้, mutation tests ขาด
- Low: e2e เยอะเกิน, accessibility tests ขาด
