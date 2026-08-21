---
name: follow-websearch
description: ใช้ crw สำหรับ web search และ scrape อย่างรวดเร็วและมีประสิทธิภาพ
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ค้นหาและดึงข้อมูลจากเว็บไซต์อย่างรวดเร็ว เน้นความเร็ว และใช้ crw อย่างเหมาะสม

## Scope

- การใช้ `crw search` สำหรับค้นหาเบื้องต้น
- การใช้ `crw scrape` สำหรับดึงข้อมูล
- การใช้ `crw crawl` และ `crw map` สำหรับ website exploration
- การเลือก format ที่เหมาะสมกับวัตถุประสงค์

## Execute

### 1. Search With Crw
> Goal: Search With Crw

ค้นหาข้อมูลจากเว็บผ่าน SearXNG

1. ใช้ `crw search "query"` สำหรับค้นหาเบื้องต้น
2. ใช้ `crw search "query" --format json` หากต้องการ structured output
3. วิเคราะห์ผลลัพธ์และเลือก URL ที่น่าสนใจ

### 2. Scrape Target URL
> Goal: Scrape Target URL

ดึงข้อมูลจาก URL เป้าหมาย

1. ใช้ `crw scrape <url> --format text` สำหรับดึง text เร็วที่สุด
2. ใช้ `crw scrape <url> --format markdown` สำหรับ content พร้อมใช้
3. ใช้ `crw scrape <url> --js` สำหรับเว็บที่ใช้ JavaScript rendering
4. ใช้ `crw scrape <url> --summary` หากต้องการ AI summary

### 3. Choose Right Format
> Goal: Choose Right Format

เลือก format ตามวัตถุประสงค์

| วัตถุประสงค์ | Format | Command |
|---|---|---|
| เร็วที่สุด | text | `--format text` |
| ดึง content เต็ม | markdown | `--format markdown` |
| structured data | json | `--format json` |
| เฉพาะ links | links | `--format links` |

### 4. Advanced Usage
> Goal: Advanced Usage

ใช้ฟีเจอร์ขั้นสูงเมื่อต้องการ

1. ใช้ `crw crawl <url> --depth N` สำหรับ crawl เว็บหลายหน้า
2. ใช้ `crw map <url>` สำหรับ discover URLs ทั้งหมด
3. ใช้ `crw scrape <url> --css SELECTOR` สำหรับ extract เฉพาะ element
4. ใช้ `crw scrape <url> --extract @schema.json` สำหรับ structured extraction

## Rules

### 1. Speed Optimization

- ใช้ `--format text` เมื่อต้องการความเร็วสูงสุด
- ใช้ `--format markdown` เมื่อต้องการ content พร้อมใช้
- หลีกเลี่ยง `--js` หากไม่จำเป็น (ช้ากว่าปกติ)

### 2. Output Selection

- เลือก format ตามวัตถุประสงค์ ไม่ใช่ตามความชอบ
- ใช้ `--output FILE` สำหรับเก็บผลลัพธ์ลง file

### 3. Token Reduction

- ใช้ `crw search` แทน AI generation สำหรับ web search
- ใช้ `--format json` สำหรับ structured output ที่ parse ได้ง่าย

### 4. Stealth Mode

- ใช้ `--stealth` เมื่อเว็บบล็อก bot
- ใช้ `--proxy URL` เมื่อต้องการ proxy

### 5. LLM Integration

- ใช้ `--summary` ร่วมกับ `--llm-provider` เพื่อเลือก AI provider
- ใช้ `--prompt "hint"` สำหรับกำหนด style ของ summary

## Expected Outcome

- สามารถค้นหาข้อมูลจากเว็บไซต์ได้อย่างรวดเร็ว
- เลือก format ที่เหมาะสมกับวัตถุประสงค์
- ดึงข้อมูลที่ต้องการได้ตรงจุด
- ลด AI token ด้วย search engine
