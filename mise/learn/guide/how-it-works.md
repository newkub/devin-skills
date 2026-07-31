# วิธีการทำงาน

## Architecture

```
┌─────────────────────────────────────────┐
│           Shell Integration            │
│  (mise activate → modify PATH/env)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Configuration Layer           │
│  (.mise.toml + global config)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Plugin System                │
│  (download, install, version check)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Tool Storage                   │
│  (~/.local/share/mise/versions)         │
└─────────────────────────────────────────┘
```

## Workflow

1. **Detection** - mise อ่าน `.mise.toml` เมื่อเข้า directory
2. **Resolution** - resolve tool versions จาก config hierarchy
3. **Installation** - install tools ถ้ายังไม่มี
4. **Activation** - modify PATH และ environment variables
5. **Execution** - รัน commands ด้วย correct versions

## Version Resolution

```
.mise.toml → Global Config → Environment → Default
```

- Project config มี priority สูงสุด
- สามารถ override ด้วย environment variables
- Fallback ไปยัง default versions ถ้าไม่ระบุ
