# Function Quality Metrics

## Metrics

### Function Length

- pass: ≤50 lines
- warning: 51-100 lines
- fail: >100 lines
- ยกเว้น cohesive setup/initialization functions

### Parameter Count

- pass: ≤4 parameters
- warning: 5-6 parameters
- fail: >6 parameters
- ถ้าเกิน 4 ควรรับ object parameter

### Nesting Depth

- pass: ≤3 levels
- warning: 4-5 levels
- fail: >5 levels
- นับ if/for/while/switch ซ้อนกัน

### Cyclomatic Complexity

- pass: ≤10
- warning: 11-15
- fail: >15
- นับ if/switch/loop branches

### Naming Quality

- pass: ขึ้นต้นด้วย verb บ่งบอก action (get, set, compute, validate, handle)
- warning: generic names (`process`, `data`, `temp`, `handle`, `helper`)
- fail: single-letter names ยกเว้น loop index หรือ math

### Side Effects

- pass: pure function ไม่มี side effects
- warning: มี side effects แต่ isolated
- fail: มีหลาย side effects (global state, DOM, file, network, database)

### Return Type Consistency

- pass: return type consistent ไม่มี multiple return shapes
- warning: มี optional return แต่ type ชัดเจน
- fail: multiple return shapes ที่ทำให้ type ไม่ชัด

## Detection Tools

- `sg outline --view expanded --type function <paths>` สำหรับ function signatures
- `sg outline --view signatures --type function <paths>` สำหรับ return types
- `/check-code-structure` สำหรับ top-level function scan

## Severity

- Critical: function >200 lines, nesting >5, logic ที่อ่านแล้วเข้าใจผิดได้ง่าย
- High: function >50 lines, parameter >4, cognitive complexity สูงใน critical path
- Medium: function 30-50 lines, nesting 3-4, redundant comments
- Low: naming ที่สื่อได้แต่ไม่ชัด, missing comment บน minor logic
