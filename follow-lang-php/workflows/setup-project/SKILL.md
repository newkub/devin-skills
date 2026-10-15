---
name: follow-lang-php-setup-project
description: Scaffold a new PHP project with Composer, PSR-4 autoload, and quality tools
argument-hint: "[project-name]"
related:
  - follow-lang-php
  - follow-architecture
  - follow-my-techstack
  - deep-research
  - resolve-errors
---

## Goal

Create a new PHP project with a pinned runtime, Composer layout, PSR-4 autoloading, and static-analysis/style/test gates green

## Scope

For a fresh PHP project (vanilla or framework); live-check the current stable PHP and feature set via `/deep-research` before pinning — read `/follow-lang-php` for the language rules

## Execute

### 1. Install The Toolchain

1. Install PHP (stable line from the live check) and Composer (https://getcomposer.org/download/; Windows: Composer-Setup.exe); verify `php -v` and `composer --version`

### 2. Scaffold

1. `composer init` — set `require.php` to the live-checked platform version (never higher than what deploys run)
2. PSR-4 in `composer.json`: `"autoload": { "psr-4": { "Vendor\\Package\\": "src/" } }` + `autoload-dev` mapping `tests/`
3. Layout: `src/` + `tests/` + `config/`; namespace layout mirrors `src/` exactly
4. Framework only when the project needs one (Laravel, Symfony, Slim) — pick via `/follow-my-techstack` and follow its official creator/skeleton

### 3. Quality Tools As Dev Deps

1. `composer require --dev phpstan/phpstan friendsofphp/php-cs-fixer phpunit/phpunit`
2. `phpstan.neon`: start the level the codebase can hold and raise it (target level 8 for new code), `paths: [src]`
3. `.php-cs-fixer.php`: `@PSR12` over `src` and `tests` — overrides only, no cargo-culted rules
4. `declare(strict_types=1);` enforced from the first file

### 4. Verify

1. `composer validate` → `vendor/bin/php-cs-fixer fix --dry-run --diff` clean → `vendor/bin/phpstan analyse` passes → `vendor/bin/phpunit` green (add one passing smoke test first)
2. On failure → run `/resolve-errors`

## Rules

- Commit `composer.json` + `composer.lock`; never float ranges in `require`; `.gitignore` covers `vendor/`, `.env`
- Architecture choice (Clean vs MVC) → `/follow-architecture`; details in the Project Structure step of [../../SKILL.md](../../SKILL.md)

## Expected Outcome

- New PHP project: pinned platform, PSR-4 layout, strict types everywhere, PHPStan/CS-Fixer/PHPUnit gates green from the first commit
