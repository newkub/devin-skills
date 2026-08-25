# Quality Assurance Tools

## Commands

```bash
# PHPStan static analysis
vendor/bin/phpstan analyse src

# PHP-CS-Fixer (PSR-12)
vendor/bin/php-cs-fixer fix

# PHPUnit tests
vendor/bin/phpunit
```

## phpstan.neon

```neon
parameters:
    level: 8
    paths:
        - src
```

## .php-cs-fixer.php

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
