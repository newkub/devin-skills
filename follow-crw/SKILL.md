---
name: follow-crw
description: แนวทางการใช้งาน CRW (fastCRW) สำหรับ web scraping, crawling, search และ serving
---

## Goal

ใช้ CRW (fastCRW) สำหรับ web scraping, crawling, search และ serving อย่างมีประสิทธิภาพสูงสุด เร็วที่สุด และลด AI token

## Execute

### 1. Web Search

ใช้ `crw search` สำหรับ web search ผ่าน SearXNG:

```bash
crw search "query"
crw search "rust web scraper" --format json
```

เหมาะสำหรับ:
- ค้นหาข้อมูลจากหลายแหล่งพร้อมกัน
- ต้องการผลลัพธ์แบบ structured (JSON)
- ลด AI token โดยใช้ search engine แทน AI generation

### 2. URL Scraping

ใช้ `crw scrape` หรือ default mode สำหรับ scrape URL เดียว:

```bash
crw example.com
crw scrape example.com --format json
crw example.com --format markdown --output result.md
```

Options สำคัญ:
- `--format markdown|json|html|rawhtml|text|links` - เลือก output format
- `--output <FILE>` - เขียนลงไฟล์แทน stdout
- `--raw` - ปิด main content extraction (return full page)
- `--js` - เปิด JavaScript rendering
- `--css <SELECTOR>` - extract เฉพาะ element ที่ match
- `--xpath <EXPR>` - extract เฉพาะ element ที่ match XPath

เหมาะสำหรับ:
- ดึง content จาก URL เดียว
- ต้องการ specific format (markdown, json, etc.)
- Extract เฉพาะส่วนที่ต้องการด้วย CSS/XPath

### 3. Website Crawling

ใช้ `crw crawl` สำหรับ BFS crawl เว็บไซต์:

```bash
crw crawl example.com --depth 3
crw crawl example.com --depth 2 --format json
```

เหมาะสำหรับ:
- Crawl เว็บไซต์ทั้งหมดด้วย BFS
- ต้องการ content จากหลายหน้า
- กำหนด depth ชัดเจน

### 4. URL Discovery

ใช้ `crw map` สำหรับ discover URLs บนเว็บไซต์:

```bash
crw map example.com
crw map example.com --format json
```

เหมาะสำหรับ:
- Discover URLs ผ่าน sitemap และ crawling
- ต้องการรายการ URLs ทั้งหมด
- วิเคราะห์โครงสร้างเว็บไซต์

### 5. Structured Data Extraction

ใช้ `--extract` กับ JSON Schema สำหรับ extract structured data:

```bash
crw example.com --extract '{"type": "object", "properties": {"title": {"type": "string"}}}'
crw example.com --extract @schema.json
```

เหมาะสำหรับ:
- Extract data แบบ structured
- ลด AI token โดยใช้ schema validation
- ต้องการ data ที่ consistent

### 6. AI Summary

ใช้ `--summary` หรือ `--prompt` สำหรับ generate AI summary:

```bash
crw example.com --summary
crw example.com --summary --prompt "in 3 bullet points"
```

Options สำหรับ LLM:
- `--llm-provider <NAME>` - Override LLM provider (anthropic, openai, deepseek, azure, openrouter)
- `--llm-key <KEY>` - Override LLM API key
- `--llm-model <MODEL>` - Override LLM model
- `--llm-base-url <URL>` - Override LLM base URL

เหมาะสำหรับ:
- Generate summary อัตโนมัติ
- ต้องการ formatted output
- ใช้ LLM ที่ configure ไว้แล้ว

### 7. MCP Server

ใช้ `crw mcp` สำหรับ start MCP server:

```bash
crw mcp
```

Environment Variables:
- `CRW_BROWSER_PATH` - Path ไปยัง browser executable (Chrome/Edge) สำหรับ JS rendering
- ตัวอย่าง: `C:\Program Files\Google\Chrome\Application\chrome.exe`

เหมาะสำหรับ:
- Integration กับ MCP-compatible tools
- ใช้เป็น MCP server สำหรับ AI agents
- Real-time web access ผ่าน MCP
- JavaScript rendering สำหรับ SPA/React/Vue/Angular sites

### 8. Browser Automation

ใช้ `crw browse` สำหรับ browser automation MCP:

```bash
crw browse
```

เหมาะสำหรับ:
- Browser automation ผ่าน MCP
- ต้องการ JavaScript rendering ขั้นสูง
- Interactive web testing

### 9. REST API Server

ใช้ `crw serve` สำหรับ start REST API server (Firecrawl-compatible):

```bash
crw serve --port 3000
```

เหมาะสำหรับ:
- Integration กับ existing systems
- Firecrawl-compatible API
- Serve ผ่าน HTTP endpoint

## Rules

### 1. Command Selection

เลือก command ตาม use case:
- Search: `crw search` - สำหรับ web search
- Scrape: `crw scrape` หรือ `crw <url>` - สำหรับ single URL
- Crawl: `crw crawl` - สำหรับ multi-page
- Map: `crw map` - สำหรับ URL discovery
- Extract: `--extract` - สำหรับ structured data
- Summary: `--summary` - สำหรับ AI summary

### 2. Performance Optimization

- ใช้ `--format json` สำหรับ structured output และ reduce AI token
- ใช้ `--css` หรือ `--xpath` เพื่อ extract เฉพาะส่วนที่ต้องการ
- ใช้ `--depth` อย่างเกินความจำเป็นใน crawl mode
- ใช้ `--output` เพื่อเขียนลงไฟล์แทน stdout

### 3. Token Reduction

- ใช้ `crw search` แทน AI generation สำหรับ web search
- ใช้ `--extract` กับ JSON Schema แทน AI parsing
- ใช้ `--format markdown` สำหรับ direct LLM consumption
- ใช้ `--prompt` เพื่อ style AI summary และ reduce iteration

### 4. Format Selection

เลือก format ตาม use case:
- markdown: สำหรับ LLM consumption และ documentation
- json: สำหรับ structured data และ programmatic access
- html: สำหรับ web rendering
- rawhtml: สำหรับ full HTML content
- text: สำหรับ plain text
- links: สำหรับ URL extraction

## Expected Outcome

- ใช้ CRW อย่างมีประสิทธิภาพสูงสุด
- ลด AI token ด้วย command ที่เหมาะสม
- เลือก format และ options ตาม use case
- Integration กับ MCP และ REST API ได้อย่างราบรื่น
