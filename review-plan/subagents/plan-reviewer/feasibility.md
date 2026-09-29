# Timeline And Resource Feasibility Checks

## Goal

ตรวจ timeline และ resource feasibility ใน plan

## Checks

### Timeline

1. ตรวจ timeline มี milestones พร้อม target dates
2. ตรวจ timeline มี buffer สำหรับ unexpected issues
3. ตรวจ buffer ratio เหมาะสม: `buffer / total`
4. ตรวจ timeline สมจริง ไม่ aggressive เกินไป

### Effort Estimates

1. ตรวจแต่ละ task มี effort estimate: `S`, `M`, `L`, `XL`
2. ตรวจ effort estimates สมเหตุสมผลกับ complexity
3. ตรวจ total effort ไม่เกิน available resources
4. ตรวจ high-effort tasks มี breakdown หรือ alternatives

### Resource Requirements

1. ตรวจ resource requirements ระบุชัดเจน
2. ตรวจ dependencies ที่ต้องติดตั้ง ระบุชัด
3. ตรวจ infrastructure ที่ต้องเตรียม ระบุชัด
4. ตรวจ skills หรือ expertise ที่ต้องการ ระบุชัด

### Planning Metrics

1. ตรวจ `task_count` ระบุชัด
2. ตรวจ `effort_estimate` ระบุต่อ task
3. ตรวจ `impact_score` ระบุต่อ task
4. ตรวจ `risk_score` ระบุต่อ task
5. ตรวจ `parallelizable_count` ระบุชัด
6. ตรวจ `critical_path_length` ระบุชัด
7. ตรวจ `file_impact` ระบุในรูปแบบ `C:M:D`

## Severity

- Critical: ไม่มี timeline, ไม่มี buffer, total effort เกิน resources
- High: effort estimates ขาด, milestones ขาด, resource requirements ขาด
- Medium: buffer ไม่เพียงพอ, estimates ไม่สมเหตุสมผล, metrics ขาด
- Low: timeline ไม่ละเอียด, resource notes ไม่ครบ
