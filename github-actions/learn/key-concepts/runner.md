# Runner

## ความหมาย

Runner คือ server ที่รัน jobs มีให้เลือกหลาย platforms

## ประเภท

### GitHub-hosted Runners

Runners จาก GitHub (ฟรีสำหรับ public repos)

```yaml
runs-on: ubuntu-latest
runs-on: windows-latest
runs-on: macos-latest
```

### Self-hosted Runners

Runners ที่ตั้งค่าเอง

```yaml
runs-on: self-hosted
runs-on: [self-hosted, linux]
```

## Spec Versions

```yaml
runs-on: ubuntu-22.04
runs-on: ubuntu-20.04
```
