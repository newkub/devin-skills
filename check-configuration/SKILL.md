---
name: check-configuration
description: ตรวจสอบ config files และ environment variables
---

## Goal

ตรวจสอบ configuration files และ environment variables ครบถ้วน

## Execute

### 1. Check Config Files

1. ตรวจสอบ config files ครบถ้วน
2. ตรวจสอบ config files ถูกต้อง
3. ตรวจสอบ config files สม่ำเสมอ
4. ตรวจสอบ config files ไม่มี sensitive data

### 2. Check Environment Variables

1. ตรวจสอบ environment variables ครบถ้วน
2. ตรวจสอบ environment variables ถูกต้อง
3. ตรวจสอบ environment variables มี default values
4. ตรวจสอบ environment variables ถูก document

### 3. Check Config Validation

1. ตรวจสอบ config validation rules
2. ตรวจสอบ config schema validation
3. ตรวจสอบ config type checking
4. ตรวจสอบ config error messages

### 4. Check Config Consistency

1. ตรวจสอบ config consistency ระหว่าง environments
2. ตรวจสอบ config consistency ระหว่าง services
3. ตรวจสอบ config consistency ระหว่าง deployments
4. ตรวจสอบ config drift detection

### 5. Check Config Security

1. ตรวจสอบ secrets ไม่อยู่ใน config files
2. ตรวจสอบ config files ไม่ถูก commit
3. ตรวจสอบ config file permissions
4. ตรวจสอบ config encryption

### 6. Check Config Documentation

1. ตรวจสอบ config documentation ครบถ้วน
2. ตรวจสอบ config examples
3. ตรวจสอบ config templates
4. ตรวจสอบ config changelog

## Rules

### 1. Config File Structure

- ใช้ config files สำหรับ environment-specific settings
- ใช้ environment variables สำหรับ secrets
- ใช้ default values สำหรับ optional settings
- ใช้ validation สำหรับ config values

### 2. Environment Variables

- ตั้งชื่อ environment variables ชัดเจน
- ให้ default values สำหรับ development
- Document ทุก environment variables
- ใช้ prefix สำหรับ grouping

### 3. Config Security

- ไม่ commit secrets ไปยัง version control
- ใช้ .env.example สำหรับ template
- ใช้ secret management สำหรับ production
- ตั้งค่า file permissions อย่างเหมาะสม

### 4. Priority Levels

- Critical: config ขาดสำคัญ
- High: config ไม่ถูกต้อง
- Medium: config ไม่มี documentation
- Low: เป็น config optimizations

## Expected Outcome

- Config files ครบถ้วนและถูกต้อง
- Environment variables ครบถ้วนและถูกต้อง
- Config validation ทำงานได้
- Config consistency สม่ำเสมอ
- Config security ปลอดภัย
- Config documentation ครบถ้วน
