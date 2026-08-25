# I18n And Localization Checks

## Translation And Locale Coverage

1. ตรวจสอบ translation completeness: translation key coverage per locale, missing keys per locale, extra keys per locale, translation file structure consistency
2. ตรวจสอบ missing keys: hardcoded strings ที่ควรเป็น translation keys, missing translation in critical path, missing translation for error messages, missing translation for UI labels
3. ตรวจสอบ locale coverage: supported locales list, locale detection strategy, locale switching mechanism, locale persistence, default locale
4. ตรวจสอบ i18n library configuration: library config correctness, namespace configuration, lazy loading strategy, bundle splitting per locale, fallback locale configuration
5. ตรวจสอบ fallback strategy: fallback locale, missing key fallback behavior, fallback chain, fallback warning, fallback vs default value

## Locale Formatting

1. ตรวจสอบ date formatting (locale-specific)
2. ตรวจสอบ number formatting (decimal separators, thousand separators)
3. ตรวจสอบ currency formatting (symbols, positions)
4. ตรวจสอบ pluralization rules (one, few, many, other)
5. ตรวจสอบ relative time formatting (yesterday, 2 hours ago)

## RTL Support

1. ตรวจสอบ RTL layout support, logical properties (`margin-inline`, `padding-inline`, `inset-inline`)
2. ตรวจสอบ text direction handling, RTL-specific CSS, mirroring strategy
3. ตรวจสอบ bidirectional text handling

## Cultural Adaptation

1. ตรวจสอบ address format (locale-specific)
2. ตรวจสอบ name format (first/last order)
3. ตรวจสอบ phone number format, postal code validation, tax ID validation
4. ตรวจสอบ calendar system (Gregorian, Hijri, Buddhist)

## Locale-Specific Validation

1. ตรวจสอบ postal codes, phone numbers, tax IDs
2. ตรวจสอบ email format variations, password rules per locale
3. ตรวจสอบ locale-aware error messages: error message translation, error message locale formatting, locale fallback for error messages

## Skip Conditions

- ถ้า project ไม่มี i18n → ข้ามทั้งหมด
- ถ้า project ไม่มี multi-locale support → ข้าม formatting และ cultural adaptation
- ถ้า project ไม่มี RTL locales → ข้าม RTL section

## Severity

- Critical: missing locale entirely, broken translation key ใน critical path, no fallback, hardcoded string ใน critical path, wrong currency display, broken RTL layout, timezone error ใน critical path, incorrect pluralization ที่ก่อให้เกิด misunderstanding
- High: missing translation keys, incomplete locale coverage, missing fallback strategy, no lazy loading, inconsistent translation file structure, broken pluralization, incorrect locale formatting, missing currency formatting, missing timezone support, missing RTL support, missing locale-specific validation
- Medium: suboptimal fallback, missing relative time, inconsistent formatting, missing cultural adaptation
- Low: cosmetic, minor formatting improvement, documentation gap
