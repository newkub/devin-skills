# Service Layer Checks

## Scope

service review สำหรับ: service layer organization, single responsibility, boundary clarity, business logic patterns, data transformation, transaction boundaries, error propagation, testability, dependency injection, service-to-service communication, service naming, service file organization

## Checklist

### Organization And Boundaries

- ตรวจสอบ service organization: service file structure, service naming conventions, service grouping (domain-based, feature-based), service file size, service complexity
- ตรวจสอบ single responsibility: one service per domain, service method cohesion, service method count, service responsibility clarity, mixed responsibility detection
- ตรวจสอบ boundary clarity: service-to-API boundary, service-to-database boundary, service-to-service boundary, service-to-external boundary, boundary violations, leaking concerns
- ตรวจสอบ service naming: service class naming, service method naming, service file naming, consistent naming across services, naming reflects domain

### Business Logic, Transactions And Testability

- ตรวจสอบ business logic patterns: domain logic in service, business rule validation, business rule enforcement, data transformation in service, calculation logic, decision logic
- ตรวจสอบ transaction boundaries: transaction scope, transaction correctness, nested transactions, transaction error handling, transaction rollback, distributed transactions, saga pattern
- ตรวจสอบ error propagation: service error handling, error wrapping, error mapping (domain error to API error), error context preservation, error propagation to caller
- ตรวจสอบ testability: dependency injection, mockable dependencies, pure function isolation, side effect isolation, test setup complexity, service test coverage
- ตรวจสอบ dependency injection: DI approach (constructor, factory, container), DI correctness, DI testability, hardcoded dependencies, DI scope (singleton, scoped, transient)
- ตรวจสอบ service-to-service communication: service composition, service calling service, circular dependency, service coupling, service communication patterns

## Skip Conditions

- ถ้า project ไม่มี service layer → ข้ามทั้งหมด
- ถ้า project ไม่มี transactions → ข้ามส่วน transaction boundaries
- ถ้า project ไม่มี DI → ข้ามส่วน dependency injection

## Severity

- Critical: business logic in wrong layer, service boundary violation ที่ก่อให้เกิด coupling, circular service dependency, missing transaction boundary ที่ก่อให้เกิด data corruption, hardcoded dependency ที่ไม่ testable
- High: mixed responsibility, unclear boundary, missing error propagation, untestable service, missing DI, transaction scope issue, service coupling, missing test coverage
- Medium: inconsistent service naming, suboptimal organization, minor boundary issue, suboptimal DI, missing service documentation
- Low: cosmetic, minor naming, documentation gap
