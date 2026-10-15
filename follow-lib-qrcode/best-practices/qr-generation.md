# Best Practices: qrcode (QR Code Generation)

Guidance for generating QR codes that really scan — output matching the consumer and appropriate sizing

## Recommended Patterns

- Pick the output per consumer: `toDataURL` for inline `<img>`, `toBuffer` for download/API binary, `toString({type:'svg'})` for vector/scalable
- Set `errorCorrectionLevel` per use case — `M` default is fine, `Q`/`H` when overlaying a logo or printing at risk of damage
- `margin` of at least 2 (quiet zone) — many scanners reject a QR flush to the edge
- Make `width` big enough to scan — ~200px+ recommended on screen; print depends on real size and scan distance
- Use `QRCode.create` + segments when fine control is needed (mixed alphanumeric/binary, optimal encoding)
- Test real scanning with a camera/app — the generator output can be correct yet contrast/size/quiet zone wrong, and it won't scan

## Do / Don't

| Do | Don't |
|---|---|
| `toBuffer` + `Content-Type: image/png` in APIs | send a base64 dataURL when the client needs binary |
| Increase `errorCorrectionLevel` when overlaying a logo | place a big logo on a level L QR — modules get covered, scan breaks |
| Keep payloads short — QR capacity is ~4KB binary, but much less in practice for easy scanning | embed large JSON — a dense QR is hard to scan |
| Use SVG for print/high-res | send a low-resolution PNG off to print |
| Set margin ≥2 modules | crop the QR flush to the edge for looks |

## Common Pitfalls

- Data too large — max QR version is ~40; a 4KB binary payload is fully maxed and very dense, hard to scan; serve a URL instead of embedding data
- Low `errorCorrectionLevel` + logo overlay = scan failure — module redundancy compensates for the covered area
- Margin/quiet zone lost when CSS crops or the background touches the edge — scanners reject
- Low contrast — `color.dark`/`color.light` must differ clearly; a light QR on a white background fails
- SVG without a `width` attribute → broken responsiveness; add width/height or control it with CSS
- Terminal output `toString({type:'terminal'})` suits debugging, not production

## Performance Notes

- Generation is fast — not a bottleneck; the async API (`toDataURL`) does not block the event loop for normal cases
- `toBuffer` for server-side binary — ~33% smaller than a base64 dataURL
- Cache generated QRs when payloads repeat — deterministic output for the same input
- `QRCode.create` separates encode/render — reuse segments when batch generating

## Ecosystem / Integration

- TOTP enrollment QR → build the `otpauth://` with `/follow-lib-otplib` `generateURI`, then render it here
- The `qrcode` CLI for quick terminal/file output — see `references/cli.md`
- For URL/short-link QRs — check the URL is reachable before generating
- Printable labels/tickets — SVG + error correction Q/H works best
