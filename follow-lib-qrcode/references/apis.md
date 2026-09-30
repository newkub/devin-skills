| key | value |
|---|---|
| version | 1.5.4 |
| package registry | https://www.npmjs.com/package/qrcode |
| repository | https://github.com/soldair/node-qrcode |
| docs | https://github.com/soldair/node-qrcode#readme |

| api | description | default | options |
|---|---|---|---|
| `QRCode.toDataURL(text, opts)` | Data URL (base64 png) | - | `width`, `margin`, `errorCorrectionLevel`, `color` |
| `QRCode.toString(text, {type:'svg'\|'terminal'\|'utf8'})` | String output | utf8 | - |
| `QRCode.toFile(path, text)` | Write PNG file | - | - |
| `QRCode.toCanvas(canvas, text)` | Browser canvas | - | - |
| `QRCode.create(text)` | Segment-level control | - | `segments` for mixed data |
| `qrcode` CLI | Terminal/file output | stdout | `-o file.png`, `-t svg` |
