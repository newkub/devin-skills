| command | description | options |
|---|---|---|
| `native init <name>` | scaffold a new app | `--template ts-core\|zig-core`, `--frontend next\|vite\|react\|svelte\|vue`, `--full` |
| `native dev` | dev run with incremental rebuild | |
| `native build` | ReleaseFast build into `zig-out/bin/` | `-Dautomation=true`, `-Dplatform=null` (headless CI) |
| `native check [--strict]` | type-check the compiled core subset | `--strict` |
| `native test` | run the TS unit tests (`@native-sdk/core/testing`) | |
| `native validate app.json` | validate the manifest | |
| `native doctor` | check Zig/Node toolchain health | |
| `native package --target <t>` | package an artifact | `macos\|linux\|windows\|ios\|android`, `--archive`, `--signing adhoc\|identity`, `--identity`, `--entitlements`, `--notarize`, `--notary-profile` |
| `native db new-migration\|status\|reset` | SQLite migration workflow | `reset --yes` |
| `native automate <cmd>` | drive a build made with `-Dautomation=true` | `list`, `snapshot`, `screenshot`, `reload`, `assert [--timeout-ms]`, `widget-click`, `menu-command`, `shortcut`, `bridge '<json>'` |
| `native update keygen\|sign` | Ed25519 update manifest tooling (macOS only) | |
| `native skills get <name>` | vendor deep docs from the installed CLI | `core`, `native-ui`, `ts-core`, `ts-services`, `automation`, `zig` |
| `native version` | print the CLI version | |

| env var | meaning |
|---|---|
| `NATIVE_SDK_SESSION_RECORD=1` | record an automation session for replay |
| `NATIVE_SDK_SESSION_REPLAY=1` | replay a recorded session |
