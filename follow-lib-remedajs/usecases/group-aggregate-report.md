# Use Case — Group, Aggregate, and Rank a Report

> A report is filter → group → aggregate → sort, and Remeda expresses each step as a named function instead of a loop with three mutable maps. Source: https://remedajs.com/docs (accessed 2026-10-20)

## 1. Filter and group in one pipe

```ts
import { filter, groupByProp, mapValues, pipe, prop, sumBy } from "remeda";

type Order = {
  id: string;
  region: string;
  total: number;
  status: "paid" | "refunded";
};

const byRegion = pipe(
  orders,
  filter((order) => order.status === "paid"),
  groupByProp("region"),
  mapValues((rows) => ({
    orders: rows.length,
    revenue: sumBy(rows, prop("total")),
  })),
);
```

`groupByProp` returns a record keyed by the property, and `mapValues` turns each bucket into a summary in the same pass. `sumBy(rows, prop("total"))` reads the field without a lambda, so a typo is a compile error rather than `undefined`.

## 2. Keep the aggregation declarative

```ts
const statuses = countBy(orders, prop("status"));
// { paid: 812, refunded: 14 }
```

`countBy` is the one-liner for a distribution, and `partition` is the alternative when both halves are needed as arrays rather than counts. Avoid reducing into an accumulator you then mutate — the shape of the report is already a record.

## 3. Turn the record into rows and rank it

```ts
import { entries, map, sortBy } from "remeda";

const rows = map(entries(byRegion), ([region, stats]) => ({ region, ...stats }));
const ranking = sortBy(rows, [prop("revenue"), "desc"]);
```

`entries()` is a data-last iterator — the parentheses matter. `sortBy` takes order rules: a projection sorts ascending, `[projection, "desc"]` sorts descending. Sorting the derived rows, not the original orders, is what makes the ranking match the totals.

## 4. Take the top-N without sorting everything

```ts
import { takeFirstBy } from "remeda";

const topThree = takeFirstBy(orders, 3, [prop("total"), "desc"]);
```

`takeFirstBy(data, n, ...rules)` selects the first `n` items by the same rules as `sortBy` without sorting the whole array. For a single winner, `firstBy(orders, [prop("total"), "desc"])` is the `maxBy` replacement; with an ascending rule the same function returns the minimum.

## 5. Split instead of filtering twice

```ts
import { partition } from "remeda";

const [paid, refunded] = partition(orders, (order) => order.status === "paid");
```

Two `filter` calls walk the array twice and duplicate the predicate. `partition` walks it once and returns both sides in the order `[matching, rest]` — the natural shape for a two-column summary or a bulk resend job.

## 6. Keep it lazy until the first non-lazy step

```ts
const recentTotals = pipe(
  orders,
  filter((order) => order.status === "paid"),
  take(5),
  map(prop("total")),
  sumBy(identity()),
);
```

`filter`, `take`, and `map` are lazy and fuse, so the pipeline stops after five matches. `groupBy` and `sortBy` need the whole array and end the lazy run — put them after the narrowest filter to keep the work proportional to the result.

## 7. Verify

1. Seed three regions with known totals — the record totals match a manual sum
2. A region with no paid orders — it is absent from the record rather than present with `undefined`
3. `sortBy` with a `"desc"` rule — the highest revenue is first, ties fall back to the next rule
4. `takeFirstBy(orders, 3, ...)` — same three ids as `sortBy(...).slice(0, 3)`
5. `partition` — the two arrays together contain every input element exactly once
6. A 100k-row fixture — the lazy pipeline finishes without materializing every intermediate array
7. `/run-test` — a table-driven test over the grouping and ranking helpers

## Pitfalls

- `entries` without `()` inside a `pipe` — it passes the function, not the entries.
- Summing a `numeric` column that arrives as a string from the database, producing `"01234"` instead of `1234`.
- Sorting before filtering, so the full array is cloned and sorted for nothing.
- `groupBy` with a projection returning `undefined` — the key becomes the string `"undefined"`.
- Relying on object key order after `groupBy` — sort the derived rows explicitly.
- Rounding each order and then summing, which drifts from the total of rounded values.
- `takeFirstBy` with an ascending rule when the intent was "largest" — the default direction is ascending.

## Related

- `references/apis.md`
- `best-practices/remedajs.md`
- `usecases/data-pipeline-pipe.md`
- `usecases/narrow-types-with-guards.md`
