# Lib Esm Sh CLI

`esm.sh` CLI เป็น import maps manager สำหรับจัดการ `<script type="importmap">` ใน `index.html` (CLI v0.1.1, verified 2026-09-13)

## Install

```bash
npm install -g esm.sh                                    # via npm
npx esm.sh [command]                                     # run without install
curl -fsSL https://esm.sh/install | bash                 # macOS/Linux installer
go install github.com/esm-dev/esm.sh@latest              # from source (Go)
```

## Commands

```text
esm.sh add [...imports]   # Add imports to the "importmap" script in index.html
esm.sh tidy               # Clean up and optimize the "importmap" script in index.html
esm.sh --version, -v      # Show version
esm.sh --help, -h         # Display help
```

## Examples

```bash
npx esm.sh add react react-dom     # เพิ่ม entries ใน importmap ของ index.html
npx esm.sh tidy                    # จัดระเบียบ/optimize importmap
```

## Source

- Release notes: https://github.com/esm-dev/esm.sh/releases (CLI v0.1.1)
