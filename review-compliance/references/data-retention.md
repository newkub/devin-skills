# Data Retention Validation Rules

## Retention Policy

- Data category: ระบุ category ของข้อมูล
- Retention period: ระบุ period ต่อ category
- Legal basis: ระบุ legal basis สำหรับ retention
- Business need: ระบุ business need สำหรับ retention
- ตรวจ policy: มี policy, มี category, มี period, มี basis

## Retention Schedule

- Data inventory: มี inventory ของ data
- Retention trigger: ระบุ trigger (creation, last access, last update)
- Retention end: ระบุ end date
- Automated enforcement: มี automated deletion
- ตรวจ schedule: มี inventory, มี trigger, มี end, มี automation

## Retention Enforcement

- Automated deletion: มี job สำหรับ delete
- Manual deletion: มี process สำหรับ manual delete
- Deletion verification: verify ว่าลบแล้ว
- Backup deletion: ลบจาก backup ด้วย
- ตรวจ enforcement: มี automated, มี manual, มี verification, มี backup

## Legal Hold

- Hold process: มี process สำหรับ place hold
- Hold scope: ระบุ scope ของ hold
- Hold release: มี process สำหรับ release hold
- Hold record: มี record ของ hold
- ตรวจ legal hold: มี process, มี scope, มี release, มี record

## Data Disposal

- Secure disposal: มี secure disposal method
- Disposal verification: verify ว่า dispose แล้ว
- Disposal record: มี record ของ disposal
- Third-party disposal: request disposal จาก third party
- ตรวจ disposal: มี method, มี verification, มี record, มี third-party

## Retention Documentation

- Policy document: มี policy document
- Schedule document: มี schedule document
- Exception record: มี record สำหรับ exception
- ตรวจ documentation: มี policy, มี schedule, มี exception

## Severity Criteria

- Critical: no retention policy, no automated deletion, indefinite retention without basis, no legal hold process, no disposal
- High: incomplete schedule, missing enforcement, no disposal verification, no documentation, no backup deletion
- Medium: suboptimal retention period, missing exception record, incomplete inventory
- Low: documentation gap, minor naming
