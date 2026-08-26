# Step: Update Workspaces READMEs

> Goal: อัปเดต README ทุก workspace ใน monorepo

## Execute

1. ทำ `/all-workspace` เพื่อ update README ทุก workspaces
2. ไม่ต้องมี `License` section (ใช้ของ root)
3. ไม่ต้องมี `## Contributing` section (ใช้ของ root)
4. ถ้า workspace ไม่มี `package.json` → skip และ report
5. ถ้า update fail → retry (max 3 → stop/report)

## Rules

- Workspace README ใช้ template เดียวกับ root แต่:
  - ไม่มี `## License` (ใช้ของ root)
  - ไม่มี `## Contributing` (ใช้ของ root)
  - มี Status, Hero, Report ANSI, UI Sketch, Get Started, Features, Usage
