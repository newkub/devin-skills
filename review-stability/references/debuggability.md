# Debuggability Checks

## Logging Quality

- ตรวจสอบ logging มี context ครบถ้วน
- ตรวจสอบใช้ structured logging
- ตรวจสอบ log levels ที่เหมาะสม (`debug`, `info`, `warn`, `error`)
- ตรวจสอบ timestamps และ correlation IDs
- ระบุ logging ที่ซ้ำซ้อน

## Error Messages

- ตรวจสอบ error messages ชัดเจนและเป็นประโยค
- ตรวจสอบมี context ที่เกี่ยวข้อง
- ตรวจสอบระบุสาเหตุและวิธีแก้ไข
- ตรวจสอบใช้ typed error classes
- ระบุ generic error messages ที่ไม่มีประโยชน์

## Naming And Complexity

- ตรวจสอบ naming บ่งบอกถึง purpose
- ตรวจสอบ verbs สำหรับ functions, nouns สำหรับ variables และ types
- ตรวจสอบ abbreviations ที่ไม่ชัดเจน
- ตรวจสอบ nesting levels สูงสุด 3 levels
- ตรวจสอบ functions ที่ยาวกว่า 50 บรรทัด
- ตรวจสอบ early returns และ guard clauses

## Debuggability Score Dimensions

- logging quality
- error message clarity
- naming
- complexity

## Severity Mapping

- critical: no logging
- high: generic errors
- medium: poor naming
- low: high complexity
