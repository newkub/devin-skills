---
name: dioxus
description: "Rust framework for cross-platform GUI development supporting web, desktop, mobile, and liveview...."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง cross-platform GUI applications ด้วย Rust สำหรับ web, desktop, mobile และ liveview


## Scope

ใช้สำหรับการพัฒนา GUI applications ด้วย Rust ที่รองรับหลาย platforms ใน codebase เดียว


## When To Use

- เมื่อต้องการสร้าง cross-platform GUI applications ด้วย Rust
- เมื่อต้องการ web, desktop, mobile และ liveview ใน codebase เดียว
- เมื่อต้องการ performance สูงและ memory footprint ต่ำ
- เมื่อต้องการใช้ Rust ecosystem สำหรับ UI development


## Execute

### 1. Create Project

```bash
cargo install dioxus-cli
dx create my-app
```

### 2. Develop Components

ใช้ Dioxus component system และ signals

### 3. Build for Target

Build สำหรับ platform ที่ต้องการ

### 4. Run

Run application บน target platform


## Rules

### Development
- ใช้ Rust สำหรับ type safety
- ใช้ signals สำหรับ state management
- Follow Dioxus component patterns

### Best Practices
- ใช้ hooks สำหรับ reusable logic
- Optimize re-renders
- Test บน target platforms


## References

- [Dioxus Docs](https://dioxuslabs.com)
- [Dioxus GitHub](https://github.com/DioxusLabs/dioxus)
- [Dioxus Book](https://dioxuslabs.com/docs)


## Related Skills

- `follow-write-devin-skills` - มาตรฐานการเขียน skills
- lang-rust
- bun


## Expected Outcome

- Cross-platform applications ที่ share code
- Performance สูงด้วย Rust
- Memory footprint ต่ำ
