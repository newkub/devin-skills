# Tool Linter Routes / Topics

Skill นี้เป็น generic linter guide — routes ด้านล่างรวม docs ของ linter ที่ใช้บ่อยตาม tech stack

## oxlint (oxc.rs)

| Route / Topic | URL |
|---|---|
| Linter guide | https://oxc.rs/docs/guide/usage/linter |
| Config (`.oxlintrc.json`) | https://oxc.rs/docs/guide/usage/linter/config |
| Rules list | https://oxc.rs/docs/guide/usage/linter/rules |
| Type-aware linting (`oxlint-tsgolint`) | https://oxc.rs/docs/guide/usage/linter-type-aware |

## ESLint (eslint.org)

| Route / Topic | URL |
|---|---|
| Getting started | https://eslint.org/docs/latest/use/getting-started |
| Configure (flat config) | https://eslint.org/docs/latest/use/configure |
| CLI reference | https://eslint.org/docs/latest/use/command-line-interface |
| Migrate to v10 | https://eslint.org/docs/latest/use/migrate-to-10.0.0 |

## Biome (biomejs.dev)

| Route / Topic | URL |
|---|---|
| Linter | https://biomejs.dev/linter/ |
| Rules | https://biomejs.dev/linter/rules/ |
| CLI reference | https://biomejs.dev/reference/cli/ |

## Others

| Tool | URL |
|---|---|
| clippy (Rust) | https://doc.rust-lang.org/clippy/ |
| ruff (Python) | https://docs.astral.sh/ruff/linter/ |
| golangci-lint (Go) | https://golangci-lint.run/docs/ |

## Key Concepts

- เลือก linter ตาม tech stack; ถ้า project มีอยู่แล้วใช้ตัวเดิม — skill เฉพาะทาง: `/follow-tool-eslint`, `/follow-tool-biome`
- CI รัน check mode เท่านั้น (`--max-warnings 0` สำหรับ zero-warning gate); `--fix` ทำใน local/hooks
- git hooks สำหรับ staged-file lint: repo ที่มี `.moon/workspace.yml` → moon `vcs.hooks`; repo อื่น → `/follow-tool-hk`
