# fastCRW — Best Practices

Web scraping/crawling/search tool — scrape, map, crawl, extract discipline

## Recommended Patterns

- เลือก tool ตาม job: `crw_scrape` = หน้าเดียวเป็น markdown สะอาด, `crw_map` = discover URLs ของ site, `crw_crawl` = หลายหน้าตาม pattern, `crw_extract` = structured data จาก schema
- `crw_map` ก่อนเสมอเมื่อไม่รู้ site structure — ได้ URL list แล้วค่อย scrape เฉพาะที่จำเป็น
- `crw_crawl` จำกัด depth/limit/path filters เสมอ — unbounded crawl = เวลา+quota ไหม้
- `crw_extract` ด้วย explicit schema เมื่อต้องการ fields เจาะจง — markdown scrape สำหรับอ่านเอง, extract สำหรับ pipeline

## Common Pitfalls

- Respect robots.txt + rate limits — crawl ดุด่า = IP ban + ethical issue; ใช้ delays/concurrency ต่ำกับ site เล็ก
- JS-heavy sites: scrape อาจได้ shell เปล่า — ตรวจ output; ถ้าต้อง render จริงพิจารณา `/playwright`/`agent-browser`
- Paywalled/auth content — crw ไม่ bypass auth; อย่าพยายาม scrape หลัง login wall
- Output markdown ตัด boilerplate แล้ว แต่ไม่สมบูรณ์ — verify ก่อน quote; หน้า SPA อาจขาด content
- URLs ต้องมาจาก user หรือ discovery — ห้าม generate/guess URLs เอง

## Efficiency

- Batch: map ครั้งเดียว → filter URLs → parallel scrape ≤10/batch (ตาม `/deep-research` convention)
- Cache results ใน temp/files เมื่อ crawl ใหญ่ — ไม่ crawl ซ้ำภายใน session เดียว
- Search-first workflow: `/crw` search → เลือก URLs จริง → scrape — ไม่ crawl ทั้ง domain เพื่อหา 1 หน้า

## Do / Don't

| Do | Don't |
|----|-------|
| map → filter → scrape เจาะจง | crawl ทั้ง site แบบ blind |
| depth/limit/path filters เสมอ | unbounded crawl |
| `extract` schema สำหรับ structured data | parse markdown ด้วย regex |
| respect robots + rate limits | hammer sites ด้วย concurrency สูง |
