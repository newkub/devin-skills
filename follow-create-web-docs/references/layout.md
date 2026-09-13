# Layout Spec

## Nav (ทุก viewport)

```
[repo-name]                      [npm] [crates] [github-icon] [theme-icon]
```

- repo name = text link ไป GitHub repo
- registry badges เฉพาะที่ detect ได้
- GitHub = logo icon link
- theme toggle = sun/moon icon สลับ `.dark` บน `<html>` — เก็บใน `localStorage`
- height ~48-56px, border-bottom เส้นบาง, `position: sticky; top: 0`

## Desktop (≥1024px)

```
┌──────────────────┬──────────────────────────────┐
│ README (sticky)  │ docs sidebar │ docs content  │
│ col 40%          │ TOC  ~200px  │ remainder     │
└──────────────────┴──────────────────────────────┘
```

- README pane: `position: sticky; top: nav-height`, `max-width` readable (~65ch), scroll ภายในได้
- docs pane: sidebar TOC (h2/h3 anchors) + content column
- ถ้าไม่มี docs → README เป็น single centered column เท่านั้น

## Mobile (<1024px)

- stacked: README block scroll ตาม document ปกติ (ไม่ sticky, ไม่ fixed height)
- docs section อยู่ด้านล่าง README — เมื่อ user scroll ผ่าน README สุดแล้ว docs pane `h-screen` scroll ภายใน
- sidebar TOC → collapse เป็น horizontal scroll chips หรือ `<details>` dropdown

## Style

- system font stack, prose max-width, spacing scale เดียว
- code blocks: shiki dual theme + horizontal scroll
- links: สี accent เดียว, underline on hover
- ไม่มี framework UI หนัก — CSS เขียนเองหรือ UnoCSS utilities
