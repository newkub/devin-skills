# Data Validation Checks

## Scope

data validation review สำหรับ: Zod schemas, input validation gaps, output validation, data contracts, transformation safety, type coercion, null handling, schema consistency across layers, validation error messages, sanitization

## Checklist

### Schema And Input Validation

- ตรวจสอบ schema coverage: ทุก API endpoint มี input schema, ทุก form มี validation schema, ทุก external data source มี schema
- ตรวจสอบ schema quality: field rules completeness, type constraints, string constraints (min/max/pattern), number constraints (min/max/integer), date constraints, enum values, optional vs required fields, default values
- ตรวจสอบ input validation: request body validation, query params validation, path params validation, header validation, file upload validation, nested object validation, array validation
- ตรวจสอบ validation error messages: error message quality, error message localization, error code system, field-level errors, error response format consistency

### Output Validation And Data Contract

- ตรวจสอบ output validation: response schema validation, serialization safety, output type contracts, API response shape consistency
- ตรวจสอบ data contracts: API-to-database mapping contracts, API-to-client mapping contracts, schema consistency across layers, contract testing
- ตรวจสอบ transformation safety: type coercion risks, null handling in transformations, data loss in transformations, schema mismatch causing runtime error
- ตรวจสอบ sanitization: HTML sanitization, SQL injection prevention, command injection prevention, path traversal prevention, XSS prevention

## Skip Conditions

- ถ้า project ไม่มี API → ข้ามส่วน input validation
- ถ้า project ไม่มี forms → ข้ามส่วน form schemas
- ถ้า project ไม่มี external data sources → ข้ามส่วน external data schemas

## Severity

- Critical: missing input validation on critical endpoint, data loss in transformation, schema mismatch causing runtime error, no sanitization, SQL injection risk
- High: missing schema on endpoint, inconsistent error format, missing output validation, missing contract test, incomplete field rules
- Medium: suboptimal schema design, missing optional field handling, inconsistent error messages, missing localization
- Low: cosmetic, minor schema improvement, documentation gap
