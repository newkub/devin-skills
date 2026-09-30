| key | value |
|---|---|
| version | 3.4.15 |
| package registry | https://www.npmjs.com/package/dompurify |
| repository | https://github.com/cure53/DOMPurify |
| docs | https://github.com/cure53/DOMPurify#readme |

| api | description | default | options |
|---|---|---|---|
| `DOMPurify.sanitize(dirty)` | Sanitize HTML string | remove dangerous tags/attrs | config object |
| `DOMPurify.sanitize(dirty, cfg)` | Sanitize with config | - | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `RETURN_DOM`, `FORBID_TAGS` |
| `DOMPurify.addHook('afterSanitizeAttributes', fn)` | Add post-processing hook | - | hook name |
| `DOMPurify.isSupported` | Check DOM support | boolean | - |
| `DOMPurify.setConfig(cfg)` | Set global config | - | - |
