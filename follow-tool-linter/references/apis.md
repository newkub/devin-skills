# Tool Linter API & Dependencies

Skill นี้เป็น generic linter guide — ไม่มี package เดียวชื่อ `linter` (npm `linter` เป็น package เก่าที่เลิกดูแล); เลือกตัวจริงตาม tech stack:

## Install

```sh
# TypeScript/JavaScript (เลือกตัวเดียว)
bun add -D oxlint               # 1.82.0 — Rust, fastest
bun add -D @biomejs/biome       # 2.5.13 — lint+format
bun add -D eslint               # 10.10.0 — ecosystem กว้างสุด

# Rust
rustup component add clippy

# Python
pipx install ruff               # ruff check

# Go — ติดตั้ง golangci-lint ผ่าน mise
mise use -g golangci-lint
```

## Version

- oxlint `1.82.0`, biome `2.5.13`, eslint `10.10.0` (verified 2026-09-11)
- [oxlint](https://oxc.rs) / [biome](https://biomejs.dev) / [eslint](https://eslint.org)

## Dependencies

- oxlint/biome เป็น Rust binaries — zero-config เร็ว
- eslint ต้อง config (`eslint.config.*` flat config) + plugins

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `bunx oxlint` | Lint ด้วย oxlint | src | --fix, --deny-warnings |
| `bunx biome check` | Lint+format check | all files | --write, --fix |
| `bunx eslint .` | Lint ด้วย ESLint | flat config | --fix, --max-warnings |
| `cargo clippy` | Lint Rust | all targets | -- -D warnings |
| `ruff check` | Lint Python | current dir | --fix, --select |

## Source

- เลือก tool ตาม `/follow-tool-eslint`, `/follow-tool-biome` หรือ official docs ของแต่ละตัว
