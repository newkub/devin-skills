# Check: Supply Chain



### Goal

ตรวจ software supply chain ของ project — lockfile tampering, typosquatting, suspicious install scripts, unpinned/untrusted sources — ความเสี่ยงที่ไม่ใช่ vulns ใน code แต่มาจาก dependencies เอง

### Scope

- ตรวจ manifests + lockfiles: `package.json`, `bun.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `go.sum`
- ครอบคลุม: lockfile integrity, install scripts (`postinstall`), typosquat lookalikes, git/url deps, registry sources, version pinning
- Read-only: รายงาน — remediation ผ่าน `## Check: Supply Chain` หรือ `/review-dependencies`

### Execute

#### Subskills

> Goal: dispatch ไปยัง domain subskill ตาม argument — หรือรันครบทุก domain ถ้าไม่ระบุ

| Domain/Argument | Reference |
|-----------------|----------|
| `lockfile` | [supply-chain-lockfile.md](supply-chain-lockfile.md) — resolve ตรง manifest, integrity fields, sources |
| `typosquat`, `packages` | [supply-chain-typosquat.md](supply-chain-typosquat.md) — lookalike names, suspicious signals, dependency confusion |
| `install-scripts`, `scripts` | [supply-chain-install-scripts.md](supply-chain-install-scripts.md) — lifecycle scripts audit |
| `pinning`, `sources` | [supply-chain-pinning.md](supply-chain-pinning.md) — floating versions, `.npmrc`, CI install flags |
| `report`, `risks` | [supply-chain-report-risks.md](supply-chain-report-risks.md) — risk report รวมทุก domain + hardening roadmap |

1. ถ้า argument ระบุ domain เดียว → อ่าน `supply-chain-<domain>.md` แล้วทำตาม flow ในนั้น — ข้าม domains อื่น แต่ยังทำ Step 5 (Report)
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามลำดับ โดยแต่ละ step อ่าน reference ที่ตรงมา execute

#### 1. Lockfile Integrity

> Goal: ตรวจ lockfile ไม่ถูกแกะ

ทำตาม [supply-chain-lockfile.md](supply-chain-lockfile.md)

#### 2. Typosquat And Suspicious Packages

> Goal: หา packages ที่อาจเป็นของปลอม

ทำตาม [supply-chain-typosquat.md](supply-chain-typosquat.md)

#### 3. Install Scripts Audit

> Goal: ตรวจ lifecycle scripts ที่รันโค้ดตอน install

ทำตาม [supply-chain-install-scripts.md](supply-chain-install-scripts.md)

#### 4. Pinning And Sources

> Goal: ตรวจ reproducibility ของ supply chain

ทำตาม [supply-chain-pinning.md](supply-chain-pinning.md)

#### 5. Report

> Goal: สรุป supply chain risks

ทำตาม [supply-chain-report-risks.md](supply-chain-report-risks.md) — รวม findings ทุก domain เป็น risk report + hardening roadmap

### Rules

#### 1. Evidence-Based

- ทุก flag ต้องมี artifact จริง — lockfile line, script content, registry metadata
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context นี้" (เช่น internal registry)

#### 2. Read-Only

- ไม่แก้ lockfile/manifests — รายงานให้ `/review-dependencies` แก้
- ไม่รัน install scripts เพื่อทดสอบ

#### 3. Practical

- เน้น risks ที่ actionable — ไม่ flag ทุก transitive dep
- supply chain hardening ต้องไม่ทำ workflow พัง — เสนอทีละขั้น
- ใช้ /run-audit ถ้าจำเป็น

### Expected Outcome

- รายการ supply chain findings พร้อม severity และ evidence
- Lockfile/install-script posture ที่ชัดเจน
- Hardening recommendations เรียงตาม risk

### Install Scripts

ทำตาม [supply-chain-install-scripts.md](supply-chain-install-scripts.md)


### Lockfile

ทำตาม [supply-chain-lockfile.md](supply-chain-lockfile.md)


### Pinning

ทำตาม [supply-chain-pinning.md](supply-chain-pinning.md)


### Report Risks

ทำตาม [supply-chain-report-risks.md](supply-chain-report-risks.md)


### Typosquat

ทำตาม [supply-chain-typosquat.md](supply-chain-typosquat.md)

