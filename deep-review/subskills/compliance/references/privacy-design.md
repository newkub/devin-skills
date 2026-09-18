# Privacy By Design Checklist — review-compliance

## Data Minimization

- [ ] collect only needed — every data field justified by purpose
- [ ] purpose limitation — data used only for stated purpose, not repurposed silently
- [ ] storage limitation — data deleted when purpose fulfilled, not "keep forever"
- [ ] anonymization — analytics/aggregates use pseudonymized data where possible
- [ ] field-level review — new fields reviewed for necessity before adding

## Privacy By Default

- [ ] default private — most restrictive settings out-of-box, opt-in for more sharing
- [ ] minimal collection — registration asks minimum viable fields
- [ ] opt-in not opt-out — marketing, analytics, sharing require affirmative consent
- [ ] progressive disclosure — collect data when needed, not all upfront
- [ ] no dark patterns — consent UI doesn't manipulate toward "accept all"

## Consent Management

- [ ] cookie banner — blocks non-essential cookies until consent
- [ ] granular consent — categories (necessary, functional, analytics, marketing) separate
- [ ] consent records — who consented, when, what version, how withdrawn
- [ ] withdrawal — easy to revoke consent, honored within reasonable time
- [ ] consent refresh — re-prompt on policy changes
- [ ] geo-targeting — EU visitors get GDPR banner, others may get simpler notice

## Tracking And Opt-Out

- [ ] Do Not Track — `DNT` header respected (where required)
- [ ] Global Privacy Control — `Sec-GPC` honored for CCPA opt-out
- [ ] analytics opt-out — Google Analytics, Mixpanel, etc. can be disabled
- [ ] cookie categories — necessary (no consent) vs optional (consent required) separated
- [ ] fingerprinting — not used as cookie workaround

## Privacy Impact Assessment

- [ ] DPIA triggers — new features processing PII assessed before build
- [ ] high-risk processing — profiling, sensitive data, systematic monitoring flagged
- [ ] mitigation documented — risks identified, controls implemented
- [ ] stakeholder review — legal/DPO consulted on high-risk processing
- [ ] periodic review — DPIAs updated as processing evolves

## Breach Notification

- [ ] detection — monitoring for unauthorized access, exfiltration
- [ ] assessment — severity, affected users, data types evaluated
- [ ] notification window — 72h to regulator (GDPR), "without undue delay" (CCPA)
- [ ] user notification — affected users informed if high risk to rights
- [ ] documentation — breach register maintained, even if not reported
- [ ] template — notification template ready (what happened, what data, what to do)
- [ ] contacts — DPO, legal, PR, technical lead identified

## Vendor And Third-Party

- [ ] data processing agreements — DPAs with all processors (analytics, hosting, support tools)
- [ ] vendor assessment — security/privacy posture reviewed before integration
- [ ] sub-processors — vendor's sub-processors disclosed, approved
- [ ] international transfer — SCCs, adequacy, or consent for cross-border
- [ ] breach notification — vendors notify you within agreed window
- [ ] audit rights — contract allows security/compliance audit

## Data Subject Rights

- [ ] access — user can download their data (JSON/CSV export)
- [ ] rectification — user can correct inaccurate data
- [ ] erasure — user can delete account + data (right to be forgotten)
- [ ] portability — structured, machine-readable export format
- [ ] restriction — user can limit processing while dispute resolved
- [ ] objection — user can object to profiling/marketing
- [ ] automated decisions — user can request human review of algorithmic decisions

## Technical Measures

- [ ] pseudonymization — direct identifiers separated from activity data
- [ ] encryption — PII encrypted at rest, in transit
- [ ] access controls — role-based, least privilege, logged
- [ ] audit trail — who accessed what PII, when
- [ ] backup security — PII in backups encrypted, retention limited
- [ ] secure deletion — data actually purged, not just unlinked

## Organizational Measures

- [ ] privacy policy — current, accessible, understandable
- [ ] data inventory — what PII collected, where stored, who accesses
- [ ] training — staff trained on privacy practices
- [ ] incident response — breach procedure documented, tested
- [ ] DPO appointed — if required by GDPR Art. 37
- [ ] records of processing — Art. 30 records maintained

## Detection

- grep data collection — `email`, `phone`, `address`, `ssn`, `dob`, `payment` fields
- grep tracking — `gtag`, `analytics`, `mixpanel`, `hotjar`, `segment`
- grep consent — `cookie`, `consent`, `gdpr`, `optout`, `dnt`
- grep deletion — `delete`, `purge`, `anonymize`, `erase`, `forget`
- grep retention — `retention`, `ttl`, `expire`, `cleanup`, `archive`

Severity: collecting unnecessary PII = High, no consent for tracking = Critical (GDPR), no breach plan = High, no DSAR process = Critical
