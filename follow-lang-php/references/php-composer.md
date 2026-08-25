# Composer

## install

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

## composer.json

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

## Composer Commands

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

## Lock File

Commit `composer.lock` to version control for applications. This ensures
reproducible builds. For libraries, it is not necessary to commit the lock
file.

```bash
# Install from lock file (reproducible)
composer install
```
