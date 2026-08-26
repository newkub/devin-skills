# Improvement Opportunity Categories

หมวดสำหรับจัดกลุ่ม findings เป็น improvement opportunities

## Categories

| Category | Description | Typical Sources |
|----------|-------------|-----------------|
| missing features | ฟีเจอร์ที่ควรมีแต่ยังไม่มี | `review-realize-implementation`, `review-frontend`, `review-backend` |
| quality gaps | code quality, bug-prone, correctness | `review-quality`, `update-review-cli-and-run` |
| implementation gaps | TODO, MOCK, STUB, incomplete flows | `review-realize-implementation` |
| DX gaps | onboarding, tooling, feedback loops | `review-delivery` |
| performance gaps | network, bundler, memory, I/O | `review-delivery`, `review-stability` |
| security gaps | auth, secrets, injection, compliance | `review-delivery`, `review-platform` |
| architecture gaps | patterns, boundaries, coupling | `review-architecture`, `review-techstack` |
| delivery gaps | docs, CI/CD, versioning, infra | `review-delivery`, `review-writing`, `review-rules` |

## Classification Rules

1. ทุก finding ต้องอยู่ในหมวดเดียว
2. ถ้า finding เกี่ยวกับหลายหมวด → เลือกหมวดที่ impact สูงสุด
3. รวม findings ที่เกี่ยวข้องในหมวดเดียวกันเป็น single opportunity
4. ถ้า opportunity มีหลาย root causes → แยกเป็น sub-opportunities

## Opportunity Fields

แต่ละ opportunity ต้องมี:

- `id` — identifier เฉพาะ
- `category` — หมวดจากตารางข้างต้น
- `title` — ชื่อสั้น
- `description` — อธิบาย opportunity
- `findings` — list ของ finding ids ที่รวม
- `sources` — dimensional reviews ที่เกี่ยวข้อง
- `severity` — severity สูงสุดจาก findings

## Action Skill Mapping

แต่ละหมวดแนะนำ action skill:

- missing features → `/idea-features`, `/bench-features`, `/add-more`
- quality gaps → `/list-improvements`, `/add-more`
- implementation gaps → `/add-more`
- DX gaps → `/list-improvements`, `/add-more`
- performance gaps → `/list-improvements`, `/add-more`
- security gaps → `/list-improvements`, `/add-more`
- architecture gaps → `/list-improvements`, `/add-more`
- delivery gaps → `/list-improvements`, `/add-more`
