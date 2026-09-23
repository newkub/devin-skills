# Missing API Detection Criteria

## UI Without API

- ตรวจหา UI components ที่เรียก API แต่ไม่มี endpoint
- เปรียบเทียบ UI fetch calls กับ API routes ที่มี
- ระบุ: form/button ที่เรียก endpoint ที่ไม่มี handler

## Database Without API

- ตรวจหา database tables ที่ไม่มี API endpoint จัดการ
- เปรียบเทียบ schema tables กับ API routes
- ระบุ: table ที่มี schema แต่ไม่มี CRUD endpoint

## Missing API Methods

- ตรวจหา: มี GET แต่ไม่มี POST/PUT/DELETE
- ตรวจหา: มี list endpoint แต่ไม่มี detail endpoint
- ตรวจหา: มี create แต่ไม่มี update/delete
- ตรวจหา: มี public endpoint แต่ไม่มี auth guard

## Missing API Validation

- ตรวจหา: endpoint ที่ไม่มี input validation
- ตรวจหา: endpoint ที่ไม่มี malformed JSON handling
- ตรวจหา: endpoint ที่ไม่มี ownership check
- ตรวจหา: endpoint ที่รับ userId จาก body แทน session

## Missing API Responses

- ตรวจหา: endpoint ที่ไม่มี error response format
- ตรวจหา: endpoint ที่ไม่มี proper status codes
- ตรวจหา: endpoint ที่ไม่มี pagination สำหรับ list

## Detection Tools

- `/scan-codebase` สำหรับค้นหา API routes, fetch calls
- เปรียบเทียบ route files กับ schema tables
- เปรียบเทียบ fetch calls ใน components กับ API handlers

## Severity

- Critical: ฟีเจอร์หลักที่ UI/database มีแล้วแต่ไม่มี API
- High: ฟีเจอร์สำคัญที่ API ไม่สมบูรณ์ (ขาด CRUD, ขาด validation, ขาด auth)
- Medium: ฟีเจอร์รองที่ API ยังไม่มี หรือมีบาง method
- Low: endpoint ที่ไม่จำเป็นต้องมีทุก method ตาม use case
