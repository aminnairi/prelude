# @aminnairi/prelude

Type-safe standard library for TypeScript

## Installation

```bash
npm i @aminnairi/prelude
```

## Usage

```typescript
import { chain, list } from "@aminnairi/prelude";

chain
  .of(list.of(1, 2, 3))
  .and(list.keep((value) => value < 3))
  .and(list.each(console.log));
```

## Example

See [`example`](../../example/)

## API

### `maybe`

The `maybe` module provides a way to represent values that may or may not exist. It's useful for handling optional values without resorting to `null` or `undefined`.

#### `some`

Creates a `Maybe` that contains a value.

##### Signature

```typescript
export function some<Value>(value: Value): Maybe<Value>
```

##### Example

```typescript
import { maybe } from "prelude";

const a = maybe.some(5);

a.or(0); // 5
```

#### `none`

Creates a `Maybe` that represents the absence of a value.

##### Signature

```typescript
export function none<Value>(): Maybe<Value>
```

##### Example

```typescript
import { maybe } from "prelude";

const a = maybe.none();

a.or(0); // 0
```

#### `or`

Returns the value contained in a `Maybe` or a fallback value if the `Maybe` is `none`.

##### Signature

```typescript
export const or = <Value>(value: Value) => {
  return (maybe: Maybe<Value>) => {
    return maybe.or(value);
  };
};
```

##### Example

```typescript
import { maybe } from "prelude";

const a = maybe.some(5);
const b = maybe.none();

maybe.or(0)(a); // 5
maybe.or(0)(b); // 0
```

### `chain`

The `chain` module provides a way to create a chain of operations that can be lazily evaluated.

#### `of`

Creates a new `Chain` with an initial value.

##### Signature

```typescript
export const of = <Value>(value: Value): Chain<Value>
```

##### Example

```typescript
import { chain } from "prelude";

const a = chain.of(5);

a.value(); // 5
```

#### `and`

Chains an operation to be executed on the value of the `Chain`.

##### Signature

```typescript
and: <NewValue>(update: (value: Value) => NewValue) => Chain<NewValue>
```

##### Example

```typescript
import { chain } from "prelude";

const a = chain.of(5).and(v => v * 2);

a.value(); // 10
```

### `text`

The `text` module provides a set of functions to work with text.

#### `of`

Creates a new `Text` instance.

##### Signature

```typescript
export const of = (text: string): Text
```

##### Example

```typescript
import { text } from "prelude";

const a = text.of("hello");

a.value(); // "hello"
```

#### `count`

Counts the number of characters in a `Text`.

##### Signature

```typescript
export const count = () => {
  return (text: Text) => {
    return text.value().length;
  };
};
```

##### Example

```typescript
import { text } from "prelude";

const a = text.of("hello");

text.count()(a); // 5
```

#### `concatenate`

Concatenates two `Text` instances.

##### Signature

```typescript
export const concatenate = (suffix: Text) => {
  return (text: Text) => {
    return of(text.value() + suffix.value());
  };
};
```

##### Example

```typescript
import { text } from "prelude";

const a = text.of("hello");
const b = text.of(" world");

text.concatenate(b)(a).value(); // "hello world"
```

#### `updateAll`

Updates all characters in a `Text` using a given function.

##### Signature

```typescript
export const updateAll = (update: (character: Text) => Text) => {
  return (text: Text) => {
    return of(text.value().split("").map(character => {
      return update(of(character)).value();
    }).join(""));
  };
};
```

##### Example

```typescript
import { text } from "prelude";

const a = text.of("hello");
const toUpperCase = (c: text.Text) => text.of(c.value().toUpperCase());

text.updateAll(toUpperCase)(a).value(); // "HELLO"
```

#### `updateAt`

Updates the character at a given index in a `Text`.

##### Signature

```typescript
export const updateAt = (index: number, update: (character: Text) => Text) => {
  return (text: Text) => {
    return of(text.value().split("").map((character, currentIndex) => {
      if (currentIndex !== index) {
        return character;
      }

      return update(of(character)).value();
    }).join(""));
  };
};
```

##### Example

```typescript
import { text } from "prelude";

const a = text.of("hello");
const toUpperCase = (c: text.Text) => text.of(c.value().toUpperCase());

text.updateAt(0, toUpperCase)(a).value(); // "Hello"
```

### `list`

The `list` module provides a rich set of functions for working with lists of values. It is immutable, meaning that all functions that modify a list will return a new list with the changes, instead of modifying the original list.

#### `of`

Creates a new `List` instance.

