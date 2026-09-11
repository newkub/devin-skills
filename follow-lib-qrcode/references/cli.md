# Lib Qrcode CLI

## Commands

| Command | Description | Options |
|---|---|---|
| `qrcode "text"` | Print QR ใน terminal | -t terminal |
| `qrcode -o out.png "text"` | เซฟ PNG | -o, -w (width) |
| `qrcode -t svg "text"` | SVG output | -t svg/utf8/terminal |
| `qrcode --error H "text"` | Error correction | L/M/Q/H |

## Examples

```sh
bunx qrcode "https://example.com" -o qr.png -w 512
bunx qrcode "otpauth://totp/..."   # TOTP enroll QR
```
