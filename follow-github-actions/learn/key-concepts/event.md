# Event

## ความหมาย

Event คือ trigger ที่เริ่ม workflow

## ประเภท

### Push Event

เมื่อ push code

```yaml
on:
  push:
    branches: [main]
```

### Pull Request Event

เมื่อสร้างหรืออัปเดต PR

```yaml
on:
  pull_request:
    branches: [main]
```

### Schedule Event

รันตามเวลาที่กำหนด (cron)

```yaml
on:
  schedule:
    - cron: '0 0 * * *'
```

### Manual Event

รันด้วยมือ

```yaml
on:
  workflow_dispatch:
```

### Multiple Events

```yaml
on: [push, pull_request]
```