##### Signature

```typescript
export const of = <Value = never>(...values: Value[]): List<Value>
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3);

a.value(); // [1, 2, 3]
```

#### `keep`

Keeps only the values that satisfy a predicate.

##### Signature

```typescript
export const keep = <Value>(when: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return of(...list.value().filter(value => {
      return when(value);
    }));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);
const isEven = (n: number) => n % 2 === 0;

list.keep(isEven)(a).value(); // [2, 4]
```

#### `join`

Joins the elements of a list into a string.

##### Signature

```typescript
export const join = <Value>(separator: text.Text) => {
  return (list: List<Value>) => {
    return text.of(list.value().join(separator.value()));
  };
};
```

##### Example

```typescript
import { list, text } from "prelude";

const a = list.of("a", "b", "c");
const separator = text.of("-");

list.join(separator)(a).value(); // "a-b-c"
```

#### `remove`

Removes the values that satisfy a predicate.

##### Signature

```typescript
export const remove = <Value>(when: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return of(...list.value().filter(value => {
      return !when(value);
    }));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);
const isEven = (n: number) => n % 2 === 0;

list.remove(isEven)(a).value(); // [1, 3]
```

#### `removeAt`

Removes the value at a given index.

##### Signature

```typescript
export const removeAt = <Value>(index: number) => {
  return (list: List<Value>) => {
    return of(...list.value().filter((_, currentIndex) => {
      return index !== currentIndex;
    }));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);

list.removeAt(1)(a).value(); // [1, 3, 4]
```

#### `update`

Applies a function to all values in a list.

##### Signature

```typescript
export const update = <Value, NewValue>(transform: (value: Value) => NewValue) => {
  return (list: List<Value>) => {
    return of(...list.value().map(value => transform(value)));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3);
const double = (n: number) => n * 2;

list.update(double)(a).value(); // [2, 4, 6]
```

#### `updateAt`

Updates the value at a given index.

##### Signature

```typescript
export const updateAt = <Value>(index: number, update: (value: Value) => Value) => {
  return (list: List<Value>) => {
    return of(...list.value().map((value, currentIndex) => {
      if (currentIndex !== index) {
        return value;
      }

      return update(value);
    }));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3);
const double = (n: number) => n * 2;

list.updateAt(1, double)(a).value(); // [1, 4, 3]
```

#### `first`

Returns the first element of a list as a `Maybe`.

##### Signature

```typescript
export const first = <Value>() => {
  return (list: List<Value>) => {
    // ...
  }
};
```

##### Example

```typescript
import { list, maybe } from "prelude";

const a = list.of(1, 2, 3);
const b = list.of();

list.first()(a).or(0); // 1
list.first()(b).or(0); // 0
```

#### `last`

Returns the last element of a list as a `Maybe`.

##### Signature

```typescript
export const last = <Value>() => {
  return (list: List<Value>) => {
    // ...
  };
};
```

##### Example

```typescript
import { list, maybe } from "prelude";

const a = list.of(1, 2, 3);
const b = list.of();

list.last()(a).or(0); // 3
list.last()(b).or(0); // 0
```

#### `at`

Returns the element at a given index as a `Maybe`.

##### Signature

```typescript
export const at = <Value>(index: number) => {
  return (list: List<Value>) => {
    // ...
  }
};
```

##### Example

```typescript
import { list, maybe } from "prelude";

const a = list.of(1, 2, 3);

list.at(1)(a).or(0); // 2
list.at(4)(a).or(0); // 0
```

#### `count`

Returns the number of elements in a list.

##### Signature

```typescript
export const count = <Value>() => {
  return (list: List<Value>) => {
    return list.value().length;
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3);

list.count()(a); // 3
```

#### `any`

Checks if any element in a list satisfies a predicate.

##### Signature

```typescript
export const any = <Value>(accept: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return list.value().some(value => {
      return accept(value);
    });
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3);
const isEven = (n: number) => n % 2 === 0;

list.any(isEven)(a); // true
```

#### `all`

Checks if all elements in a list satisfy a predicate.

##### Signature

```typescript
export const all = <Value>(accept: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return list.value().every(value => {
      return accept(value);
    });
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(2, 4, 6);
const isEven = (n: number) => n % 2 === 0;

list.all(isEven)(a); // true
```

#### `find`

Finds the first element that satisfies a predicate and returns it as a `Maybe`.

##### Signature

```typescript
export const find = <Value>(accept: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    // ...
  };
};
```

##### Example

