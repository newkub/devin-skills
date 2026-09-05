# JSPM CLI Reference

> CLI `jspm` (4.x) สำหรับจัดการ `import maps` และ `native ES modules` โดยไม่ต้องใช้ `bundler`

## Installation

```bash
npm install -g jspm    # global install
npx jspm --version     # เรียกใช้แบบไม่ติดตั้ง
mise use -g npm:jspm   # ทางเลือกผ่าน mise
```

## Commands

| Command | Description |
|---------|-------------|
| `jspm init [name]` | สร้าง project ใหม่หรือ init ใน current directory |
| `jspm serve` | development server (default port `5776`) พร้อม hot reload และ auto install |
| `jspm serve --static` | static server ไม่มี hot reload |
| `jspm serve -p <port>` | กำหนด port |
| `jspm install [pkg]` | สร้าง/อัปเดต `importmap.js` จาก `package.json` |
| `jspm uninstall <pkg>` | ลบ package ออกจาก import map |
| `jspm build` | zero-config production build |
| `jspm link <pkg>` | link local package เข้า import map |
| `jspm help <command>` | แสดง help ของ command |

## Install Options

| Flag | Description |
|------|-------------|
| `-C, --conditions <list>` | conditional environment เช่น `-C production`, `-C development` |
| `--provider <name>` | CDN provider: `jspm.io` (default), `esm.sh`, `jsdelivr`, `unpkg`, `nodemodules` |
| `--integrity` | เพิ่ม `integrity` attribute (subresource integrity) ใน import map |
| `--preload` | เพิ่ม `modulepreload` links |
| `--release` | shorthand เปิด `flatten-scopes` + `combine-subpaths` + `production` conditions |
| `--map <file>` | input import map file |
| `-o, --out <file>` | output file เช่น `-o app.html` |
| `--dir <path>` | output directory เช่น `--dir dist` |

## Examples

```bash
jspm serve                              # dev server port 5776
jspm install lit@3                      # เพิ่ม package เข้า import map
jspm install -C production --integrity  # production map พร้อม SRI
jspm install --provider esm.sh          # เปลี่ยน CDN provider
jspm install --release -o index.html    # release map พร้อม preload
jspm build --output dist                # production build
```

ดูรายละเอียดเพิ่มเติมที่: https://jspm.org/docs/cli
