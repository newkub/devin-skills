# Rust CI/CD Reference

แนวทางการตั้งค่า CI/CD pipeline สำหรับ quality assurance ใน Rust projects

ตั้งค่า CI/CD pipeline สำหรับ quality assurance

- ใช้ GitHub Actions สำหรับ CI
- รัน linting, formatting, tests แบบ parallel
- ทดสอบกับ stable, beta, nightly, และ MSRV
- ทดสอบ cross-platform (ARM, WASM)
- ใช้ `cargo-deny` สำหรับ dependency checks
- ใช้ `cargo-nextest` สำหรับ parallel test execution
- ใช้ `cargo-llvm-cov` สำหรับ coverage reporting
- ใช้ Miri สำหรับ undefined behavior detection
- ใช้ `taiki-e/install-action` สำหรับ install CI tools
- ตรวจสอบ dependencies sorted
