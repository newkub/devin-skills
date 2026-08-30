# Regression Coverage

## Goal

ตรวจ regression coverage ครบถ้วนก่อน run และหลัง run tests

## Checks

1. ตรวจ bug fixes มี regression tests ป้องกัน recurrence
2. ตรวจ critical paths มี regression coverage
3. ตรวจ mutation testing สำหรับ critical code (score > 80%)
4. ตรวจ CI/CD pipeline รัน regression tests อัตโนมัติ
5. ถ้า regression ล้มเหลวใน CI หรือต้อง monitor จนผ่าน → ส่งต่อ `/watch-ci-and-resolve`

## Severity

- Critical: bug fix สำคัญไม่มี regression test หรือ CI ไม่รัน regression
- High: critical path ไม่มี regression coverage หรือ mutation score < 80%
- Medium: regression tests ขาดบาง critical path หรือไม่สม่ำเสมอ
- Low: documentation หรือ runbook ขาดสำหรับ regression failures