```typescript
import { list, maybe } from "prelude";

const a = list.of(1, 2, 3, 4);
const isEven = (n: number) => n % 2 === 0;

list.find(isEven)(a).or(0); // 2
```

#### `position`

Finds the index of the first element that satisfies a predicate and returns it as a `Maybe`.

##### Signature

```typescript
export const position = <Value>(is: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    // ...
  };
};
```

##### Example

```typescript
import { list, maybe } from "prelude";

const a = list.of("a", "b", "c");
const isB = (c: string) => c === "b";

list.position(isB)(a).or(-1); // 1
```

#### `append`

Appends new values to a list.

##### Signature

```typescript
export const append = <Value>(...newValues: Value[]) => {
  return (list: List<Value>) => {
    return of(...list.value(), ...newValues);
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2);

list.append(3, 4)(a).value(); // [1, 2, 3, 4]
```

#### `enumerate`

Returns a list of `[index, value]` pairs.

##### Signature

```typescript
export const enumerate = <Value>() => {
  return (list: List<Value>) => {
    return of(...list.value().entries());
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of("a", "b");

list.enumerate()(a).value(); // [[0, "a"], [1, "b"]]
```

#### `each`

Executes a function for each element of a list.

##### Signature

```typescript
export const each = <Value>(effect: (value: Value) => void) => {
  return (list: List<Value>) => {
    // ...
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2);

list.each(console.log)(a); // 1, 2
```

#### `sort`

Sorts a list.

##### Signature

```typescript
export const sort = <Value>() => {
  return (list: List<Value>) => {
    return of(...list.value().toSorted());
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(3, 1, 2);

list.sort()(a).value(); // [1, 2, 3]
```

#### `indices`

Returns the indices of a list.

##### Signature

```typescript
export const indices = <Value>() => {
  return (list: List<Value>) => {
    return of(...list.value().keys());
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of("a", "b");

list.indices()(a).value(); // [0, 1]
```

#### `has`

Checks if a list contains an element that satisfies a predicate.

##### Signature

```typescript
export const has = <Value>(condition: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    // ...
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3);
const isTwo = (n: number) => n === 2;

list.has(isTwo)(a); // true
```

#### `drop`

Drops the first `n` elements of a list.

##### Signature

```typescript
export const drop = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(count));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);

list.drop(2)(a).value(); // [3, 4]
```

#### `dropLast`

Drops the last `n` elements of a list.

##### Signature

```typescript
export const dropLast = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(0, -count));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);

list.dropLast(2)(a).value(); // [1, 2]
```

#### `dropUntil`

Drops elements from a list until a predicate is satisfied.

##### Signature

```typescript
export const dropUntil = <Value>(condition: (value: Value) => boolean) => {
  return (list: List<Value>): List<Value> => {
    // ...
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4, 5);
const isThree = (n: number) => n === 3;

list.dropUntil(isThree)(a).value(); // [3, 4, 5]
```

#### `take`

Takes the first `n` elements of a list.

##### Signature

```typescript
export const take = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(0, count));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);

list.take(2)(a).value(); // [1, 2]
```

#### `takeLast`

Takes the last `n` elements of a list.

##### Signature

```typescript
export const takeLast = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(count - 1));
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4);

list.takeLast(2)(a).value(); // [2, 3, 4]
```

#### `takeUntil`

Takes elements from a list until a predicate is satisfied.

##### Signature

```typescript
export const takeUntil = <Value>(condition: (value: Value) => boolean) => {
  return (list: List<Value>): List<Value> => {
    // ...
  };
};
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2, 3, 4, 5);
const isThree = (n: number) => n === 3;

list.takeUntil(isThree)(a).value(); // [1, 2]
```

#### `zip`

Zips two lists together into a list of pairs.

##### Signature

```typescript
export const zip = <Value, OtherValue>(other: List<OtherValue>) => {
  return (list: List<Value>): List<[Value, OtherValue]> => {
    // ...
  };
}
```

##### Example

```typescript
import { list } from "prelude";

const a = list.of(1, 2);
const b = list.of("a", "b");

list.zip(b)(a).value(); // [[1, "a"], [2, "b"]]
```

### `future`

The `future` module provides a way to represent a value that will be available in the future. It is similar to a `Promise`, but it is lazy and has a more functional API.

#### `of`

Creates a new `Future`.

##### Signature

```typescript
export const of = <Value = never, Issue = UnexpectedIssue>(run: (succeed: (value: Value) => void, fail: (issue: Issue) => void) => void): Future<Value, Issue | UnexpectedIssue>
```

##### Example

