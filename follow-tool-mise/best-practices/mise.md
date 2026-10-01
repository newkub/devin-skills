# mise — Best Practices

Dev tool version manager + env vars + tasks — polyglot toolchain discipline

## Recommended Patterns

- `mise.toml` (หรือ `.tool-versions` legacy) ที่ repo root — pin exact versions (`node = "22.x"`, `bun = "1.x"`)
- `mise use -g <tool>` สำหรับ global tools, `mise use` ใน project สำหรับ per-repo pins
- `[env]` section สำหรับ project env vars — `_.file` load `.env`; secrets ผ่าน `_.source` หรือ external
- `[tasks]` แทน npm scripts เมื่อ cross-language — `run`/`depends`/`sources`/`outputs` caching
- Backends: `npm:`, `cargo:`, `ubi:`, `aqua:` — เลือก backend ตาม tool (ubi/aqua = fast binary installs)

## Common Pitfalls

- `mise trust` required สำหรับ config files — CI ต้อง `mise trust` หรือ `MISE_TRUSTED_CONFIG_PATHS`
- Version drift ข้ามเครื่อง = "works on my machine" — commit `mise.toml` + CI ใช้ `mise install`
- shims vs activate: `mise activate` (shell integration) สะอาดกว่า shims — แต่ shims จำเป็นสำหรับบาง IDEs
- `.env` files อย่า commit secrets — `mise.toml [env]` สำหรับ non-secret envs เท่านั้น
- Legacy `.nvmrc`/`.node-version` conflicts — migrate เข้า mise ตัวเดียว อย่า mixed version files

## Tasks

- Task dependencies ผ่าน `depends`/`depends_post` — DAG ชัดกว่า chained npm scripts
- `sources`/`outputs` → file-change caching — skip tasks เมื่อ inputs ไม่เปลี่ยน
- `mise watch` สำหรับ file-watching workflows

## Do / Don't

| Do | Don't |
|----|-------|
| pin versions ใน mise.toml | rely on system-installed tools |
| `mise install` ใน CI/setup | assume versions match |
| `[env]` สำหรับ non-secrets | commit `.env` secrets |
| tasks สำหรับ cross-language | npm scripts ห่อ rust/go tools |
