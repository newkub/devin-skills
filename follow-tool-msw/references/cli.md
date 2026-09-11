# Tool Msw CLI

## Commands

| Command | Description | Options |
|---|---|---|
| `msw init <dir>` | สร้าง `mockServiceWorker.js` | --save (update package.json msw.workerDirectory) |
| `msw init <dir> --save` | Init + save dir ใน package.json | - |

## Examples

```sh
bunx msw init public/ --save
```

ส่วนใหญ่ใช้ API (`setupWorker`/`setupServer`) มากกว่า CLI
