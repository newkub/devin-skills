---
name: follow-lang-php
description: พัฒนา PHP projects ด้วย PSR standards และ modern best practices
related:
  - follow-lang-bun
  - follow-lang-javascript
  - follow-lang-kotlin
  - follow-best-practice
  - setup-cicd
  - use-scripts
---

## Goal

กำหนดแนวทางการพัฒนา PHP applications ตาม PSR standards และ modern best practices

## Scope

ใช้สำหรับพัฒนา PHP projects ทั้ง vanilla และ frameworks (PHP 8.5+)

## Execute

### 1. Setup

> Goal: ติดตั้ง PHP, Composer และ development tools สำหรับเริ่ม project

1. ติดตั้ง PHP 8.5+ หรือ latest stable
2. ติดตั้ง Composer สำหรับ dependency management
3. ติดตั้ง development tools:
   ```bash
   composer global require phpstan/phpstan
   composer global require friendsofphp/php-cs-fixer
   composer global require phpunit/phpunit
   ```
4. เลือก Framework: Laravel, Symfony, หรือ Slim
5. ดูรายละเอียดใน [references/php-language.md](references/php-language.md) และ [references/php-composer.md](references/php-composer.md)

### 2. Configuration

> Goal: ตั้งค่า composer.json, autoload, static analysis และ code style

1. สร้าง `composer.json` ใน root ของ project
2. ตั้งค่า PHP version และ project metadata
3. ตั้งค่า autoload (PSR-4)
4. สร้าง `phpstan.neon` สำหรับ static analysis
5. สร้าง `.php-cs-fixer.php` สำหรับ code style (PSR-12)
6. ตั้งค่า `php.ini` สำหรับ environment:
   - Development: `display_errors = On`, `error_reporting = E_ALL`
   - Production: `display_errors = Off`, `error_reporting = E_ALL & ~E_DEPRECATED`
7. ดูรายละเอียดใน [references/php-composer.md](references/php-composer.md)

### 3. Project Structure

> Goal: สร้างโครงสร้าง directory ตาม PSR-4 autoloading standard

1. ใช้ PSR-4 autoloading standard
2. สร้าง `src/` สำหรับ source code
3. สร้าง `tests/` สำหรับ unit tests
4. สร้าง `config/` สำหรับ configuration files
5. ใช้ Clean Architecture หรือ MVC pattern

### 4. Code Standards

> Goal: ใช้ PSR-12 coding style และ type safety ตาม PSR standards

1. ทำตาม PSR-12 coding style
2. ใช้ type hints ทุก function (PHP 7.4+)
3. ใช้ strict types: `declare(strict_types=1);`
4. ใช้ namespaces ตาม PSR-4
5. ตั้งชื่อ classes ด้วย PascalCase
6. ตั้งชื่อ methods ด้วย studlyCaps
7. ตั้งชื่อ functions ด้วย snake_case
8. ดูรายละเอียดใน [references/php-psr-standards.md](references/php-psr-standards.md)

### 5. Dependency Management

> Goal: ใช้ Composer และ Dependency Injection สำหรับจัดการ dependencies

1. ใช้ Composer สำหรับ dependency management
2. ใช้ Dependency Injection Container
3. ใช้ interfaces สำหรับ abstraction
4. ใช้ Service Provider pattern (Laravel/Symfony)
5. หลีกเลี่ยง global state

### 6. Testing

> Goal: เขียน tests ครอบคลุม business logic ด้วย PHPUnit หรือ Pest

1. ใช้ PHPUnit สำหรับ unit testing
2. เขียน tests สำหรับ business logic
3. ใช้ mocks สำหรับ external dependencies
4. รัน tests อย่างสม่ำเสมอ: `vendor/bin/phpunit`
5. ใช้ Pest PHP สำหรับ modern testing syntax

### 7. Quality Assurance

> Goal: รัน static analysis, code style และ tests สำหรับ quality checks

1. รัน PHPStan: `vendor/bin/phpstan analyse src`
2. รัน PHP-CS-Fixer: `vendor/bin/php-cs-fixer fix`
3. รัน PHPUnit: `vendor/bin/phpunit`
4. ใช้ Psalm สำหรับ additional static analysis
5. ตั้งค่า CI/CD สำหรับ automated checks
6. ดูรายละเอียดใน [references/php-quality-tools.md](references/php-quality-tools.md)

## Rules

### 1. PSR Standards

- ใช้ PSR-4 สำหรับ autoloading
- ใช้ PSR-12 สำหรับ coding style
- ใช้ PSR-7 สำหรับ HTTP message interfaces
- ใช้ PSR-11 สำหรับ Dependency Injection Container
- ใช้ PSR-3 สำหรับ logging interface
- ดู [references/php-psr-standards.md](references/php-psr-standards.md)

### 2. Type Safety

- ใช้ `declare(strict_types=1);` ทุกไฟล์
- Type hints ทุก function และ method
- ใช้ return type declarations
- ใช้ typed properties (PHP 7.4+)
- ใช้ union types (PHP 8.0+), enums (8.1+), `#[\Override]` (8.3+), property hooks (8.4+)
- ใช้ pipe operator `|>`, `#[\NoDiscard]`, clone with (PHP 8.5+)

### 3. Security

- Validate input ทุกครั้ง
- ใช้ prepared statements สำหรับ database queries
- ใช้ `password_hash()` สำหรับ passwords
- Escape output ทุกครั้ง
- ใช้ HTTPS ใน production
- ตั้งค่า proper file permissions
- ใช้ environment variables สำหรับ secrets

### 4. Performance

- ใช้ OPcache ใน production
- หลีกเลี่ยง N+1 query problems
- ใช้ lazy loading เมื่อเหมาะสม
- Cache results ของ operations ที่หนักๆ
- ใช้ asynchronous processing สำหรับ tasks ที่ใช้เวลานาน
- ใช้ HTTP/2 และ compression

### 5. Documentation

- ใช้ PHPDoc comments สำหรับ classes, methods, properties
- Document parameters และ return types
- Document exceptions ที่อาจ throw
- ใช้ `@throws`, `@param`, `@return` tags
- เขียน README.md สำหรับ project
- เขียน CHANGELOG.md สำหรับ version history

## Expected Outcome

- PHP project ที่ทำตาม PSR standards
- Code ที่มี type safety สูง
- Automated testing ที่ครอบคลุม
- Static analysis ที่ผ่าน
- Code style ที่ consistent
- Security ที่เหมาะสม
- Performance ที่ดี
