# Lib Dompurify Routes / Topics

หัวข้อเอกสารหลักของ DOMPurify:

| Route / Topic | URL |
|---|---|
| README (main docs) | https://github.com/cure53/DOMPurify |
| Sanitization config | https://github.com/cure53/DOMPurify#can-i-configure-dompurify |
| Hooks | https://github.com/cure53/DOMPurify#hooks |
| Persistent config | https://github.com/cure53/DOMPurify#persistent-configuration |
| Browser support | https://github.com/cure53/DOMPurify#what-about-older-browsers-like-msie |
| Security goals | https://github.com/cure53/DOMPurify#security-goals--threat-model |
| jsdom/Node usage | https://github.com/cure53/DOMPurify#running-dompurify-on-the-server |

## Key Concepts

- Default: sanitize ทุกอย่างที่อันตราย เก็บเฉพาะ safe HTML
- `RETURN_DOM`/`RETURN_DOM_FRAGMENT` คืน DOM node แทน string
- Profiles: `sanitize(dirty, {USE_PROFILES: {html: true, svg: true}})`
- ใช้ Trusted Types integration ผ่าน `RETURN_TRUSTED_TYPE`
