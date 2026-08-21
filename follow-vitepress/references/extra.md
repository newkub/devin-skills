### 9. Home Page

สร้าง `index.md` พร้อม frontmatter ตาม VitePress default:

```yaml
---
layout: home

hero:
  name: My Docs
  text: Documentation site
  tagline: Beautiful documentation powered by VitePress
  actions:
    - theme: brand
      text: Get Started
      link: /docs/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-repo

features:
  - title: Feature A
    details: Description for feature A
  - title: Feature B
    details: Description for feature B
  - title: Feature C
    details: Description for feature C
---
```
