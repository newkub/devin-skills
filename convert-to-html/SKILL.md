---
name: convert-to-html
description: แปลง Markdown, text หรือข้อมูลเป็น HTML
---

## Goal

แปลง input (markdown, text, data) ไปยัง HTML format สำหรับแสดงผลบนเว็บหรือ email

## Scope

ใช้สำหรับแปลง markdown docs, reports, หรือ structured text เป็น HTML โดยไม่ใช้ frameworks

## Execute

### 1. Analyze Input

> Goal: ระบุ input type

1. ระบุ input: `markdown`, `text`, `json`, `csv`
2. ระบุ use case: web, email, component, static page
3. ถ้า input ไม่ชัด → ถาม user

### 2. Convert To HTML

> Goal: แปลงเป็น HTML tags

1. หัวข้อ markdown → `<h1>` - `<h6>`
2. ย่อหน้า → `<p>`
3. ตัวหนา → `<strong>`, ตัวเอียง → `<em>`
4. ลิงก์ → `<a href="...">`
5. รายการ → `<ul>` / `<ol>` + `<li>`
6. code inline → `<code>`, block → `<pre><code>`
7. ตาราง → `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`

### 3. Add Structure

> Goal: สร้าง HTML document ที่สมบูรณ์

1. ถ้าต้องการ full page → หุ้มด้วย `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`
2. ใส่ `<meta charset="utf-8">`
3. ถ้าเป็น fragment → ใช้ `<div>` หุ้มเฉพาะส่วน
4. ใช้ semantic tags ถ้าเหมาะสม: `<article>`, `<section>`, `<nav>`

### 4. Output

> Goal: ส่งมอบ HTML

1. ถ้าต้องการไฟล์ → ใช้ `create-files-in-temp` หรือ `write` ตาม path
2. ถ้าต้องการแสดงใน chat → ใช้ code block `html`
3. ตรวจสอบ tags ปิดครบ

## Rules

### 1. Clean HTML

- ไม่ใช้ inline style ถ้าไม่จำเป็น
- ไม่ใช้ tags ที่ล้าสมัย
- attribute ใช้ double quotes

### 2. Accessibility

- ใส่ `alt` สำหรับ images ถ้ามี
- ใช้ heading ลำดับถูกต้อง
- ตารางมี `<th>`

### 3. Escape

- escape `<`, `>`, `&` ใน text content
- ไม่ escape ภายใน code block โดยไม่จำเป็น

## Expected Outcome

- HTML ที่ valid และ clean
- โครงสร้างสอดคล้องกับ input
- พร้อมใช้งานใน web หรือ email
