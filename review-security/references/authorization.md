# Authorization Validation Rules

## RBAC

- ตรวจ role definition: role ชัดเจน, role description, role permission mapping
- ตรวจ role hierarchy: parent-child relationship, permission inheritance, cycle prevention
- ตรวจ permission mapping: permission ต่อ role, permission ต่อ resource, explicit deny
- ตรวจ default role: least privilege, no default admin, explicit role assignment

## ABAC

- ตรวจ attribute-based rules: user attribute, resource attribute, environment attribute
- ตรวจ policy enforcement: policy engine, policy evaluation order, deny override
- ตรวจ dynamic permission: context-aware, time-based, location-based

## Permission Checks

- ตรวจ route guards: ทุก protected route มี guard, guard ไม่ bypass
- ตรวจ API middleware: ทุก sensitive endpoint มี auth middleware
- ตรวจ resource ownership: owner check ก่อน access, owner field ใน database
- ตรวจ tenant scoping: tenant_id filter ในทุก query, no cross-tenant access

## IDOR

- ตรวจ direct object reference: ไม่ใช้ sequential ID บน sensitive resource
- ตรวจ missing ownership check: ทุก resource access ต้อง verify ownership
- ตรวจ predictable IDs: ใช้ UUID หรือ nanoid สำหรับ public-facing resource
- ตรวจ indirect reference: map ระหว่าง public ID และ internal ID

## Privilege Escalation

- ตรวจ horizontal escalation: user A เข้าถึง resource ของ user B ได้ไหม
- ตรวจ vertical escalation: user เลื่อน role ตัวเองได้ไหม
- ตรวจ parameter tampering: role, user_id, tenant_id ใน request body
- ตรวจ mass assignment: ไม่ accept role, is_admin, tenant_id จาก user input

## Multi-Tenancy Authorization

- ตรวจ tenant isolation: tenant_id ในทุก query, no global query
- ตรวจ cross-tenant access: ไม่มี path ที่ข้าม tenant โดยไม่ได้ตั้งใจ
- ตรวจ tenant admin scope: tenant admin จัดการได้เฉพาะ tenant ตัวเอง
- ตรวจ shared resource: ตรวจ ownership ก่อน access shared resource

## Severity Criteria

- Critical: missing auth check on sensitive endpoint, IDOR on critical resource, privilege escalation path, tenant data leak, mass assignment on role
- High: inconsistent permission checks, missing ownership validation, weak default role, missing tenant scope, predictable ID on sensitive resource
- Medium: inconsistent role naming, missing role documentation, suboptimal permission mapping
- Low: minor naming, documentation gap
