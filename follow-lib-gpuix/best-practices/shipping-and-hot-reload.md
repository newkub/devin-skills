# Best Practices — Shipping And Hot Reload

From save to a signed `.app`. The dev loop is a JS remount on a live native
host; the ship step is one compiled binary wrapped by cargo-packager, with
auto-update left opt-in and signed.

## 1. Hot Reload Is A Remount, Not React Refresh

`bun --hot app.tsx` re-runs the entry on every save, and `render()` remounts the
React tree on the same window.

```
save .tsx  ►  bun re-evaluates the entry  ►  render() remounts React
                     │
                     ▼
              GpuixRenderer, window, GPU stay
```

| Stays | Resets |
|-------|--------|
| Window, GPU device, native `.node` addon, GPUI scroll physics | `useState`, focus, React event handlers |

Keeping hook state needs Bun to inject `$RefreshReg$` during `--hot`, which
only exists under `bun build --react-fast-refresh`. Until then, design for a
remount: keep durable state outside the component (module scope, a store, or
persisted input) when losing it on save would be annoying.

A plain `bun app.tsx` (or `tsx`) starts a second process on save instead of
remounting.

## 2. Keep One render Call In The Entry

```tsx
render(<App />, { title: 'My App', width: 1000, height: 700 })
```

- `render()` is idempotent: the first call creates the native host and stores
  it on `globalThis`; later calls remount.
- Never call `createRenderer()` or `init()` in the app entry. Under `--hot`
  the whole file re-runs, and a second `init()` opens a second window.
- Use `createRenderer()`, `createRoot()`, and `startFrameLoop()` only for tests
  or a custom host.
- A runtime throw does not freeze the window: the frame loop catches `tick()`
  errors, native callbacks catch handler throws, and the window shows the stack
  with a Reload button that remounts the last tree.

## 3. The Native Half Has No Hot Reload

There is no hot reload for the Rust side and there cannot be: `require()` of a
`.node` file calls `process.dlopen`, Node has no matching unload, and the live
state (GPUI platform, GPU device, open window, UI thread, selection registry)
lives inside the loaded library.

The rebuild is fast enough not to matter. A Rust edit to fresh screenshots is
roughly four seconds:

```bash
cargo check --lib                # ~1.5s
cargo build --lib                # ~4.9s
bun run build:debug              # napi, ~2s
bun scripts/dev.ts --shots diff  # only tests matching "diff"
```

`bun run dev` wires that into one loop: watch `packages/native/src`, rebuild,
re-render the showcase screenshots.

## 4. Compile A Binary Before Packaging

```bash
bun build --compile app.tsx --outfile dist/app        # macOS/Linux
bun build --compile app.tsx --outfile dist/app.exe    # Windows
```

The binary carries the renderer, so it runs with no Bun and no Node install.

For a smaller ship set, run the same React app on hermes-node instead of Bun:
that path is 12 MB plus a 22 MB native sidecar. On the machine where this was
measured, the Bun chat `.app` was 82 MB and the Hermes counter `.app` was 34 MB.

## 5. Wrap It With cargo-packager

```bash
cargo install cargo-packager --locked
cargo packager --release --config packager.json
```

`--release` is the packager profile (look in `binariesDir` for a release
binary). It is not `cargo build --release`.

- Pass an `.icns`, not a 1024 PNG. cargo-packager rejected a 1024 PNG with
  `No matching IconType`. Build the iconset with `sips` at every size, then
  `iconutil -c icns AppIcon.iconset -o AppIcon.icns`.
- `binaries: [{ "path": "app", "main": true }]` for the Bun binary.
- Hermes needs the `.node` next to the exe. List it as a second binary, not a
  resource: resources go in `Contents/Resources`, while `dlopen` looks in
  `Contents/MacOS`.

```json
{
  "binaries": [
    { "path": "gpuix-hermes", "main": true },
    { "path": "gpuix-native.darwin-arm64.node", "main": false }
  ]
}
```

Packager only builds the host OS. Run it on macOS, Linux, and Windows.

| OS      | `formats`             | Output                  |
|---------|-----------------------|-------------------------|
| macOS   | `"app"`, then `"dmg"` | `.app`, optional `.dmg` |
| Windows | `"nsis"`              | setup `.exe`            |
| Linux   | `"appimage"`          | `.AppImage`             |

## 6. Auto-Update Is Opt-In And Signed

Packaging does not turn on updates. The running app calls `checkUpdate` on
`@gpuix/native`; HTTP reuses the same `reqwest_client` as `<img>`, so there is
no second native addon.

Sign once with `cargo packager signer generate`, store the private key and its
password as repo secrets (`CARGO_PACKAGER_SIGN_PRIVATE_KEY`,
`CARGO_PACKAGER_SIGN_PRIVATE_KEY_PASSWORD`), and put the public key in the app.

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

Host on GitHub Releases: create the release, then pack and upload the bundle
plus its sibling `.sig`.

| OS      | Upload |
|---------|--------|
| macOS   | `My App.app.tar.gz` + `.sig` |
| Linux   | `app_0.1.0_x86_64.AppImage` + `.sig` |
| Windows | `app_0.1.0_x64-setup.exe` + `.sig` |

- The macOS updater wants the `.app.tar.gz`, not the `.app` and not a `.dmg`.
  Packager only tars the `.app` when it signs.
- Linux and Windows asset names use the binary stem (`app`), not
  `productName`. NSIS arch is `x64`, not `x86_64`.
- A missing sibling `.sig` is an error.
- `downloadAndInstall()` replaces the packaged files but does not relaunch.
  Quit after it returns, or the next start uses the new app.
- The repo must be public or GitHub 404s the API.
- HTTPS lives in the native crate, so auto-update works on Bun and hermes-node
  but not in the browser wasm build.
- Do not upload a feed JSON; the updater reads GitHub's release JSON.

## 7. Verify The Ship

- Run the app from the packaged bundle, not only from `bun --hot` — icon, title
  bar, bundle id, and code signing only exist in the wrapped app.
- Check that the platform binary resolved: a missing optional dep package
  fails at import, not at install.
- Confirm the update path on a real release, with the public key that shipped.
  An unsigned build silently has no update channel.

## Pitfalls

- Calling `createRenderer()` or `init()` in the entry — a second window on
  every save.
- Expecting hook state to survive `--hot` — it is a remount; only the native
  host persists.
- Expecting Rust edits to hot reload — rebuild; the addon cannot unload.
- Passing a PNG to cargo-packager — build an `.icns` first.
- Putting the Hermes `.node` in resources — `dlopen` looks beside the exe.
- Packaging on one OS for all three — packager builds the host only.
- Uploading a `.dmg` or the bare `.app` for the macOS updater — it wants
  `.app.tar.gz` plus `.sig`.
- Naming assets after `productName` on Linux/Windows — they use the binary
  stem.
- Forgetting to quit after `downloadAndInstall()` — the old process keeps
  running.
- Enabling auto-update against a private repo — GitHub returns 404.

## Related

- [apis.md](../references/apis.md)
- [cli.md](../references/cli.md)
- [runtime-and-rendering.md](runtime-and-rendering.md)
- [../usecases/distribution-and-updates.md](../usecases/distribution-and-updates.md)