```typescript
import { future } from "prelude";

const a = future.of((succeed, fail) => {
  setTimeout(() => {
    succeed(5);
  }, 1000);
});
```

#### `succeed`

Creates a `Future` that immediately succeeds with a value.

##### Signature

```typescript
export const succeed = <Value = never>(value: Value): Future<Value>
```

##### Example

```typescript
import { future } from "prelude";

const a = future.succeed(5);
```

#### `fail`

Creates a `Future` that immediately fails with an issue.

##### Signature

```typescript
export const fail = <Issue>(issue: Issue): Future<never, Issue | UnexpectedIssue>
```

##### Example

```typescript
import { future } from "prelude";

const a = future.fail("Something went wrong");
```

#### `update`

Transforms the success value of a `Future`.

##### Signature

```typescript
export const update = <Value, Issue, NewValue>(transform: (value: Value) => NewValue) => {
  return (future: Future<Value, Issue>) => {
    // ...
  };
};
```

##### Example

```typescript
import { future } from "prelude";

const a = future.succeed(5);
const double = (n: number) => n * 2;

future.update(double)(a);
```

#### `upgrade`

Chains a `Future` with another `Future`.

##### Signature

```typescript
export const upgrade = <Value, Issue, NewValue, NewIssue>(update: (value: Value) => Future<NewValue, NewIssue>) => {
  return (future: Future<Value, Issue>) => {
    // ...
  };
};
```

##### Example

```typescript
import { future } from "prelude";

const a = future.succeed(5);
const double = (n: number) => future.succeed(n * 2);

future.upgrade(double)(a);
```

### `numeric`

The `numeric` module provides a set of functions for working with numbers.

#### `of`

Creates a new `Numeric` instance.

##### Signature

```typescript
export const of = (value: number): Numeric
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);

a.value(); // 5
```

#### `between`

Checks if a `Numeric` is between two other `Numeric` values.

##### Signature

```typescript
export const between = (lowerbound: Numeric, upperbound: Numeric) => {
  return (numeric: Numeric) => {
    // ...
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const lower = numeric.of(0);
const upper = numeric.of(10);

numeric.between(lower, upper)(a); // true
```

#### `equalTo`

Checks if a `Numeric` is equal to another `Numeric`.

##### Signature

```typescript
export const equalTo = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() === other.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(5);

numeric.equalTo(b)(a); // true
```

#### `differentThan`

Checks if a `Numeric` is different from another `Numeric`.

##### Signature

```typescript
export const differentThan = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() !== other.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(6);

numeric.differentThan(b)(a); // true
```

#### `greaterThan`

Checks if a `Numeric` is greater than another `Numeric`.

##### Signature

```typescript
export const greaterThan = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() > other.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(6);
const b = numeric.of(5);

numeric.greaterThan(b)(a); // true
```

#### `lowerThan`

Checks if a `Numeric` is lower than another `Numeric`.

##### Signature

```typescript
export const lowerThan = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() < other.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(6);

numeric.lowerThan(b)(a); // true
```

#### `greaterOrEqualTo`

Checks if a `Numeric` is greater than or equal to another `Numeric`.

##### Signature

```typescript
export const greaterOrEqualTo = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() >= other.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(5);

numeric.greaterOrEqualTo(b)(a); // true
```

#### `lowerOrEqualTo`

Checks if a `Numeric` is lower than or equal to another `Numeric`.

##### Signature

```typescript
export const lowerOrEqualTo = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() <= other.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(5);

numeric.lowerOrEqualTo(b)(a); // true
```

#### `divisibleBy`

Checks if a `Numeric` is divisible by another `Numeric`.

##### Signature

```typescript
export const divisibleBy = (divider: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() % divider.value() === 0;
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(6);
const b = numeric.of(3);

numeric.divisibleBy(b)(a); // true
```

#### `add`

Adds two `Numeric` values.

##### Signature

```typescript
export const add = (second: Numeric) => {
  return (first: Numeric) => {
    return of(first.value() + second.value());
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(3);

numeric.add(b)(a).value(); // 8
```

#### `subtract`

Subtracts two `Numeric` values.

##### Signature

```typescript
export const subtract = (second: Numeric) => {
  return (first: Numeric) => {
    return of(first.value() - second.value());
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(3);

numeric.subtract(b)(a).value(); // 2
```

#### `multiply`

Multiplies two `Numeric` values.

##### Signature

```typescript
export const multiply = (second: Numeric) => {
  return (first: Numeric) => {
    return of(first.value() * second.value());
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(3);

numeric.multiply(b)(a).value(); // 15
```

