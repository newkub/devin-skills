# Security

## TanStack Query Security

- **Sensitive Data** - ไม่ cache sensitive data ใน client
- **Error Handling** - จัดการ errors อย่างเหมาะสม ไม่ expose sensitive information
- **Authentication** - ใช้ authentication tokens อย่างปลอดภัย
- **Authorization** - validate permissions ก่อน fetch data

## TanStack Router Security

- **Route Protection** - protect routes ที่ต้องการ authentication
- **Data Validation** - validate data ก่อน render
- **XSS Prevention** - escape user input อย่างเหมาะสม
- **CSRF Protection** - ใช้ CSRF tokens สำหรับ form submissions
