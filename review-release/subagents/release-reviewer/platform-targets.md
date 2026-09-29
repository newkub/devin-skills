# Platform Target And Rollback Checks

## Goal

ตรวจ platform targets และ rollback plan ก่อน publish

## Checks

### Platform Configuration

1. ตรวช npm: `package.json` มี `private: false`, `publishConfig.access: public`, `name`, `version`, `description`, `license`, `repository`, `homepage`, `files`
2. ตรวช crates: `Cargo.toml` มี `name`, `version`, `authors`, `description`, `license`, `repository`, `categories`, `keywords`, `edition`, `rust-version`
3. ตรวช vscode: `package.json` มี `publisher`, `engines.vscode`, `activationEvents`, `main`, `contributes`
4. ตรวช docker: `Dockerfile` มี `FROM`, `WORKDIR`, `COPY`, `RUN` และ `.dockerignore`
5. ตรวช webstore: `manifest.json` มี `name`, `version`, `manifest_version`, `permissions`, `icons`, `action`

### Authentication Tokens

1. ตรวช `NPM_TOKEN` ตั้งค่าใน GitHub Secrets (Automation token)
2. ตรวช `CARGO_REGISTRY_TOKEN` ตั้งค่าใน GitHub Secrets
3. ตรวช `VSCE_PAT` ตั้งค่าใน GitHub Secrets
4. ตรวช `DOCKER_USERNAME`, `DOCKER_PASSWORD` ตั้งค่าใน GitHub Secrets
5. ตรวช tokens มีสิทธิ์ publish ไปยัง package/extension

### Rollback Plan

1. ตรวช rollback plan สำหรับ npm: `npm deprecate`, `npm unpublish` (ภายใน 72h)
2. ตรวช rollback plan สำหรับ crates: `cargo yank`
3. ตรวช rollback plan สำหรับ vscode: version rollback
4. ตรวช rollback plan สำหรับ docker: previous image tag
5. ตรวช rollback trigger criteria ระบุชัดเจน

### CI/CD Workflow

1. ตรวช GitHub Actions workflow มี permissions: `contents write`, `pull-requests write`
2. ตรวช workflow ตั้งค่า trigger บน push ไป main branch
3. ตรวช workflow ใช้ tokens จาก GitHub Secrets
4. ตรวช workflow มี `fetch-depth: 0` สำหรับ conventional commits

## Severity

- Critical: platform config ขาด, tokens ไม่ตั้งค่า, ไม่มี rollback plan
- High: config ไม่ครบ, workflow permissions ขาด, rollback ไม่ชัด
- Medium: rollback criteria ไม่ระบุ, workflow ไม่ละเอียด
- Low: config formatting, missing optional fields
