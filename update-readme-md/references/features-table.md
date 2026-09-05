# Features Table

> Goal: เขียนตาราง `## Features` ให้ครบ 5 คอลัมน์ ครอบคลุม business value และ usage

## Columns

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|

- `Icon` — จัดกึ่งกลางด้วย `:---:` ใช้ iconify CDN พร้อม `?color=%23<hex>&width=16`
- `Feature` — ชื่อ feature สั้นๆ
- `Description` — อธิบายว่าทำอะไร
- `Benefit` — คุณค่าทางธุรกิจ เช่น Saves time, Reduces errors
- `Usage` — ตัวอย่างการใช้งานสั้นๆ เช่น `generate()` หรือ `bunx my-app generate`

## Rules

- Coverage: ครอบคลุมทุก features จาก source code ไม่มีการข้าม
- Concise Rows: แต่ละ row กระชับ ไม่เขียน Description ยาว
- Business-Focused: เขียน business value ไม่ใช่แค่ technical details
- ห้ามใช้ emoji ในตาราง — ใช้ icon set: `mdi`, `lucide`, `material-symbols`, `tabler`, `ph`, `iconoir`
- แต่ละ icon ต้องมี color parameter ทีแตกต่างกัน

## Example Row

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:rocket.svg?color=%23303f9f&width=16) | Password Generation | Generate strong random passwords | Saves time and removes weak passwords | `generate()` or `bunx gen-password generate` |
