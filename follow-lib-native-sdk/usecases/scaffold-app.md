# Use Case — Scaffold, Check and Run a Native App

> Go from an empty directory to a running desktop window with the toolchain and manifest verified before the first build. Source: https://native-sdk.dev (accessed 2026-10-20)

## 1. Install the CLI and scaffold

```sh
npm install -g @native-sdk/cli
native version

native init my_app
cd my_app
```

The default `ts-core` template gives `app.json`, `src/app.native`, and `src/core.ts`. Variants:

```sh
native init my_app --template zig-core   # src/main.zig + src/tests.zig (Zig core)
native init my_app --frontend vite       # host a web frontend instead (next|vite|react|svelte|vue)
native init --full                       # adds app-owned build files + .github/workflows/ci.yml
```

`native init --full` is worth choosing on day one — the CI workflow is what runs the tiered test matrix later.

## 2. Verify the toolchain and manifest

```sh
native doctor
native validate app.json
```

`native doctor` reports Node, the pinned Zig toolchain, and platform prerequisites. Zig is downloaded into `~/.native/toolchains/` by the CLI, so a separate Zig install on `PATH` is not used and does not need to match.

## 3. Type-check the core before running

```sh
native check
```

This compiles `src/core.ts` against the supported subset — errors here are static, not runtime. Use `native check --strict` in CI so warnings fail the build too.

## 4. Run the app

```sh
native dev
```

The first run generates the build graph under `.native/build/`. Never edit that directory by hand; it is regenerated.

## 5. Lock behaviour with tests, then build

```sh
native test            # TS unit tests against @native-sdk/core/testing
native build           # ReleaseFast binary at zig-out/bin/
```

`native test` drives the same widgets a user would (`findWidget`, `click`, `setText`, `menu`, `snapshot`), so a green suite is a real interaction proof rather than a mock.

## 6. Know which language you are in

Run `ls src` first: `src/core.ts` means `ts-core`, `src/main.zig` means `zig-core`. The checker, the effect vocabulary, and the test harness all differ between them — mix them only via a documented webview/services boundary.

## Pitfalls

- Node 24+ is required for scaffold, check, and dev even though the shipped binary contains no JS runtime.
- Skipping `native validate app.json` moves manifest errors to build time, where the message is far less specific.
- Editing `.native/build/` or generated artifacts silently diverges from the source of truth and is lost on the next build.
- Ordinary TS syntax (regex, `Date`, `Map`, classes) in `core.ts` fails `native check` — that code belongs in `src/services/`.
- Treating mobile as production-ready: iOS/Android are experimental and verified on simulators/emulators only.
- Running a global `zig` out of habit instead of the CLI-managed toolchain produces version-mismatch errors.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/ts-core-subset.md`
- `best-practices/packaging-platform-security.md`
- `usecases/cmd-and-services.md`
