# Numeric And Strings Checklist — review-algorithm

## Floating Point

- [ ] equality — `a === b` บน floats → `Math.abs(a - b) < EPSILON`
- [ ] accumulation — sequential adds vs Kahan summation / sorted adds
- [ ] comparison — `0.1 + 0.2 !== 0.3`, range checks not exact equality
- [ ] rounding — `Math.round`, `toFixed` (returns string), bankers rounding
- [ ] `NaN` propagation — `NaN !== NaN`, `isNaN`/`Number.isNaN` checks
- [ ] `Infinity`/`-Infinity` — division by zero, overflow results

## Integer Bounds

- [ ] overflow — `Number.MAX_SAFE_INTEGER` (~9e15) exceeded silently
- [ ] `BigInt` needs — IDs, timestamps, counters ที่เกิน safe integer
- [ ] signed/unsigned — bitwise ops ที่ treat numbers เป็น 32-bit
- [ ] array indices — `arr[-1]`, `arr[2**32]` (out of bounds)
- [ ] modulo negative — `-5 % 3 = -2` in JS (not math convention)

## Regex Safety

- [ ] catastrophic backtracking — `(a+)+`, `(a|a)*`, nested quantifiers
- [ ] ReDoS — user-controlled input กับ complex patterns
- [ ] greedy vs lazy — `.*` vs `.*?` match scope
- [ ] alternation order — `a|ab` matches `a` first (longest first)
- [ ] regex compile ใน loop — `new RegExp` per iteration

## String Processing

- [ ] unicode boundaries — `length` (code units) vs `[...str]` (code points) vs `Intl.Segmenter` (graphemes)
- [ ] `substring`/`slice` — byte vs codepoint offsets, surrogate pair splitting
- [ ] `localeCompare` — sorting non-ASCII, collation rules
- [ ] `toLowerCase`/`toUpperCase` — locale-dependent (Turkish i)
- [ ] normalization — NFC/NFKC for comparison, `normalize()`
- [ ] template injection — user input ใน strings ที่ eval/parse ทีหลัง

## Parsing And Validation

- [ ] `parseInt` — radix explicit (`parseInt("08", 10)`), `Number` vs `parseInt`
- [ ] `parseFloat` — locale decimal separator (`.` vs `,`)
- [ ] `Date` parsing — ISO strings only, timezone handling, `new Date(string)` quirks
- [ ] `JSON.parse` — large ints lose precision, `undefined`/`NaN` not representable

## Sorting And Comparison

- [ ] default `sort()` — lexicographic, `[10, 9, 1] → [1, 10, 9]` not numeric
- [ ] comparator correctness — `(a, b) => a - b` for numbers
- [ ] stable sort — relative order of equal elements
- [ ] collation — `Intl.Collator` for locale-aware sorting
- [ ] mixed types — numbers + strings compare incorrectly

## Common Pitfalls

- [ ] `0` falsy — `if (count)` fails on 0, use `count > 0` or `count !== undefined`
- [ ] `""` falsy — `if (str)` fails on empty string
- [ ] `null` vs `undefined` — `==` vs `===` semantics
- [ ] array holes — `[,,]` vs `[undefined, undefined]` behavior differs
- [ ] `delete` — creates sparse arrays, `length` unchanged

## Detection

- grep `===` on floats, `parseInt` without radix, `sort()` without comparator
- grep complex regex — nested quantifiers, alternations
- grep `new Date(` with string args, `toLowerCase`/`toUpperCase`

Severity: wrong numeric result on financial/precision code = Critical, ReDoS = High, unicode corruption = Medium, falsy-0 bugs = Medium
