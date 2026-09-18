# File Upload Security Validation Rules

## File Type Validation

- ตรวจ MIME type validation: validate `Content-Type` header
- ตรวจ magic number: validate file signature, ไม่ rely ที่ extension อย่างเดียว
- ตรวจ extension allowlist: allowlist เฉพาะ safe extension — ห้าม blacklist
- ตรวจ double extension: ไม่ allow `.jpg.exe`, `.png.php`
- Detection: `grep` หา `mimetype`, `contentType`, file upload handler

## File Size Limit

- ตรวจ max size: ระบุ max size, reject ถ้าเกิน
- ตรวจ multipart limit: `limit` ใน multipart config
- ตรวจ streaming upload: ใช้ streaming สำหรับไฟล์ใหญ่, ไม่ load ทั้งไฟล์ใน memory
- ตรวจ early rejection: reject ก่อน consume ทั้งไฟล์

## Filename Sanitization

- ตรวจ path traversal: ไม่ allow `..`, `/`, `\` ใน filename
- ตรวจ null byte: ไม่ allow null byte ใน filename
- ตรวจ double extension: ไม่ allow double extension
- ตรวจ rename: generate new filename (UUID, nanoid) — ไม่ใช้ user filename
- Detection: `grep` หา `filename`, `originalname` ใน upload handler

## Storage

- ตรวจ isolated directory: upload ไปยัง isolated directory, ไม่ใช่ app directory
- ตรวจ no execute permission: `chmod 644`, ไม่ `755`
- ตรวจ CDN serving: serve ผ่าน CDN, ไม่ใช่ app server
- ตรวจ no inline: `Content-Disposition: attachment` สำหรับ download

## Access Control

- ตรวจ authenticated upload: ต้อง login ก่อน upload
- ตรวจ ownership check: verify ownership ก่อน download/delete
- ตรวจ download authorization: authorize ก่อน serve file
- ตรวจ signed URL: ใช้ signed URL สำหรับ temporary access

## Virus Scanning

- ตรวจ malware scan: scan ทุกไฟล์ก่อน store
- ตรวจ sandbox execution: ไม่ execute uploaded file โดยตรง
- ตรวจ scan result handling: reject ถ้า scan พบ malware
- Detection: `grep` หา `clamav`, `virusScan`, `malwareScan`

## Severity Criteria

- Critical: unrestricted file upload, executable upload, path traversal in filename, no size limit, no access control
- High: missing MIME validation, missing magic number check, missing virus scan, weak access control, missing ownership check
- Medium: missing signed URL, suboptimal storage, missing Content-Disposition
- Low: documentation gap, minor naming
