# Action

## ความหมาย

Action คือ reusable unit ของ code สามารถใช้ซ้ำได้ มีทั้ง official actions และ community actions

## ประเภท

### Official Actions

Actions จาก GitHub

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/cache@v3
```

### Community Actions

Actions จาก community

```yaml
- uses: username/action-name@v1
```

### Custom Actions

Actions ที่เขียนเอง

```yaml
- uses: ./.github/actions/my-action
```

## Parameters

- **with**: inputs สำหรับ action
- **env**: environment variables สำหรับ step
