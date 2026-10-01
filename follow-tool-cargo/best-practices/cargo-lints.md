# Cargo Lints Best Practices

แนวทางตั้งค่า `[lints]`/`[workspace.lints]` ใน `Cargo.toml` ให้ทีมใช้ rule set เดียวกัน และรันใน CI ได้เสถียร

## Recommended Patterns

### Lint Levels And Ratcheting

- เริ่มด้วย `warn` แล้วค่อย ratchet เป็น `deny` ทีละ rule เมื่อ codebase สะอาด — เปิด `deny` พร้อมกันทั้งหมดจะทำให้ build พังและทีมปิด lint ทิ้ง
- จัดกลุ่มตามความเสี่ยง: `unused_*`/`missing_docs` (safe, เพิ่มได้เร็ว) → `clippy::all`/`pedantic` (ต้อง triage) → `nursery` (experimental, คาดว่าจะ churn)
- ใช้ `priority = -1` บน lint ที่ต้องการให้ `#[allow]` ใน code ชนะ — default priority ของ lint groups ทำให้ per-item allow ไม่ทำงานบางกรณี
- เมื่อต้อง `#[allow]` ให้ใส่ที่ scope เล็กสุด (item/function) พร้อม comment เหตุผล — `#![allow]` ระดับ crate ซ่อนปัญหาจริงในอนาคต

### Workspace Inheritance

- ตั้ง `[workspace.lints]` ที่ root `Cargo.toml` เท่านั้น — source of truth เดียว
- ทุก member crate ใส่ `[lints] workspace = true` — อย่า copy rules ซ้ำในแต่ละ crate เพราะจะ drift
- Member crate override เฉพาะที่จำเป็น (เช่น `unsafe_code = "allow"` ใน FFI crate) — document เหตุผลใน comment
- New crate template ควรมี `[lints] workspace = true` ตั้งแต่ scaffold — ลืมแล้ว crate นั้นไม่ถูก lint เงียบๆ

### Pedantic Strategy

- `clippy::pedantic` มี false positives ตาม design (`cast_precision_loss`, `must_use_candidate`, `missing_errors_doc`) — ไม่ต้องแก้ทุกตัว
- Pattern ที่ดี: เปิด `pedantic = "warn"` แล้ว allow เฉพาะ lints ที่ทีมตกลงว่าไม่จำเป็นใน `[workspace.lints.clippy]` — ทำ allowlist/noiselist ที่ config ไม่ใช่กระจายใน code
- `clippy::nursery` เปลี่ยนแปลงระหว่าง toolchain versions — เปิดเมื่อทีมยอมรับ lint churn ตอน `rustup update`

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| `cargo clippy` โดยไม่มี `--all-targets` | test/example code ไม่ถูก lint | ใช้ `--all-targets` เสมอ |
| `--all-features` บน workspace ใหญ่ | feature unification ทำให้ compile path แปลก | รัน `--all-targets` default ก่อน; all-features เฉพาะเมื่อตั้งใจ |
| `[lints]` ใช้ใน virtual manifest ผิดที่ | lint ไม่ apply | virtual manifest ใช้ `[workspace.lints]` เท่านั้น |
| `nursery` + `-D warnings` ใน CI | CI แดงหลัง `rustup update` | แยก nursery เป็น warn หรือ pin toolchain ใน `rust-toolchain.toml` |
| `missing_docs` บน binary crate | warn เต็ม main.rs | scope doc lints เฉพาะ lib crates |
| fmt ผิดแต่ lint ผ่าน | style drift | `cargo fmt --check` เป็น hook/job แยก |
| lints ใน `Cargo.toml` แต่ dev ใช้ `cargo build` เฉย | warnings ไม่มีใครเห็น | CI gate `clippy -- -D warnings` + pre-commit hooks |

## Do / Don't

| Do | Don't |
|---|---|
| `[workspace.lints]` ที่ root + `workspace = true` ทุก member | copy lint table ซ้ำทุก crate |
| ratchet `warn` → `deny` เมื่อ clean | เปิด `deny` ทุกกลุ่มตั้งแต่วันแรก |
| `cargo clippy --all-targets -- -D warnings` ใน CI | run clippy โดยไม่ gate (warnings = noise) |
| `#[allow]` พร้อม comment เหตุผล | `#![allow(clippy::all)]` ทั้ง crate |
| pin toolchain ผ่าน `rust-toolchain.toml` | ปล่อย stable ลอยแล้ว CI แดงจาก lint ใหม่ |
| แยก `cargo fmt --check` เป็น step ชัด | รวม fmt ใน clippy step จน log ปนกัน |

## Performance And CI Notes

- `cargo check --all-targets` ก่อน `clippy` — clippy ครอบ check แต่แยกกันทำให้ error อ่านง่าย; ใน CI รัน `clippy` อย่างเดียวก็พอเพราะรวม check
- Cache `target/` ใน CI (Swatinem/rust-cache หรือ sccache) — clippy เปลี่ยน rustc flags ทำให้ cache key ต่างจาก build ปกติ อย่าแชร์ cache ผสมโดยไม่ตั้งใจ
- Pin toolchain: `rust-toolchain.toml` ระบุ channel+components (`clippy`, `rustfmt`) — lint sets เปลี่ยนตาม release ทำให้ CI reproducible
- `cargo deny` (licenses/advisories/bans) และ `cargo audit` เป็น job แยกจาก lints — ต่าง domain กัน
- Pre-commit hooks (lefthook): `fmt --check` เร็วสุดควรรันก่อน; `clippy -D warnings` อาจช้า — เลือกว่าจะ gate ที่ pre-commit หรือ pre-push ตามเวลาที่ยอมรับได้
- `cargo doc` build แยก job ถ้าใช้ `missing_docs` — doc lints เจอเต็มเมื่อ build docs จริง

## Config Guidance

Root `Cargo.toml`:

```toml
[workspace.lints.rust]
unused_extern_crates = "warn"
unused_qualifications = "warn"
missing_docs = "warn"

[workspace.lints.clippy]
all = "warn"
pedantic = "warn"
# allowlist เฉพาะที่ทีมตกลง
cast_precision_loss = "allow"
missing_errors_doc = "allow"
```

Member crate:

```toml
[lints]
workspace = true
```

- เก็บ lint rationale ใน comment ข้าง rule ที่ปิด — reviewer จะได้ไม่ต้องเดา
- ใส่ `[lints] workspace = true` ใน cargo-new template/generator ของ repo
- Review lint table ทุก toolchain bump — lint ใหม่ใน `all`/`pedantic` อาจต้อง triage
