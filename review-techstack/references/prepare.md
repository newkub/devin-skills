# Prepare And Scan

เตรียม context ก่อนเริ่ม review

## Goal

เข้าใจ tech stack structure, dependency landscape และ library config

## Execute

1. ทำ `/scan-codebase` เพื่อเข้าใจ tech stack structure และหา manifest files และ lockfiles
2. ระบุ frameworks, runtimes, build tools, package manager และ bundler ที่ใช้
3. ระบุ package type: library vs app และ publish target (`npm`, private registry)
4. ทำ `/list-dependencies` เพื่อดู dependencies ทั้งหมด
5. ถ้าเป็น monorepo → ตรวจทุก workspaces และ dependency graph ข้าม workspaces
6. ถ้าไม่มี dependencies → stop และ report
7. ถ้า project ไม่ใช่ library → ข้าม library design checks ใน `references/lib-design.md`

## Expected Outcome

- รายการ manifest files, lockfiles, frameworks, runtimes, package manager, bundler
- รายการ dependencies ทั้งหมด และ dependency graph (ถ้าเป็น monorepo)
- ข้อมูล package type และ publish target
- เงื่อนไข stop หรือ skip ถ้าไม่มี dependencies หรือไม่ใช่ library
