# Project Isolation

แต่ละ project ควรมี environment ที่แยกจากกันเพื่อลด side effects

## หลักการ

- ใช้ `.mise.toml` สำหรับแต่ละ project
- ไม่พึ่งพา global environment
- Commit config ใน repository

## ประโยชน์

- ลดปัญหา environment differences
- ทำให้ builds deterministic
- ง่ายต่อ onboarding สมาชิกใหม่
