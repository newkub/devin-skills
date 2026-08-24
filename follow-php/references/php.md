# PHP Language, PSR Standards, and Composer

## PHP Language

### Install

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

### Version Info

- PHP 8.4 is the current stable branch
- PHP 8.2+ recommended for modern projects
- Key features: union types (8.0+), readonly properties (8.1+),
  enums (8.1+), fibers (8.1+), `#[\Override]` attribute (8.3+),
  property hooks (8.4+)

### Strict Types

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

## PSR Standards

### PSR-4: Autoloading

Maps namespaces to directory structures:

```json
{
    "autoload": {
        "psr-4": {
            "Vendor\\Package\\": "src/"
        }
    }
}
```

### PSR-12: Extended Coding Style

Key rules from the official PSR-12 specification:

- Files MUST use Unix LF line endings only
- Files MUST end with a non-blank line, terminated with a single LF
- Closing `?>` tag MUST be omitted from files containing only PHP
- Soft limit on line length: 120 characters
- Lines SHOULD NOT be longer than 80 characters
- 4 spaces for indentation, MUST NOT use tabs
- All PHP reserved keywords MUST be in lower case
- Short form of type keywords: `bool` not `boolean`, `int` not `integer`

Complete PSR-12 example:

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

use Vendor\Package\{ClassA as A, ClassB, ClassC as C};
use Vendor\Package\SomeNamespace\ClassD as D;

use function Vendor\Package\{functionA, functionB, functionC};

use const Vendor\Package\{ConstantA, ConstantB, ConstantC};

class Foo extends Bar implements FooInterface
{
    public function sampleFunction(int $a, int $b = null): array
    {
        if ($a === $b) {
            bar();
        } elseif ($a > $b) {
            $foo->bar($arg1);
        } else {
            BazClass::bar($arg2, $arg3);
        }
    }

    final public static function bar()
    {
        // method body
    }
}
```

### Other Key PSRs

- PSR-1: Basic Coding Standard
- PSR-3: Logger Interface
- PSR-7: HTTP Message Interfaces
- PSR-11: Container Interface
- PSR-4: Autoloading Standard

## Composer

### Install

```bash
# Linux/macOS - locally
php composer-setup.php
php composer.phar

# Linux/macOS - globally
mv composer.phar /usr/local/bin/composer

# Windows
# Download and run Composer-Setup.exe from https://getcomposer.org/download/
```

System requirements: PHP 7.2.5+ (latest version), 2.2.x LTS for PHP 5.3.2+.

### composer.json

```json
{
    "name": "vendor/project",
    "description": "A sample project",
    "type": "project",
    "require": {
        "php": "^8.2",
        "monolog/monolog": "^3.0"
    },
    "require-dev": {
        "phpstan/phpstan": "^1.10",
        "friendsofphp/php-cs-fixer": "^3.0",
        "phpunit/phpunit": "^10.0"
    },
    "autoload": {
        "psr-4": {
            "Vendor\\Package\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Vendor\\Package\\Tests\\": "tests/"
        }
    }
}
```

### Composer Commands

```bash
# Install dependencies from composer.lock
composer install

# Update dependencies to latest matching versions
composer update

# Update a single package
composer update monolog/monolog

# Add a dependency
composer require monolog/monolog

# Add dev dependency
composer require --dev phpunit/phpunit

# Remove a dependency
composer remove monolog/monolog

# Dump autoloader (optimized)
composer dump-autoload --optimize

# Global require (for tools)
composer global require phpstan/phpstan
```

### Lock File

Commit `composer.lock` to version control for applications. This ensures
reproducible builds. For libraries, it is not necessary to commit the lock
file.

```bash
# Install from lock file (reproducible)
composer install
```

## Quality Assurance Tools

```bash
# PHPStan static analysis
vendor/bin/phpstan analyse src

# PHP-CS-Fixer (PSR-12)
vendor/bin/php-cs-fixer fix

# PHPUnit tests
vendor/bin/phpunit
```

### phpstan.neon

```neon
parameters:
    level: 8
    paths:
        - src
```

### .php-cs-fixer.php

```php
<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__ . '/src')
    ->in(__DIR__ . '/tests');

return (new PhpCsFixer\Config())
    ->setRules(['@PSR12' => true])
    ->setFinder($finder);
```

## Source URLs

- PHP official: `https://www.php.net/`
- PHP downloads: `https://www.php.net/downloads.php`
- PHP-FIG PSR standards: `https://www.php-fig.org/psr/`
- PSR-12 spec: `https://www.php-fig.org/psr/psr-12/`
- Composer docs: `https://getcomposer.org/doc/`
- Composer basic usage: `https://getcomposer.org/doc/01-basic-usage.md`
- Packagist: `https://packagist.org/`
