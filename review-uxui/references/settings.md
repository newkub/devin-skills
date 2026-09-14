# Settings And Preferences Review

## Goal

ตรวจว่า settings page/section ครบ features พื้นฐาน และ UX ของ settings เอง visual/interactive พอ — settings คือส่วนที่ user กลับมาบ่อย แต่มักถูกทิ้งให้เป็น form แห้งๆ

## Checklist — Expected Sections

- [ ] **Profile/account** — avatar, display name, email/username, password change
- [ ] **Appearance** — theme (light/dark/system), accent color, density, font size
- [ ] **Keyboard shortcuts** — list ครบ, customizable หรืออย่างน้อยมี shortcut help overlay (`?` key)
- [ ] **Notifications** — channels, frequency, per-type toggles
- [ ] **Language/locale** — ถ้า app มี i18n (cross-ref `/review-i18n`)
- [ ] **Privacy/security** — active sessions, 2FA, API keys/tokens, connected accounts
- [ ] **Data** — export/import, storage usage, reset to defaults, delete account (danger zone แยกชัด)
- [ ] **Accessibility prefs** — reduced motion, contrast, captions (cross-ref `/review-accessibility`)
- [ ] **Integrations** — third-party connections, webhooks
- [ ] **About** — version, changelog, licenses, support links

## Checklist — Settings UX Quality

- [ ] navigation ชัด — sidebar/tabs grouped ตาม category, ไม่ยัดทุกอย่าง scroll เดียว
- [ ] deep-linkable — แต่ละ section มี route (`/settings/appearance`) ไม่ใช่ state เดียว
- [ ] search settings — ถ้ามี >5 sections ควรมี search/filter
- [ ] save model สม่ำเสมอ — immediate-apply vs explicit save ต้อง consistent; unsaved changes มี guard
- [ ] reset-to-default ต่อ section — ไม่ใช่แค่ global reset
- [ ] danger zone แยก visual — destructive actions (delete account, wipe data) อยู่ section ท้าย + confirm pattern

## Checklist — Visual/Interactive Settings

- [ ] theme preview — เปลี่ยน theme แล้วเห็นผลทันที (live preview หรือ preview pane)
- [ ] shortcut recorder — UI จับ keypress จริงแทน text input
- [ ] toggles มี state feedback — ไม่ใช่ checkbox แห้ง
- [ ] selects/segmented controls มี visual preview เมื่อเหมาะ (เช่น density, font size)
- [ ] form validation inline — error ข้าง field ไม่ใช่ toast เดียว

## Severity

- `High`: ขาด section พื้นฐานที่ domain ต้องการ (profile/theme/notifications), settings ไม่ deep-link, unsaved changes หายเงียบๆ
- `Medium`: ไม่มี search, grouping สับสน, save model ไม่ consistent, danger zone ไม่แยก
- `Low`: ขาด preview/interactive controls, shortcut help ไม่มี
