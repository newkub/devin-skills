# Use Case — Distribution And Updates

> Compile one binary, wrap it with cargo-packager, then opt into signed auto-update from GitHub Releases. Source: https://gpuix.dev/docs (accessed 2026-10-23).

## 1. Compile A Single Binary

```bash
bun build --compile app.tsx --outfile dist/app
./dist/app
```

The binary carries the renderer, so it runs with no Bun and no Node install on the target machine.

## 2. Decide Between Bun And Hermes

Bun is the default: one binary, one file to ship. The Hermes path replaces the Bun runtime with a smaller JS engine plus a native sidecar `.node` next to the executable, and is the right choice when the download size matters more than the build simplicity.

| Path | Ship set |
| --- | --- |
| Bun | One compiled executable |
| Hermes | Executable plus the platform `.node` sidecar |

The Hermes guide covers the build steps. Both paths keep the same React or Solid app code.

## 3. Build The Icon As `.icns`

A raw Mach-O has no Dock icon. Create the iconset from a 1024 PNG, then convert.

```bash
mkdir AppIcon.iconset
sips -z 16 16 icon-1024.png --out AppIcon.iconset/icon_16x16.png
sips -z 32 32 icon-1024.png --out AppIcon.iconset/icon_16x16@2x.png
sips -z 32 32 icon-1024.png --out AppIcon.iconset/icon_32x32.png
sips -z 64 64 icon-1024.png --out AppIcon.iconset/icon_32x32@2x.png
sips -z 128 128 icon-1024.png --out AppIcon.iconset/icon_128x128.png
sips -z 256 256 icon-1024.png --out AppIcon.iconset/icon_128x128@2x.png
sips -z 256 256 icon-1024.png --out AppIcon.iconset/icon_256x256.png
sips -z 512 512 icon-1024.png --out AppIcon.iconset/icon_256x256@2x.png
sips -z 512 512 icon-1024.png --out AppIcon.iconset/icon_512x512.png
sips -z 1024 1024 icon-1024.png --out AppIcon.iconset/icon_512x512@2x.png
iconutil -c icns AppIcon.iconset -o AppIcon.icns
```

Pass the `.icns` to the packager. A 1024 PNG is rejected with `No matching IconType`.

## 4. Write `packager.json`

```json
{
  "productName": "My App",
  "version": "0.1.0",
  "identifier": "dev.example.app",
  "binariesDir": "dist",
  "outDir": "bundle",
  "binaries": [{ "path": "app", "main": true }],
  "icons": ["AppIcon.icns"],
  "formats": ["app"]
}
```

```bash
cargo install cargo-packager --locked
cargo packager --release --config packager.json
open "bundle/My App.app"
```

For Hermes, list the `.node` as a second binary rather than a resource. `dlopen` looks in `Contents/MacOS`, while resources land in `Contents/Resources`.

```json
{
  "binaries": [
    { "path": "gpuix-hermes", "main": true },
    { "path": "gpuix-native.darwin-arm64.node", "main": false }
  ]
}
```

## 5. Pack For The Host OS Only

`formats` names the formats for the machine that runs the packager. Cross-compilation is not part of this flow, so run it on each OS you ship.

| OS | `formats` | Output |
| --- | --- | --- |
| macOS | `"app"`, then `"dmg"` | `.app`, optional `.dmg` |
| Windows | `"nsis"` | setup `.exe` |
| Linux | `"appimage"` | `.AppImage` |

`--release` is the packager profile and expects a release binary in `binariesDir`. It is not `cargo build --release`.

## 6. Ship The Asset Names The Updater Expects

Create the GitHub release first, then pack, sign, and upload. With `productName: "My App"`, `version: "0.1.0"`, and a binary stem of `app`:

| OS | Files in `outDir` |
| --- | --- |
| macOS | `My App.app`, then on sign `My App.app.tar.gz` + `My App.app.tar.gz.sig` |
| Linux | `app_0.1.0_x86_64.AppImage` + `.sig` |
| Windows | `app_0.1.0_x64-setup.exe` + `.sig` |

```bash
bun build --compile app.tsx --outfile dist/app
cargo packager --release --config packager.json
gh release upload v0.1.0 \
  "bundle/My App.app.tar.gz" \
  "bundle/My App.app.tar.gz.sig" \
  --clobber
```

The macOS updater wants the `.app.tar.gz`, not the `.app` and not the `.dmg`. Linux and Windows asset names use the binary stem, not `productName`. NSIS uses `x64`, not `x86_64`. Do not upload a feed JSON.

## 7. Turn On Signed Auto-Update

Packaging does not enable updates. The running app calls `checkUpdate` on `@gpuix/native`, which hits the GitHub Releases API, reads `tag_name` and `assets`, then GETs the sibling `.sig`.

```bash
cargo packager signer generate
```

Store the private key and password as repo secrets `CARGO_PACKAGER_SIGN_PRIVATE_KEY` and `CARGO_PACKAGER_SIGN_PRIVATE_KEY_PASSWORD`. Signing is automatic when both are set. Put only the public key in the app.

```tsx
import { checkUpdate } from '@gpuix/native'
import { render } from '@gpuix/react'
import { App } from './app'

async function maybeUpdate() {
  const update = await checkUpdate('0.1.0', {
    endpoints: ['https://github.com/OWNER/REPO/releases/latest'],
    pubkey: '<public key from signer generate>',
  })
  if (update) await update.downloadAndInstall()
}

maybeUpdate()
render(<App />)
```

`downloadAndInstall()` replaces the bundle but does not relaunch. The repository must be public for the updater to read the release, and no update path exists in the wasm build.

## Pitfalls

- Shipping the `.app` or `.dmg` to the macOS updater silently breaks updates; only the signed `.app.tar.gz` works.
- A missing sibling `.sig` is an error, not a warning. Publish both files together.
- `cargo packager` without `--release` packs the wrong profile and can miss the compiled binary.
- Passing a PNG to `icons` fails. Convert to `.icns` first.
- Putting the Hermes `.node` in resources makes `dlopen` fail at runtime.
- The auto-updater in a private repo returns nothing useful; publish to a public repository.
- `checkUpdate` before `render()` does not block startup, but an unhandled rejection inside `maybeUpdate()` will be silent. Catch and surface it.

## Related

- [cli.md](../references/cli.md)
- [shipping-and-hot-reload.md](../best-practices/shipping-and-hot-reload.md)
- [runtime-and-rendering.md](../best-practices/runtime-and-rendering.md)
- [desktop-quickstart.md](./desktop-quickstart.md)
- [agent-driven-verification.md](./agent-driven-verification.md)
