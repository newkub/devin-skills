# Lib Qrcode API & Dependencies

## Install

```sh
bun add qrcode
bun add -D @types/qrcode   # TypeScript
```

## Version

- Latest: `1.5.4` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/qrcode)
- [Repository](https://github.com/soldair/node-qrcode)

## Dependencies

- Runtime: `dijkstrajs`, `pngjs`, `yargs` (CLI)
- Browser bundle แยก (`qrcode/build/qrcode.js`) ไม่ต้องการ canvas lib

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `QRCode.toDataURL(text, opts)` | Data URL (base64 png) | - | `width`, `margin`, `errorCorrectionLevel`, `color` |
| `QRCode.toString(text, {type:'svg'\|'terminal'\|'utf8'})` | String output | utf8 | - |
| `QRCode.toFile(path, text)` | Write PNG file | - | - |
| `QRCode.toCanvas(canvas, text)` | Browser canvas | - | - |
| `QRCode.create(text)` | Segment-level control | - | `segments` for mixed data |
| `qrcode` CLI | Terminal/file output | stdout | `-o file.png`, `-t svg` |

## Source

- Official docs: https://github.com/soldair/node-qrcode#readme
- Description: QR code generator — Node, browser, CLI.