#### `divide`

Divides two `Numeric` values. Returns a `Maybe` because division by zero is not allowed.

##### Signature

```typescript
export const divide = (second: Numeric) => {
  return (first: Numeric) => {
    // ...
  };
};
```

##### Example

```typescript
import { numeric, maybe } from "prelude";

const a = numeric.of(6);
const b = numeric.of(3);
const c = numeric.of(0);

numeric.divide(b)(a).or(numeric.of(0)).value(); // 2
numeric.divide(c)(a).or(numeric.of(0)).value(); // 0
```

#### `toPower`

Raises a `Numeric` to the power of another `Numeric`.

##### Signature

```typescript
export const toPower = (power: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() ** power.value();
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(2);
const b = numeric.of(3);

numeric.toPower(b)(a); // 8
```

#### `maximum`

Returns the maximum of a list of `Numeric` values.

##### Signature

```typescript
export const maximum = (...numerics: Numeric[]) => {
  return (numeric: Numeric) => {
    return of(Math.max(numeric.value(), ...numerics.map(numeric => numeric.value())));
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(10);
const c = numeric.of(2);

numeric.maximum(b, c)(a).value(); // 10
```

#### `minimum`

Returns the minimum of a list of `Numeric` values.

##### Signature

```typescript
export const minimum = (...numerics: Numeric[]) => {
  return (numeric: Numeric) => {
    return of(Math.min(numeric.value(), ...numerics.map(numeric => numeric.value())));
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(10);
const c = numeric.of(2);

numeric.minimum(b, c)(a).value(); // 2
```

#### `compare`

Compares two `Numeric` values.

##### Signature

```typescript
export const compare = (second: Numeric) => {
  return (first: Numeric) => {
    // ...
  };
};
```

##### Example

```typescript
import { numeric } from "prelude";

const a = numeric.of(5);
const b = numeric.of(6);

numeric.compare(b)(a); // numeric.Comparison.Lower
```

### `logic`

The `logic` module provides a set of functions for working with boolean logic and function composition.

#### `not`

Negates a boolean function.

##### Signature

```typescript
export const not = <Parameters extends Array<unknown>>(callback: (...parameters: Parameters) => boolean) => {
  return (...args: Parameters) => {
    return !callback(...args);
  };
};
```

##### Example

```typescript
import { logic } from "prelude";

const isEven = (n: number) => n % 2 === 0;
const isOdd = logic.not(isEven);

isOdd(3); // true
```

#### `and`

Combines two boolean functions with a logical AND.

##### Signature

```typescript
export const and = <Parameters extends Array<unknown>>(secondCallback: (...parameters: Parameters) => boolean) => {
  return (firstCallback: (...parameters: Parameters) => boolean) => {
    return (...parameters: Parameters) => {
      return firstCallback(...parameters) && secondCallback(...parameters);
    };
  };
};
```

##### Example

```typescript
import { logic } from "prelude";

const isEven = (n: number) => n % 2 === 0;
const isPositive = (n: number) => n > 0;
const isEvenAndPositive = logic.and(isPositive)(isEven);

isEvenAndPositive(4); // true
isEvenAndPositive(3); // false
```

#### `or`

Combines two boolean functions with a logical OR.

##### Signature

```typescript
export const or = <Parameters extends Array<unknown>>(secondCallback: (...parameters: Parameters) => boolean) => {
  return (firstCallback: (...parameters: Parameters) => boolean) => {
    return (...parameters: Parameters) => {
      return firstCallback(...parameters) || secondCallback(...parameters);
    };
  };
};
```

##### Example

```typescript
import { logic } from "prelude";

const isEven = (n: number) => n % 2 === 0;
const isNegative = (n: number) => n < 0;
const isEvenOrNegative = logic.or(isNegative)(isEven);

isEvenOrNegative(4); // true
isEvenOrNegative(-1); // true
isEvenOrNegative(3); // false
```

#### `pipe`

Pipes the output of one function to the input of another.

##### Signature

```typescript
export const pipe = <Input, Output, Value>(second: (input: Output) => Value) => {
  return (first: (input: Input) => Output) => {
    return (input: Input) => {
      return second(first(input));
    };
  };
};
```

##### Example

```typescript
import { logic } from "prelude";

const add2 = (n: number) => n + 2;
const multiplyBy3 = (n: number) => n * 3;
const add2AndMultiplyBy3 = logic.pipe(multiplyBy3)(add2);

add2AndMultiplyBy3(5); // 21
```