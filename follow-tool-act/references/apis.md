# Tool Act API & Dependencies

## Install

```sh
# act = nektos/act — Go binary สำหรับรัน GitHub Actions ใน local Docker
mise use -g act
# or
scoop install act
# or
winget install nektos.act
```

npm package `act` ไม่ใช่ตัวจริง — อย่าติดตั้ง

## Version

- Latest: ดู `act --version` หรือ https://github.com/nektos/act/releases
- [Repository](https://github.com/nektos/act)
- [Docs](https://nektosact.com)

## Dependencies

- ต้องมี Docker daemon รันอยู่ (pull `catthehacker/ubuntu:act-*` images)
- `.actrc` config file ใน project root สำหรับ default flags

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `act` | Run push event workflows | - | -j job, -W workflow |
| `act -l` | List jobs/workflows | - | - |
| `act push` / `pull_request` | Run specific event | - | -e event.json |
| `act -s GITHUB_TOKEN=...` | Pass secrets | - | --secret-file |
| `act -P ubuntu-latest=...` | Custom runner image | medium | catthehacker images |
| `act --container-daemon-socket -` | Skip Docker socket mount | - | - |

## Source

- Official docs: https://nektosact.com
- Description: Run GitHub Actions locally in Docker.
