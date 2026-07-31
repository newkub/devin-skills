---
name: follow-microservices-architecture
description: พัฒนา distributed systems ด้วย Microservices Architecture สำหรับ scalability และ independence
---

## Goal

กำหนดโครงสร้างโปรเจกต์ด้วย Microservices Architecture สำหรับ distributed systems ที่ต้องการ scalability, independence และ fault tolerance

## Scope

ใช้สำหรับ distributed systems ที่ต้องการ service independence, scalability และ fault tolerance

## Execute

### 1. Analyze Domain Boundaries

วิเคราะห์ domain boundaries และ data ownership

> Goal: รู้ service boundaries และ data ownership ชัดเจน

1. ระบุ business capabilities และ bounded contexts
2. แยก concerns ตาม domain-driven design
3. ระบุ data ownership ของแต่ละ service
4. ตรวจสอบ coupling ระหว่าง services

### 2. Design Service Boundaries

ออกแบบ service boundaries และ contracts

> Goal: มี service boundaries และ API contracts ชัดเจน

1. กำหนด service boundaries ชัดเจน
2. ระบุ APIs และ contracts ระหว่าง services
3. กำหนด data isolation strategy
4. ทำ `/follow-architecture` สำหรับแต่ละ service

### 3. Implement API Gateway

สร้าง API Gateway สำหรับ routing และ cross-cutting concerns

> Goal: มี API Gateway ที่จัดการ routing, auth และ rate limiting

1. สร้าง API Gateway สำหรับ routing
2. กำหนด authentication และ authorization — ทำ `/follow-validation` สำหรับ input validation
3. ตั้งค่า rate limiting แล load balancing
4. กำหนด request/response transformation

### 4. Implement Service Discovery

ตั้งค่า service discovery และ health checks

> Goal: services ค้นพบกันได้อัตโนมัติและมี health monitoring

1. ติดตั้ง service registry (Consul, Eureka, etcd)
2. ตั้งค่า service registration
3. กำหนด health checks
4. ตรวจสอบ service availability

### 5. Implement Communication

เลือกและตั้งค่า communication patterns ระหว่าง services

> Goal: services สื่อสารกันได้อย่าง reliable และ fault-tolerant

1. เลือก communication pattern: REST, gRPC, message queues
2. ตั้งค่า inter-service communication
3. กำหนด retry logic แล circuit breakers
4. ทำ `/follow-event-driven` สำหรับ async communication

### 6. Implement Data Isolation

กำหนด data isolation strategy สำหรับแต่ละ service

> Goal: แต่ละ service มี database อิสระและมี consistency strategy ชัดเจน

1. กำหนด database per service — ทำ `/follow-orm` สำหรับ data access patterns
2. ตั้งค่า data replication ถ้าจำเป็น
3. กำหนด eventual consistency strategy
4. ตรวจสอบ transaction boundaries

### 7. Validate Architecture

ตรวจสอบ architecture หลัง implement

> Goal: ยืนยัน service independence, fault tolerance และ scalability

1. ตรวจสอบ service independence
2. ทดสอบ fault tolerance แล resilience
3. ตรวจสอบ scalability
4. ทำ `/restructure` หลังจาก implement เสร็จ

## Rules

### 1. Service Boundaries

- Services ต้อง loosely coupled
- แต่ละ service ต้องมี database ของตัวเอง
- ใช้ domain-driven design สำหรับ boundaries
- หลีกเลี่ยง shared databases

### 2. API Gateway

- API Gateway เป็น single entry point
- จัดการ cross-cutting concerns ที่ gateway
- ใช้ API versioning สำหรับ compatibility
- ตรวจสอบ security ที่ gateway level

### 3. Service Discovery

- Services ต้อง register กับ service registry
- ใช้ health checks สำหรับ monitoring
- ใช้ load balancing สำหรับ distribution
- ตรวจสอบ service availability อัตโนมัติ

### 4. Communication Patterns

- ใช้ synchronous (REST/gRPC) สำหรับ immediate responses
- ใช้ asynchronous (message queues) สำหรับ eventual consistency
- ใช้ circuit breakers สำหรับ fault tolerance
- ใช้ retry logic สำหรับ transient failures

### 5. Directory Structure

ต้องมีการแยก concerns ชัดเจน:

```text
# Example monorepo structure
services/
├── api-gateway/             # API Gateway
│   ├── src/
│   │   ├── routes/         # Route definitions
│   │   ├── middleware/     # Auth, rate limiting
│   │   └── config/         # Gateway config
│   └── package.json
├── user-service/           # User domain
│   ├── src/
│   │   ├── domain/         # Business logic
│   │   ├── application/    # Use cases
│   │   ├── infrastructure/ # DB, external
│   │   └── api/            # Controllers
│   └── package.json
├── order-service/          # Order domain
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── api/
│   └── package.json
└── shared/
    ├── types/              # Shared types
    ├── utils/              # Shared utilities
    └── events/             # Event schemas
```

### 6. Data Isolation

- แต่ละ service ต้องมี database ของตัวเอง
- ใช้ eventual consistency สำหรับ cross-service transactions
- ใช้ sagas สำหรับ long-running transactions
- หลีกเลี่ยง distributed transactions ที่ซับซ้อน

### 7. Deployment

- Deploy services อิสระกัน
- ใช้ containerization (Docker)
- ใช้ orchestration (Kubernetes)
- ใช้ CI/CD pipelines สำหรับ automation

### 8. Language Support

- รองรับ: TypeScript, Python, Rust, Go, Java, C#
- Services สามารถใช้ภาษาต่างกันได้
- ปรับ deployment strategy ตามภาษา

## Expected Outcome

- Microservices Architecture ที่ loosely coupled
- Services ที่ independent แล scalable
- API Gateway สำหรับ unified entry point
- Communication ที่ reliable แล fault-tolerant
- Data isolation ที่ชัดเจน
