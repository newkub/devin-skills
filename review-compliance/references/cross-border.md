# Cross-Border Transfer Validation Rules

## Transfer Identification

- Data flow mapping: มี mapping ของ data flow
- Transfer direction: ระบุ direction (outbound, inbound)
- Data category: ระบุ category ที่ transfer
- Recipient country: ระบุ country ที่รับ
- ตรวจ identification: มี mapping, มี direction, มี category, มี country

## Transfer Mechanism

- Adequacy decision: transfer ไปยัง adequate country (EU Commission decision)
- Standard Contractual Clauses (SCC): มี SCC กับ recipient
- Binding Corporate Rules (BCR): มี BCR สำหรับ intra-group
- Derogation: ใช้ derogation (explicit consent, contract, public interest)
- ตรวจ mechanism: มี adequacy, มี SCC, มี BCR, มี derogation

## Transfer Safeguard

- Encryption: encrypt data ระหว่าง transfer
- Pseudonymization: pseudonymize data ก่อน transfer
- Access control: มี access control ที่ recipient
- Contractual safeguard: มี contractual clause
- ตรวจ safeguard: มี encryption, มี pseudonymization, มี access control, มี contract

## Transfer Documentation

- Transfer record: มี record ของ transfer
- Transfer impact assessment (TIA): มี TIA สำหรับ transfer
- Safeguard documentation: มี documentation ของ safeguard
- ตรวจ documentation: มี record, มี TIA, มี safeguard

## Schrems II Compliance

- Supplementary measure: มี supplementary measure นอกเหนือ SCC
- Transfer assessment: มี assessment ของ recipient country law
- Surveillance risk: ประเมิน surveillance risk
- ตรวจ Schrems II: มี measure, มี assessment, มี risk evaluation

## Review Checklist

1. ตรวจสอบ transfer identification: data flow mapping, transfer direction, data category, recipient country
2. ตรวจสอบ transfer mechanism: adequacy decision, Standard Contractual Clauses (SCC), Binding Corporate Rules (BCR), derogation
3. ตรวจสอบ transfer safeguard: encryption, pseudonymization, access control, contractual safeguard
4. ตรวจสอบ transfer documentation: transfer record, transfer impact assessment, safeguard documentation
5. ตรวจสอบ Schrems II compliance: supplementary measure, transfer assessment, surveillance risk

## Severity Criteria

- Critical: no transfer mechanism, no safeguard, no transfer documentation, transfer to non-adequate country without SCC
- High: missing transfer mapping, no supplementary measure, no transfer impact assessment, no TIA
- Medium: suboptimal safeguard, incomplete documentation, missing surveillance risk assessment
- Low: documentation gap, minor naming
