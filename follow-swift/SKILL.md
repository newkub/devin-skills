---
name: follow-swift
description: แนวทางการพัฒนา Swift applications ตาม Clean Architecture และ SwiftUI
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - Network
  - Repository
  - UseCases
  - await
  - integration
---

## Goal

พัฒนา Swift applications ด้วย Clean Architecture และ SwiftUI ตาม best practices

## Scope

Use `follow-swift` for the specific tasks and workflows it covers

## Execute

### 1. Setup Configuration
> Goal: Setup Configuration

ตั้งค่า Swift Package Manager และ dependencies

1. สร้าง Package.swift พร้อม platforms, products, dependencies
2. เลือก libraries: SPM, Swift Concurrency, DI (Factory)
3. ตั้งค่า targets สำหรับ main และ test

### 2. Project Structure
> Goal: Project Structure

จัดโครงสร้างโปรเจกต์ตาม Clean Architecture

1. Application/ - Entry point, App Delegate, Scene Delegate
2. Core/ - DI, Extensions, Utils
3. Data/ - DataSources, Models (DTOs), Repositories
4. Domain/ - Models (entities), Repositories (protocols), UseCases
5. Presentation/ - Components, Screens, ViewModels
6. Resources/ - Assets, Color sets

### 3. Core Principles
> Goal: Core Principles

ใช้หลักการสำคัญในการพัฒนา

1. SwiftUI และ Data Flow - ใช้ Property Wrappers (@State, @StateObject, @ObservedObject, @EnvironmentObject)
2. Swift Concurrency - ใช้ async/await สำหรับ asynchronous operations
3. MVVM Architecture - ViewModel เป็นตัวกลางระหว่าง View และ Model
4. Dependency Injection - ใช้ Factory สำหรับ decoupling

### 4. Folder Rules
> Goal: Folder Rules

จัดระเบียบโครงสร้างตาม Layer

1. Domain/Models/ - Business entities (struct, immutable)
2. Data/Repositories/ และ Domain/Repositories/ - Protocol ใน Domain, implementation ใน Data
3. Presentation/ViewModels/ - ObservableObject พร้อม @Published properties
4. Presentation/Components/ - Reusable Views ที่รับ State และส่ง Events
5. Presentation/Screens/ - ประกอบ Components และ ViewModels

### 5. Import Rules
> Goal: Import Rules

กำหนด dependencies ระหว่าง Layers

1. Presentation <-- Domain
2. Domain <-- (no dependencies on Presentation/Data)
3. Data <-- Domain
4. Core <-- (shared only)
5. Application <-- Presentation, Domain, Data

### 6. Testing
> Goal: Testing

ทดสอบโปรเจกต์อย่างมีประสิทธิภาพ

1. แยก Unit tests ของ Domain/UseCases ออกจาก UI tests
2. ทำให้ UseCase/Repository ทดสอบได้ด้วย dependency injection
3. แยก UI/Network tests เป็น unit/integration

## Rules

### Component Structure

- ใช้ Single-File Components (SFC) สำหรับ SwiftUI Views
- ใช้ struct สำหรับ Views
- จัดเรียง code ตามลำดับที่ถูกต้อง
- ใช้ private สำหรับ internal state
- ทำให้ View มีขนาดเล็กและรับผิดชอบหน้าที่เดียว

### Data Flow

- ใช้ Property Wrappers อย่างถูกต้อง (@State, @StateObject, @ObservedObject, @EnvironmentObject)
- ViewModel ใช้ @Published สำหรับ properties ที่ต้อง notify
- ใช้ async/await สำหรับ asynchronous operations
- หลีกเลี่ยง direct dependencies ระหว่าง Layers

### Code Quality

- ใช้ struct สำหรับ data models (immutable เมื่อเป็นไปได้)
- ใช้ protocol สำหรับ interfaces
- ทำให้ code decoupled และ testable
- ใช้ naming conventions อย่างสม่ำเสมอ

## Expected Outcome

- Swift applications ที่มีโครงสร้าง Clean Architecture
- UI ที่ใช้ SwiftUI อย่างถูกต้อง
- Code ที่ decoupled และ testable
- Data flow ที่ชัดเจนและ maintainable
- Project structure ที่เป็นระเบียบ
