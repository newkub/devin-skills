# PHP Language

## Install

Latest stable: PHP 8.4.24 (security release).

```bash
# Debian/Ubuntu (packages.sury.org)
sudo apt update
sudo apt install -y lsb-release ca-certificates curl
sudo curl -sSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb
sudo dpkg -i /tmp/debsuryorg-archive-keyring.deb
sudo apt update
sudo apt install -y php8.4

# Windows: download from https://www.php.net/downloads.php
# Use Scoop: scoop install php
# Use Winget: winget install PHP.PHP.8.4
```

## Version Info

- PHP 8.4 is the current stable branch
- PHP 8.2+ recommended for modern projects
- Key features: union types (8.0+), readonly properties (8.1+),
  enums (8.1+), fibers (8.1+), `#[\Override]` attribute (8.3+),
  property hooks (8.4+)

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
