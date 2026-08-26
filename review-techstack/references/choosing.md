# Tech Stack Selection Review

## Goal
เลือก tech stack ที่เหมาะสมสำหรับ project โดยพิจารณาจาก requirements, constraints, และ best practices
## Scope
ครอบคลุมการเลือก programming language, frameworks, libraries, build tools, และ deployment platforms
## Execute
### 1. Analyze Requirements
> Goal: เข้าใจ requirements และ constraints ของ project ครบถ้วน
1. ระบุ functional requirements: ประเภท application, features หลัก, scale, real-time needs
2. ระบุ non-functional requirements: performance, security, availability, maintainability, time-to-market
3. ระบุ constraints: team expertise, budget, timeline, infrastructure, regulatory
4. ทำ `/follow-best-practice` สำหรับ context ของ project นั้นๆ
### 2. Choose Programming Language
> Goal: เลือกภาษาที่เหมาะสมกับประเภท application และ team expertise
1. Web Applications: TypeScript (default), Rust (high performance), Go (simple backend), Python (AI/ML)
2. Mobile Applications: React Native (cross-platform), Flutter (performance), Swift/Kotlin (native)
3. Desktop Applications: Tauri (Rust + Web, small bundle), Electron (web tech), Flutter (cross-platform)
4. CLI/TUI Applications: Rust (performance, single binary), Go (simple), Node.js (ecosystem)
5. ทำ `/follow-lang-typescript` หรือ `/follow-lang-rust` ตามภาษาที่เลือก
### 3. Choose Frameworks And Libraries
> Goal: เลือก frameworks และ libraries ที่เข้ากับภาษาและ ecosystem
1. Web Frontend: Next.js (React), Nuxt (Vue), SvelteKit (Svelte), Vite (build tool)
2. Web Backend: Nitro (universal), Express/Fastify (Node.js), Axum (Rust), Gin/Echo (Go)
3. Database: PostgreSQL (relational), MongoDB (NoSQL), SQLite (embedded)
4. State Management: Pinia (Vue), Zustand (React)
### 4. Choose Build Tools
> Goal: เลือก build tools ที่รองรับภาษาและเพิ่มความเร็วในการพัฒนา
1. JavaScript/TypeScript: Vite, Rolldown, SWC
2. Rust: Cargo, Moon (monorepo)
3. Go: Go build
### 5. Choose Deployment Platform
> Goal: เลือก deployment platform ที่เหมาะกับ scale และ budget
1. Serverless: Cloudflare Workers, Vercel, AWS Lambda
2. Containers: Docker, Kubernetes
3. Traditional: VPS, PaaS (Railway)
### 6. Create Decision Matrix
> Goal: สร้างตารางเปรียบเทียบ tech options อย่างเป็นระบบ
1. กำหนด criteria: development speed, performance, scalability, ecosystem maturity, learning curve, cost, maintenance
2. ให้คะแนนแต่ละ criterion (0-10)
3. คำนวณ weighted score สำหรับแต่ละ option
4. เปรียบเทียบ total scores
### 7. Test And Validate
> Goal: ยืนยันว่า tech stack ที่เลือกใช้งานได้จริง
1. Build MVP/prototype ด้วย tech stack ที่เลือก
2. Measure performance จริง
3. Evaluate developer experience
4. Check long-term viability
## Rules
### 1. Start Simple
เริ่มจาก solutions ที่พิสูจน์แล้ว
- ใช้ tech stack ที่ team คุ้นเคย
- ไม่ over-engineering ด้วย tech ล้ำสมัย
- เริ่มจาก solutions ที่พิสูจน์แล้ว
### 2. Consider Trade-offs
พิจารณา trade-offs ของแต่ละ tech
- ทุก tech มี pros และ cons
- วัด impact ต่อ development speed, performance, maintenance
- พิจารณา long-term viability
### 3. Prototype First
ทดสอบก่อน commit
- ทดลอง build MVP/prototype
- วัด performance จริง
- ประเมิน developer experience
### 4. Think Long-term
คำนึงถึง long-term maintenance
- maintenance สำคัญกว่า initial speed
- พิจารณา ecosystem maturity
- ตรวจสอบ community support
## Expected Outcome
- Tech stack ที่เหมาะสมกับ requirements
- Decision matrix ที่ชัดเจน
- Prototype ที่ทดสอบแล้ว
- Risk assessment ที่ครบถ้วน