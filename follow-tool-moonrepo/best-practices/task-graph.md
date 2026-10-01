# moonrepo — Task Graph และ Project Boundaries

## Recommended Patterns

### Task Naming และ deps

- ใช้ชื่อ task เดียวกันทุก project (`build`, `test`, `lint`, `typecheck`) — `moon run :build` fan-out ไปทุก project ที่มี task นั้น
- ใช้ `deps: ["^:build"]` เมื่อ project ต้องการ artifacts ของ upstream dependencies ก่อน — moon รัน upstream ให้เสร็จก่อนเสมอ
- ใช้ same-project deps (`deps: ["codegen"]`) สำหรับ ordering ภายใน project เดียว — อย่า chain ด้วย `&&` ใน `command` เพราะ cache และ parallelism จะไม่ทำงาน
- ตั้ง `deps` ให้ครบตั้งแต่แรก — graph ที่ขาด dep ทำให้ race condition ที่ debug ยากกว่าต้นทุนการ declare

### inputs / outputs

- ทุก build task ต้องมี `outputs` (`dist`, `build`, `.next/**`) — ไม่มี `outputs` = ไม่มี cache restore
- `inputs` default คือ `**/*` ของ project — แคบลงเมื่อ task ไม่ควร re-run จากไฟล์ที่ไม่เกี่ยว เช่น `inputs: ['src/**/*', 'package.json']`
- tasks ที่ไม่ผลิต artifact (`test`, `lint`) ยัง cache ได้ — stdout/stderr ถูก replay จาก cache
- อย่าใส่ `outputs` ที่ชี้ออกนอก project dir — hash จะ unstable และ cache hit rate ตก

### Shared config ผ่าน `.moon/tasks/`

- task ที่ใช้ซ้ำทุก project ใส่ `.moon/tasks/all.yml` — `moon.yml` ของแต่ละ project override เฉพาะจุดที่ต่าง
- ใช้ `tags` ใน `moon.yml` ร่วมกับ tag-scoped tasks (เช่น `.moon/tasks/tag-frontend.yml`) เพื่อให้ `dev`/`serve` มีเฉพาะ frontend projects
- ใช้ `dependsOn` explicit เมื่อ project reference กันจริง — implicit detection จาก manifest deps ใช้ได้ แต่ explicit ชัดกว่าใน mixed-stack repo

### Toolchain

- ปัก toolchain ใน `.moon/toolchains.yml` ให้ moon manage version — ทีมได้ version เดียวกันโดยไม่พึ่ง global install
- ถ้า `mise`/`proto` manage toolchain อยู่แล้ว → ปิด auto-install ของ moon สำหรับ tool นั้น เพื่อไม่ให้ download ซ้ำสองที่

## Do / Don't

| Do | Don't |
|---|---|
| รัน `moon run :<task>` ผ่าน task graph | เขียน script ที่ loop เข้าแต่ละ package เอง |
| declare `deps` ตาม dependency จริงของ code | อาศัย ordering จากชื่อ project หรือ luck |
| ใช้ `--affected` สำหรับ local check ก่อน push | รัน `:build :test` ทั้ง repo ทุกครั้งที่แก้นิดเดียว |
| ใช้ `moon query projects` / `moon task` debug graph | แก้ config แล้วเดาว่า graph ถูก |
| เก็บ shared tasks ใน `.moon/tasks/` | copy-paste task เดิมลงทุก `moon.yml` |

## Common Pitfalls

- `moon run project:build` fail ว่า dep build ไม่ทัน → ขาด `deps: ["^:build"]` ใน task นั้น
- cache ไม่ hit ทั้งที่ไม่ได้แก้อะไร → `inputs` กว้างเกินไป หรือมี generated file ที่เปลี่ยนทุกครั้งอยู่ใน input set
- env-dependent task (อ่าน `process.env` ที่เปลี่ยนบ่อย) ต้องระบุ env ใน `inputs` หรือ `options.envFile` — ไม่งั้น moon cache ผิด
- task `dev`/`start` ที่รันไม่จบ ต้องตั้ง `options.persistent = true` — ไม่งั้น dependents จะรอตลอดไป
- อย่าใส่ task เดียวกันทั้งใน `.moon/tasks/all.yml` และ `moon.yml` โดยไม่ตั้งใจ merge — อ่าน merged config ด้วย `moon task <id>:<task>` ก่อน debug

## Performance Notes

- `--affected` ใช้ git diff เทียบ base — ต้องมี branch point ที่ถูกต้อง (`vcs.defaultBranch`)
- ปรับ `runner.implicitDeps` / concurrency ใน `.moon/workspace.yml` เมื่อเครื่อง weak หรือ CI มี CPU จำกัด
- remote caching (`.moon/workspace.yml` → `runner.cache`/`unstable_remote`) คุ้มเมื่อทีม >2 คนหรือ CI เยอะ — local cache เฉยๆ ก็ช่วยมากแล้ว
- หลีกเลี่ยง task ที่ `command` เป็น script shell ยาว — แยกเป็น file ใน `scripts/` แล้วเรียก เพื่อให้ diff อ่านง่ายและ hash นิ่ง

## CI Notes

- ใช้ `moon ci` เท่านั้นบน CI — มันรันเฉพาะ tasks ที่ affected และมี `runInCI` เปิดอยู่
- shallow clone ทำ `--affected` พัง — ใช้ `fetch-depth: 0` หรือ `filter: 'blob:none'`
- ตั้ง `runInCI: false` ให้ persistent tasks (`dev`, `serve`) — default ปิดอยู่แล้วแต่ระวัง custom tasks ที่ลืม
