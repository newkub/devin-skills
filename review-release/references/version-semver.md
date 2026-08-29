# Version Bump And Semver Checks

## Goal

ตรวจ version bump correctness และ semver compliance ก่อน publish

## Checks

### Version Consistency

1. ตรวจ version ใน `package.json` ถูกต้อง
2. ตรวช version ใน `Cargo.toml` ถูกต้อง (ถ้ามี)
3. ตรวช version ใน `manifest.json` ถูกต้อง (ถ้ามี)
4. ตรวช version สอดคล้องกันในทุก manifest files

### Version Bump Rules

1. ตรวช `feat` commits → minor bump (`X.Y+1.0`)
2. ตรวช `fix` commits → patch bump (`X.Y.Z+1`)
3. ตรวช `BREAKING CHANGE` หรือ `feat!` → major bump (`X+1.0.0`)
4. ตรวช version bump สอดคล้องกับ conventional commits ตั้งแต่ last release

### Semver Compliance

1. ตรวช version format เป็น `X.Y.Z` (เช่น `1.2.3`)
2. ตรวช prerelease format: `X.Y.Z-beta.1`, `X.Y.Z-rc.1`
3. ตรวช git tags ใช้ format `vX.Y.Z` (เช่น `v1.2.3`)
4. ตรวช ไม่มี version regression (version ลดลง)

### Pre-Release Checks

1. ตรวช `run-verify-on-local` ผ่านก่อน release
2. ตรวช `run-build` สำเร็จก่อน release
3. ตรวช `run-test` ผ่านก่อน release
4. ตรวช dry run ผ่าน: `semantic-release --dry-run`, `vsce package`

## Severity

- Critical: version ไม่สอดคล้อง, version regression, semver ผิด
- High: version bump ผิด, git tag format ผิด, pre-release ไม่ผ่าน
- Medium: prerelease format ไม่ standard, dry run ขาด
- Low: version formatting ไม่สม่ำเสมอ
