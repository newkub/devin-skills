# mbx CI And Sharing

## GitHub Action

[`jdx/mr-boxington-action@v1`](https://github.com/jdx/mr-boxington-action) ติดตั้ง/ reuse mbx และตั้ง caching ให้ job — repo ของ action เป็น owner ของ input reference เต็ม

Minimal workflow (ใช้ Rust toolchain ของ runner; ถ้า pin toolchain ให้ install ก่อน cache step):

```yaml
name: ci
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: jdx/mr-boxington-action@v1
      - run: mbx test --workspace
```

- Default backend = GitHub Actions cache — restore pruned `target/` + registry จาก compatible archive; save เฉพาะ push ขึ้น default branch หรือ trusted `workflow_dispatch` (`save-on-workflow-dispatch`); PRs/forks = restore-only
- `github-cache-mode: objects` — export เฉพาะ actions ที่ job ใช้/สร้าง (หลาย target dirs/ layouts แชร์ entry เดียว; ไม่รวม Cargo registry)
- `cache-generation: v2` — เริ่ม archive series ใหม่เมื่อ format/policy เปลี่ยน
- `toolchain: <name>` — scope key ตาม `rustc` identity (install toolchain ก่อน action; input ไม่ได้ install ให้)
- Pin actions เป็น full commit SHA ใน production

### Parallel Cargo Steps

ใช้ GitHub `parallel` step group + `CARGO_TARGET_DIR` แยกต่อ step (Cargo lock serialize ถ้า target เดียวกัน) — mbx store/scheduler แชร์กันเอง:

```yaml
- parallel:
    - env: { CARGO_TARGET_DIR: "${{ runner.temp }}/clippy-default" }
      run: mbx clippy --workspace -- -D warnings
    - env: { CARGO_TARGET_DIR: "${{ runner.temp }}/clippy-all" }
      run: mbx clippy --workspace --all-features --all-targets -- -D warnings
```

### Manual GitHub Cache

```yaml
- uses: actions/cache@v6
  with:
    path: |
      ~/.cargo/registry
      ~/.cargo/git
      ~/.cargo/.global-cache
      ~/.cache/mbx
    key: ${{ runner.os }}-${{ runner.arch }}-mbx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-${{ runner.arch }}-mbx-
- uses: jdx/mise-action@v4
  with:
    cache: false
    install_args: mr-boxington
- run: mbx test --workspace
- run: mbx gc --max-size 3GB
  if: always()
```

PRs ใช้ `actions/cache/restore` แทน `actions/cache`

## Remote Backends

| Backend | เมื่อ | Credentials |
|---|---|---|
| Cache server | server-side grants + batch/compression/dedup extensions | Bearer token หรือ GitHub OIDC |
| S3-compatible | มี object storage อยู่แล้ว (รวม R2/MinIO ผ่าน `s3_endpoint`) | AWS env credentials |
| GitHub Actions cache | managed archive สำหรับ GH jobs | action จัดการ |

Action config สำหรับ remote server:

```yaml
permissions:
  contents: read
  id-token: write
steps:
  - uses: jdx/mr-boxington-action@v1
    with:
      backend: remote
      remote-url: https://cache.example.com
      namespace: acme/backend
      oidc-audience: mbx-cache
```

- เฉพาะ push ขึ้น protected branch เขียนได้ — PR/tag/release degrade เป็น read-only; ถ้า fork authors ห้ามถึง host → ใช้ GitHub backend
- `token` input แทน OIDC เมื่อ OIDC ใช้ไม่ได้
- Scope write credential ให้ trusted branches เท่านั้น — code ที่ถือ credential เขียน bucket ได้เอง

## Closure Bundles (transports อื่น)

ทุก `mbx` command ที่จบเขียน immutable receipt เข้า group `MBX_CACHE_EXPORT_GROUP` — assign unique value ต่อ job:

```sh
mbx cache import "$RUNNER_TEMP/mbx-cache.tar"     # restore phase
mbx cache export --group "$MBX_CACHE_EXPORT_GROUP" "$RUNNER_TEMP/mbx-cache.tar"  # post phase
```

Import เมื่อ checkout match + target ว่าง → restore fingerprints, dep-info, build-script state และ target layout พร้อม action closure; target ที่ไม่ว่างถูกปล่อยไว้ Post step ควร skip เมื่อไม่มี completed build หรือ trust policy ห้าม write

## Docker

Mount store + registry เข้า container ที่ตำแหน่งคงที่:

```sh
docker run --rm \
  --env CARGO_HOME=/tmp/cargo-home \
  --env HOME=/tmp/build-home \
  --mount "type=bind,source=$HOME/.cargo/registry,target=/tmp/host-cargo-registry" \
  --mount "type=bind,source=$HOME/.cache/mbx,target=/tmp/build-home/.cache/mbx" \
  builder \
  sh -c 'mkdir -p "$CARGO_HOME" && ln -s /tmp/host-cargo-registry "$CARGO_HOME/registry" && mbx build'
```

mbx map registry แยกจาก `CARGO_HOME` — cached inputs portable เมื่อ symlink resolve ออกนอก cargo home

## Write Policy (environment-enforced)

- Protected branch push (GitHub Actions/GitLab CI) → write ได้
- PRs (รวม forks), tag/release builds → read-only เสมอ แม้ config `read-write`
- Local builds → write เฉพาะ local store; remote ตาม mode + credentials
