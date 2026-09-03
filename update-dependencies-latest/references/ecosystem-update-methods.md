# Ecosystem Update Methods

| Ecosystem | Method |
|-----------|--------|
| Bun/Node | `bunx taze` ถ้ามี, มิฉะนั้น `bun update --latest` หรือ query `registry.npmjs.org` |
| Rust | `cargo update` + query `crates.io/api/v1/crates/<crate>` |
| Python | query `pypi.org/pypi/<pkg>/json` แล้วอัปเดท `pyproject.toml` / `requirements.txt` |
| Go | `go get -u ./...` + `go list -m -u all` |
| Docker/CI | แก้ `FROM` tag ด้วย Docker Hub API และ `uses:` ใน workflows ด้วย GitHub API |
