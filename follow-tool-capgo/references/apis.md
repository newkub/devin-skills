# Tool Capgo API & Dependencies

## Install

```sh
# Capgo CLI (live update สำหรับ Capacitor apps)
bun add -D @capgo/cli
```

## Version

- `@capgo/cli`: `8.50.3` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/@capgo/cli)
- [Repository](https://github.com/Cap-go/capgo)

## Dependencies

- ต้องมี Capgo account + `CAPGO_TOKEN` (หรือ login ผ่าน CLI)
- Capacitor project — `@capacitor/core` + `@capgo/capacitor-updater` plugin ใน app

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `bunx capgo init` | Setup Capgo ใน project | - | --apikey |
| `bunx capgo login` | Auth | - | --apikey |
| `bunx capgo bundle upload` | Upload bundle | - | --channel, --path |
| `bunx capgo channel set` | Set channel for device/version | - | --channel, --latest |
| `bunx capgo app add` | Register app | - | --name, --icon |
| `bunx capgo key save` | Store encryption/signing key | - | --key, --force |

## Source

- Official docs: https://capgo.app/docs
- Description: Capgo — live updates (OTA) สำหรับ Capacitor apps.
