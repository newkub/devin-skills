# Recording, Replay, and Rerun

## Overview

Recording, Replay, และ Rerun เป็น experimental features ของ Nextest ที่ช่วยให้ capture และ store ข้อมูล test run ทั้งหมด เพื่อใช้สำหรับการวิเคราะห์ภายหลัง, replay, และ rerun tests ที่ล้มเหลวเฉพาะ

## Why Recording?

การบันทึก test run มีประโยชน์หลายอย่าง:

- **Iterative Debugging**: เรียกดูข้อมูล test run ก่อนหน้าได้โดยไม่ต้องรันใหม่ทั้งหมด
- **Targeted Reruns**: Rerun เฉพาะ tests ที่ล้มเหลวจาก run ก่อนหน้า
- **Historical Analysis**: วิเคราะห์ patterns ของ test failures และ flaky tests
- **Performance Tracking**: เปรียบเทียบ performance ของ tests ระหว่าง runs ต่างๆ

## How Recording Works

Nextest บันทึกข้อมูล test run ลงใน 3 ส่วนหลัก:

```
.nextest/
├── runs.json.zst           # Global index ของ test runs
├── events.jsonl.zst       # Event log ของ test events
└── outputs.zip            # Captured outputs จาก tests
```

### Data Components

**runs.json.zst**
- Global index ที่เก็บ metadata ของทุก test runs
- รวมถึง timestamps, test counts, และ statuses
- Compressed เพื่อประหยัดพื้นที่

**events.jsonl.zst**
- Event log ที่บันทึกทุก test events แบบ chronological
- รวมถึง test start, completion, retries, และ failures
- JSONL format (one JSON object per line) สำหรับ efficient parsing

**outputs.zip**
- Captured stdout/stderr จากแต่ละ test
- Compressed เพื่อลดขนาด
- Indexed โดย test ID

## Enabling Recording

เปิดใช้งาน recording ผ่าน configuration:

```toml
# .config/nextest.toml
[profile.default]
store-success-output = true  # Store output สำหรับ passing tests
store-failure-output = true  # Store output สำหรับ failing tests
```

หรือใช้ command line:

```bash
cargo nextest run --record
```

## Replay

Replay ใช้สำหรับเรียกดู test run ที่บันทึกไว้:

```bash
# Replay test run ด้วย run ID
cargo nextest replay <RUN_ID>

# Replay จาก archive file
cargo nextest replay <RUN_ID> --archive-file archive.tar.zst
```

### Finding Run IDs

List test runs ที่บันทึกไว้:

```bash
# List recent runs
cargo nextest list-runs

# List runs พร้อม details
cargo nextest list-runs --verbose
```

## Rerun

Rerun ใช้สำหรับรัน tests อีกครั้งโดยใช้ข้อมูลจาก run ก่อนหน้า:

```bash
# Rerun tests จาก latest run
cargo nextest run -R latest

# Rerun เฉพาะ failing tests จาก latest run
cargo nextest run -R latest --failed

# Rerun tests จาก specific run ID
cargo nextest run -R <RUN_ID>
```

## Use Cases

### 1. Debugging Flaky Tests

```bash
# Run tests ด้วย recording
cargo nextest run --record

# ถ้ามี flaky test, rerun เฉพาะ test นั้น
cargo nextest run -R latest --failed
```

### 2. CI Failure Investigation

```bash
# ใน CI, archive test run
cargo nextest run --profile ci --archive-file ci-archive.tar.zst

# ใน local, replay เพื่อ investigate
cargo nextest replay <RUN_ID> --archive-file ci-archive.tar.zst
```

### 3. Performance Regression Detection

```bash
# Run tests และ record
cargo nextest run --record

# เปรียบเทียบ durations ระหว่าง runs
cargo nextest list-runs --verbose
```

## Configuration Options

```toml
[profile.default]
# Control output storage
store-success-output = true
store-failure-output = true

# Recording settings
[profile.default.recording]
path = ".nextest"  # Path สำหรับ store recordings
```

## Best Practices

1. **Enable in CI**: เปิด recording ใน CI เพื่อ debug failures ใน local
2. **Archive Regularly**: Archive test runs เป็นประจำสำหรับ historical analysis
3. **Clean Old Runs**: ลบ recordings เก่าๆ เพื่อประหยัด disk space
4. **Use with Retries**: รวม recording กับ retry policies สำหรับ flaky tests

## Limitations

- **Experimental Feature**: Recording/replay เป็น experimental และอาจเปลี่ยนใน future versions
- **Disk Space**: Recordings ใช้พื้นที่ disk มาก โดยเฉพาะ outputs
- **Binary Compatibility**: Recordings อาจไม่ compatible ระหว่าง nextest versions ต่างๆ

## See Also

- [Archiving](./archiving.md) - สำหรับ portable test builds
- [Test Groups](./test-groups.md) - สำหรับ test organization
- [Configuration](../guide/configuration.md) - สำหรับ setup options
