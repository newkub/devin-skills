# PHP Language

## Install

Latest stable: PHP 8.5.9 (security release, Aug 2026).

```bash
# Debian/Ubuntu (packages.sury.org)
sudo apt update
sudo apt install -y lsb-release ca-certificates curl
sudo curl -sSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb
sudo dpkg -i /tmp/debsuryorg-archive-keyring.deb
sudo apt update
sudo apt install -y php8.5

# Windows: download from https://www.php.net/downloads.php
# Use Scoop: scoop install php
# Use Winget: winget install PHP.PHP.8.5
```

## Version Info

- PHP 8.5 is the current stable branch (released Nov 2025)
- PHP 8.5+ recommended for modern projects
- Key features by version:
  - PHP 8.0: union types, named arguments, match expression, nullsafe operator
  - PHP 8.1: readonly properties, enums, fibers, `never` return type
  - PHP 8.2: readonly classes, DNF types, `null`/`false`/`true` standalone types
  - PHP 8.3: `#[\Override]` attribute, typed class constants, `json_validate()`
  - PHP 8.4: property hooks, asymmetric visibility, `#[\Deprecated]` attribute
  - PHP 8.5: pipe operator `|>`, `#[\NoDiscard]` attribute, clone with,
    closures/casts/first-class callables in constant expressions,
    static asymmetric visibility, new URI extension

## Strict Types

Every PHP file should declare strict types:

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

class UserService
{
    public function getUser(int $id): User
    {
        // ...
    }
}
```
