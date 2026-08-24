---
name: follow-flutter
description: พัฒนา Flutter applications ด้วย Clean Architecture และ Riverpod
---

## Goal

พัฒนา Flutter applications ด้วย Clean Architecture, Riverpod สำหรับ state management และ GoRouter สำหรับ navigation

## Scope

ใช้สำหรับ project ทีพัฒนาด้วย Flutter framework โดยแบ่ง layers ชัดเจน และใช้ Riverpod สำหรับ state management

- ติดตั้ง dependencies (Riverpod, GoRouter, fpdart, freezed)
- สร้าง project structure ตาม Clean Architecture
- จัดการ data layer, domain layer, presentation layer
- ตั้งค่า error handling, navigation, และ testing

## Execute

### 1. Setup Project

> Goal: ติดตั้ง Flutter project และ dependencies

1. ตรวจสอบ Flutter SDK (`flutter doctor`)
2. สร้าง project ด้วย `flutter create` หรือเปิด project มีอยู่
3. เพิ่ม dependencies ใน `pubspec.yaml`:
   - `flutter_riverpod` หรือ `hooks_riverpod`
   - `go_router`
   - `fpdart`
   - `freezed_annotation`, `json_serializable`, `build_runner`
4. รัน `flutter pub get`

### 2. Create Project Structure

> Goal: สร้างโฟลเดอร์ตาม Clean Architecture

1. สร้าง `lib/src/core/` สำหรับ error, typedefs, network
2. สร้าง `lib/src/data/datasources/`, `models/`, `repositories/`
3. สร้าง `lib/src/domain/models/`, `repositories/`, `usecases/`
4. สร้าง `lib/src/presentation/providers/`, `screens/`, `widgets/`
5. ดูรายละเอียดโครงสร้างใน `references/extra.md`

### 3. Implement Data Layer

> Goal: สร้าง models และ repositories

1. สร้าง DTOs ด้วย `freezed` ใน `lib/src/data/models/`
2. สร้าง data sources (remote/local)
3. สร้าง repository implementations ใน `lib/src/data/repositories/`
4. แปลง DTO เป็น domain model ด้วย mapper
5. จัดการ exception ด้วย `Either<Failure, Success>`

### 4. Implement Domain Layer

> Goal: สร้าง domain models, repository interfaces, และ use cases

1. สร้าง domain models ใน `lib/src/domain/models/`
2. สร้าง repository interfaces ใน `lib/src/domain/repositories/`
3. สร้าง use cases ใน `lib/src/domain/usecases/`
4. ยืนยันว่า domain layer ไม่ import framework หรือ data source โดยตรง

### 5. Implement Presentation Layer

> Goal: สร้าง providers และ screens ด้วย Riverpod

1. สร้าง providers ด้วย `riverpod_generator` หรือ `StateNotifier`
2. สร้าง screens ใน `lib/src/presentation/screens/`
3. ใช้ `ConsumerWidget` เพื่อ subscribe providers
4. จัดการ loading, error, success states ด้วย `AsyncValue`

### 6. Setup Navigation

> Goal: ตั้งค่า GoRouter สำหรับ navigation

1. สร้าง router ใน `lib/src/core/router/` หรือ `lib/main.dart`
2. กำหนด routes และ parameters
3. ใช้ `MaterialApp.router` หรือ `CupertinoApp.router`
4. ดูตัวอย่าง GoRouter ใน `references/extra.md`

### 7. Setup Error Handling

> Goal: ใช้ `fpdart` สำหรับ functional error handling

1. สร้าง `Failure` classes ใน `lib/src/core/error/`
2. ใช้ `Either<Failure, Success>` สำหรับ operations ทีอาจ fail
3. ไม่ propagate exception ไป presentation โดยตรง
4. ดูตัวอย่าง `Failure` และ `Either` ใน `references/extra.md`

### 8. Setup Testing

> Goal: เขียน unit tests สำหรับแต่ละ layer

1. เพิ่ม `flutter_test`, `mocktail` ใน dev dependencies
2. เขียน tests สำหรับ repositories
3. เขียน tests สำหรับ use cases
4. ใช้ `build_runner` สำหรับ code generation (`freezed`, `riverpod_generator`)
5. ดูตัวอย่าง unit test ใน `references/extra.md`

## Rules

### 1. Architecture

- ใช้ Clean Architecture แบ่งเป็น data, domain, presentation layers
- Domain layer ไม่มี dependencies กับ data หรือ presentation
- Data layer ขึ้นกับ domain layer

### 2. State Management

- ใช้ Riverpod สำหรับ state management และ DI
- Providers ควรอยู่ใน `lib/src/presentation/providers/`
- ใช้ `AsyncValue` จัดการ loading/error/data

### 3. Navigation

- ใช้ GoRouter สำหรับ navigation
- Routes กำหนดไว้ในไฟล์เดียว
- ส่ง parameters ผ่าน `state.pathParameters`

### 4. Error Handling

- ใช้ fpdart `Either<Failure, Success>` สำหรับ operations ทีอาจ fail
- ไม่ throw exceptions ใน domain layer
- UI แสดง error จาก `Failure`

### 5. Testing

- เขียน unit tests สำหรับ repository และ use cases
- ใช้ `mocktail` สำหรับ mocks
- Code generation ต้องรันก่อน commit

## Expected Outcome

- Flutter project ใช้ Clean Architecture แบ่ง layers ชัดเจน
- State management ด้วย Riverpod
- Navigation ด้วย GoRouter
- Error handling ด้วย fpdart Either pattern
- มี unit tests ครอบคลุม
