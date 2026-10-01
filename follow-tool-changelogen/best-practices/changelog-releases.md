# Changelogen Best Practices

แนวทางใช้ changelogen สร้าง changelog + version bump จาก conventional commits อย่าง reproducible และปลอดภัย

## Recommended Patterns

### Commit Convention Discipline

- Changelog ดีได้ต่อเมื่อ commits เป็น conventional — enforce ด้วย PR title check (GitHub Action) หรือ `commitlint` + hooks ก่อนจะพึ่ง changelogen
- Squash merge strategy + conventional PR titles ให้ changelog สะอาดสุด — merge commits แบบเดิมทำให้ changelog มี noise (wip, fix typo)
- ใช้ scope (`feat(api):`, `fix(ui):`) สม่ำเสมอ — `scopeMap` ใน config จะ map เป็น section ที่อ่านง่าย
- Breaking changes ต้องมี `!` หรือ `BREAKING CHANGE:` footer — ถ้าพลาด bump จะเป็น minor ผิด semver

### Preview Before Release

- รัน `bunx changelogen` (no flags) ก่อนเสมอเพื่อ preview output โดยไม่แตะ version/tag
- ใช้ `--bump` เมื่อต้องการเลข version อย่างเดียว (เช่นเช็คว่า bump ถูกตาม commits)
- ใช้ `--release` เมื่อพร้อมทำครบ (bump + changelog + commit + tag + GitHub release) และใส่ `--clean` เพื่อบังคับ working tree สะอาด
- ใน CI ให้ release job แยกจาก build/test — release ควรรันหลัง quality gates ผ่านเท่านั้น

### Monorepo Approach

- changelogen ทำงานต่อ repo เดียว — multi-package versioning ให้รัน `--dir <pkg>` ทีละ package หรือเปลี่ยนไปใช้ changesets เมื่อ packages ผูกกัน
- ใช้ `scopeMap` จัดกลุ่ม commits ใน changelog เดียวแทนการแยก changelog ทุก package — เหมาะกับ monorepo ที่ release พร้อมกัน

### GitHub Release Sync

- ตั้ง `GITHUB_TOKEN`/`GH_TOKEN`/`CHANGELOGEN_TOKENS_GITHUB` ใน env — ไม่มี token จะได้แค่ generated link ต้องกดเอง
- ใช้ `changelogen gh release` เพื่อ sync release notes จาก `CHANGELOG.md` ไป GitHub releases โดยไม่ bump ซ้ำ — มีประโยชน์ตอนแก้ changelog แล้วต้องการอัปเดต release เดิม
- `--publish` สำหรับ npm publish ต่อจาก release — auth ผ่าน `.npmrc` หรือ `NPM_TOKEN` แยกจาก GitHub token

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| Merge commits ไม่ conventional | changelog ว่างหรือ bump ผิด | enforce PR title + squash merge |
| แก้ `CHANGELOG.md` มือระหว่าง releases | section ถัดไปทับ/duplicate | แก้ผ่าน `templates`/config หรือแก้หลัง generate แล้ว commit ทันที |
| รัน `--release` บน dirty tree | commit ปนไฟล์ที่ไม่เกี่ยว | ใช้ `--clean` บังคับ clean state |
| Tag format ไม่ตรง release เก่า | changelog link/compare พัง | ตั้ง `templates.tagBody`/`tagMessage` ให้ consistent |
| Repo detect ผิด | GitHub compare links พัง | ตั้ง `repo` explicit ใน config เมื่อ `package.json` ไม่มี `repository` field |
| รัน release จาก local ด้วย token ส่วนตัว | release author เป็นคน + scope กว้าง | รันใน CI ด้วย bot token |
| Canary/canary suffix ปนกับ stable | consumers ดึง prerelease โดยไม่ตั้งใจ | `--canary` เฉพาะ prerelease channel + dist-tag แยก |

## Do / Don't

| Do | Don't |
|---|---|
| preview ด้วย `changelogen` ก่อน `--release` | ยิง `--release` ครั้งแรกโดยไม่เคย preview |
| squash merge + conventional titles | rely on raw commit history จาก merge commits |
| `--clean` ใน release script | ปล่อยให้ release รันบน dirty tree ได้ |
| ตั้ง `repo` explicit เมื่อ auto-detect ไม่ได้ | assume detect ถูกเสมอ (forks/mirrors พัง) |
| เก็บ generated changelog เป็น append-only | rewrite history ของ changelog ย้อนหลัง |
| แยก `--no-github` runs สำหรับ non-GitHub repos | ปล่อยให้ release fail เพราะหา repo ไม่เจอ |

## Performance And CI Notes

- `changelogen` parse git log ทั้งหมด — fetch ต้อง full history: `actions/checkout` ต้อง `fetch-depth: 0` ไม่งั้น changelog ขาด
- Release job ควรมี `concurrency` guard — double-push ไป main ไม่ควรสร้าง 2 releases แข่งกัน
- รัน release เฉพาะเมื่อมี commits ใหม่นับจาก tag ล่าสุด — changelogen handle เอง แต่ skip job เร็วกว่าถ้าเช็ค `git log` ก่อน
- `--canary` สร้าง prerelease ที่ไม่ commit changelog เต็ม — ใช้สำหรับ PR preview packages
- Changelog generation เร็ว (< วินาทีต่อหลายร้อย commits) — bottleneck ของ release job คือ build/test/publish ไม่ใช่ changelogen

## Config Guidance

`changelog.config.ts` ที่สมดุล:

```ts
import { defineConfig } from 'changelogen'

export default defineConfig({
  types: {
    feat: { title: 'Features', semver: 'minor' },
    fix: { title: 'Bug Fixes', semver: 'patch' },
    perf: { title: 'Performance', semver: 'patch' },
    refactor: { title: 'Refactors' },
    docs: { title: 'Documentation' },
    chore: { title: 'Chores' }
  },
  scopeMap: {
    api: 'API',
    ui: 'UI'
  },
  excludeAuthors: ['bot-name']
})
```

- ตั้ง `excludeAuthors` สำหรับ bot commits (renovate, dependabot) — changelog จะได้ไม่รก
- `templates.commitMessage`/`tagMessage` ให้ตรง convention ของ repo (เช่น `chore(release): v{newVersion}`)
- `output` custom path เมื่อ changelog อยู่นอก root — default `CHANGELOG.md` ครอบเกือบทุกกรณี
- Document release checklist: preview → `--clean` release → verify tag + GitHub release → publish
