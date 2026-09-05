---
name: follow-robots-txt
description: สร้างหรือแก้ไข robots.txt สำหรับ web project ตามสถานะ public/private และการป้องกันการเข้าถึง
argument-hint: "[scope]"
related:
  - follow-create-web
  - follow-create-web-landing
  - follow-create-web-saas
  - follow-create-web-paas
  - review-seo
---

## Goal

จัดการ `robots.txt` ให้ถูกต้องและปลอดภัยตามสถานะของ web project

## Scope

- ตรวจสอบว่า project มี `robots.txt` หรือไม่
- ตัดสินใจระหว่าง `Allow` / `Disallow` ตามการป้องกันการเข้าถึง (Access, Auth, Public)
- วางไฟล์ใน `public/robots.txt` สำหรับ framework ที่ serve static จาก `public/`
- ใช้ร่วมกับ `noindex` meta ถ้าจำเป็น

## Execute

### 1. Check Current State

> Goal: ตรวจสอบ Current State
1. ตรวจหา `robots.txt` ใน project
2. ตรวจสอบว่า site เปิดเผยหรือมีการป้องกัน (Cloudflare Access, basic auth, login)
3. ตรวจสอบ framework เพื่อรู้ว่า `robots.txt` ควรอยู่ที่ไหน:
   - SolidJS / TanStack Start / Vite: `public/robots.txt`
   - Next.js: `public/robots.txt`
   - Astro: `public/robots.txt`
   - SvelteKit: `static/robots.txt`

### 2. Decide Policy

> Goal: Decide Policy
| สถานะ site | robots.txt แนะนำ |
|------------|------------------|
| Public, ต้องการ SEO | `User-agent: *\nDisallow:\nSitemap: <url>` |
| Public แต่ยังไม่พร้อม index | `User-agent: *\nDisallow: /` + ใส่ `noindex` meta |
| มี Cloudflare Access / basic auth | `User-agent: *\nDisallow: /` |
| มีบางหน้า public บางหน้า private | ระบุ `Disallow` เฉพาะหน้าที่ต้องการปิด |

### 3. Create Or Update

> Goal: สร้าง Or Update
1. สร้างไฟล์ใน `public/robots.txt` (หรือตาม framework)
2. ถ้า `Disallow: /` ให้พิจารณาเพิ่ม `<meta name="robots" content="noindex,nofollow">` ใน SSR `<head>`
3. ถ้า public ให้เพิ่ม `Sitemap` URL
4. ตรวจสอบ syntax ให้ถูกต้อง

### 4. Verify

> Goal: ตรวจสอบ Verify
1. รัน build แล้วตรวจว่า `robots.txt` อยู่ใน output directory
2. เปิด `http://localhost:<port>/robots.txt` เพื่อตรวจ
3. ถ้า deploy แล้ว ใช้ `curl` ตรวจ `/robots.txt`

## Rules

1. ห้าม hardcode secret หรือ internal path ลง `robots.txt`
2. ถ้า site มีการป้องกัน (Access/Auth) ต้องใช้ `Disallow: /`
3. ถ้า public ต้องการ SEO ให้ใส่ `Sitemap`
4. ไม่ให้ `robots.txt` แยกย่อยหลายไฟล์
5. ตรวจ `robots.txt` หลัง build/deploy ทุกครั้ง

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-web-landing ถ้าจำเป็น
- ใช้ /follow-create-web-saas ถ้าจำเป็น
- ใช้ /follow-create-web-paas ถ้าจำเป็น
- ใช้ /review-seo ถ้าจำเป็น

## Expected Outcome

- มี `robots.txt` ที่สอดคล้องกับสถานะ site
- Search engine crawler ทราบว่าควร/ไม่ควร index
- ไม่มีข้อมูลสำคัญหลุดจาก `robots.txt`

