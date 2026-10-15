# PHP Toolchain

| key | value |
|-----|-------|
| language | PHP (modern stable line from live check; `require.php` = deploy platform) |
| runtime install | official packages or `mise use -g php` |
| package manager | Composer |
| official docs | https://www.php.net/ · PSRs: https://www.php-fig.org/psr/ |
| version policy | never pinned here — live-check PHP major + feature availability via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `php` | interpreter + built-in dev server (`php -S`) | `mise use -g php` / system package |
| `composer` | dependencies, autoload, scripts (`init`, `require`, `validate`, `dump-autoload`) | getcomposer.org / Composer-Setup.exe |
| `phpunit` | test runner (`vendor/bin/phpunit`) | `composer require --dev phpunit/phpunit` |
| Pest | modern test syntax alternative | `composer require --dev pestphp/pest` |
| `phpstan` | static analysis (level up to 8/max) | `composer require --dev phpstan/phpstan` |
| Psalm | deeper analysis when the codebase warrants it | `composer require --dev vimeo/psalm` |
| `php-cs-fixer` | PSR-12 style fixing | `composer require --dev friendsofphp/php-cs-fixer` |
| PHP_CodeSniffer (`phpcs`) | alternative style gate | `composer require --dev squizlabs/php_codesniffer` |
| OPcache | production bytecode cache (enable in `php.ini`) | bundled SAPI setting |
| Xdebug | step debugging + coverage | install per platform, configure in `php.ini` |
| `.php-cs-fixer.php` / `phpstan.neon` / `phpunit.xml` | project configs — overrides only | project files |
