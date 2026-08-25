# PSR Standards

## PSR-4: Autoloading

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

## PSR-12: Extended Coding Style

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

## Other Key PSRs

- PSR-1: Basic Coding Standard
- PSR-3: Logger Interface
- PSR-7: HTTP Message Interfaces
- PSR-11: Container Interface
- PSR-4: Autoloading Standard
