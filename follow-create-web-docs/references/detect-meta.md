# Detect Metadata

## Repo Name

```bash
git remote get-url origin   # github.com/owner/repo → repo
```

fallback: `package.json` name, directory name

## Registry Badges

| Manifest | Registry | Link |
|----------|----------|------|
| `package.json` (ไม่ `private: true`) | npm | `npmjs.com/package/<name>` |
| `Cargo.toml` `[package]` | crates.io | `crates.io/crates/<name>` |
| `pyproject.toml` `[project]` | PyPI | `pypi.org/project/<name>` |

แสดง badge เฉพาะ registry ที่เจอ — ถ้าไม่มีเลยข้ามส่วนนี้

## Docs Detection

```bash
ls docs/**/*.md    # มี → docs pane + sidebar TOC
```

- glob `docs/**/*.md` เรียงตาม filename/heading
- อ่าน `# Title` แรกของแต่ละไฟล์เป็น sidebar label
- ไม่มี `docs/` → render README เท่านั้น (ไม่ต้องสร้าง pane ว่าง)
