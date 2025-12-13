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

### maybe

The `maybe` module provides utilities for handling optional values, helping to avoid null or undefined reference errors by explicitly wrapping values that may or may not be present.

#### some

Creates a `Maybe` instance that contains a value.

##### Signature

```typescript
function some<Value>(value: Value): Maybe<Value>
```

##### Example

```typescript
import { chain, maybe } from "@aminnairi/prelude";

const result = chain.of(maybe.some(10))
  .and(maybeItem => maybeItem.and(value => value * 2))
  .value();

console.log(result.or(0));
// => 20
```

#### none

Creates a `Maybe` instance that contains no value.

##### Signature

```typescript
function none<Value>(): Maybe<Value>
```

##### Example

```typescript
import { chain, maybe } from "@aminnairi/prelude";

const result = chain.of(maybe.none<number>())
  .and(maybeItem => maybeItem.and(value => value * 2))
  .value();

console.log(result.or(0));
// => 0
```

#### or

A curried function that provides a fallback value if the `Maybe` instance contains no value.

##### Signature

```typescript
const or: <Value>(value: Value) => (maybe: Maybe<Value>) => Value;
```

##### Example

```typescript
import { chain, maybe } from "@aminnairi/prelude";

const valueWithSome = chain.of(maybe.some(10))
  .and(maybe.or(5))
  .value();

console.log(valueWithSome);
// => 10

const valueWithNone = chain.of(maybe.none<number>())
  .and(maybe.or(5))
  .value();

console.log(valueWithNone);
// => 5
```

### chain

The `chain` module provides a fluent interface for composing operations on a value, allowing for a more readable and sequential application of functions.

#### of

Creates a `Chain` instance with an initial value.

##### Signature

```typescript
function of<Value>(value: Value): Chain<Value>
```

##### Example

```typescript
import { chain } from "@aminnairi/prelude";

const result = chain.of(10)
  .and(value => value * 2)
  .and(value => value + 5)
  .value();

console.log(result);
// => 25
```

### text

The `text` module provides functions for immutable string manipulation using a functional approach.

#### of

Creates a `Text` instance from a string.

##### Signature

```typescript
function of(text: string): Text
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const myText = text.of("Hello");
console.log(myText.value());
// => "Hello"

const chainedText = chain.of("World")
  .and(text.of)
  .value();
console.log(chainedText.value());
// => "World"
```

#### count

Returns the number of characters in a `Text` instance.

##### Signature

```typescript
function count(): (text: Text) => number
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const textLength = chain.of("Hello World")
  .and(text.of)
  .and(text.count())
  .value();

console.log(textLength);
// => 11
```

#### concatenate

Concatenates a `suffix` Text instance to the current `Text` instance.

##### Signature

```typescript
function concatenate(suffix: Text): (text: Text) => Text
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const greeting = chain.of("Hello")
  .and(text.of)
  .and(text.concatenate(text.of(" World")))
  .value();

console.log(greeting.value());
// => "Hello World"
```

#### updateAll

Applies an `update` function to each character of a `Text` instance.

##### Signature

```typescript
function updateAll(update: (character: Text) => Text): (text: Text) => Text
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const capitalized = chain.of("hello")
  .and(text.of)
  .and(text.updateAll(char => text.of(char.value().toUpperCase())))
  .value();

console.log(capitalized.value());
// => "HELLO"
```

#### updateAt

Applies an `update` function to the character at a specific `index` of a `Text` instance.

##### Signature

```typescript
function updateAt(index: number, update: (character: Text) => Text): (text: Text) => Text
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const modifiedText = chain.of("Hello")
  .and(text.of)
  .and(text.updateAt(0, char => text.of(char.value().toLowerCase())))
  .value();

console.log(modifiedText.value());
// => "hello"
```

### list

The `list` module provides functions for working with immutable lists, offering a functional approach to common array operations.

#### of

Creates a `List` instance from a sequence of values.

##### Signature

```typescript
function of<Value = never>(...values: Value[]): List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const myList = list.of(1, 2, 3);
console.log(myList.value());
// => [1, 2, 3]

const chainedList = chain.of(["a", "b"])
  .and(values => list.of(...values))
  .value();
console.log(chainedList.value());
// => ["a", "b"]
```

#### keep

Returns a new `List` containing only the elements for which the `when` predicate returns `true`.

##### Signature

```typescript
function keep<Value>(when: (value: Value) => boolean): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const evenNumbers = chain.of(numbers)
  .and(list.keep(n => n % 2 === 0))
  .value();

console.log(evenNumbers.value());
// => [2, 4]
```

#### join

Concatenates the string representation of the list's elements, separated by the provided `separator` `Text` instance.

##### Signature

```typescript
function join<Value>(separator: text.Text): (list: List<Value>) => text.Text
```

##### Example

```typescript
import { chain, list, text } from "@aminnairi/prelude";

const words = list.of("hello", "world");
const sentence = chain.of(words)
  .and(list.join(text.of(" ")))
  .value();

console.log(sentence.value());
// => "hello world"
```

#### remove

Returns a new `List` containing only the elements for which the `when` predicate returns `false`.

##### Signature

```typescript
function remove<Value>(when: (value: Value) => boolean): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const oddNumbers = chain.of(numbers)
  .and(list.remove(n => n % 2 === 0))
  .value();

console.log(oddNumbers.value());
// => [1, 3, 5]
```

#### removeAt

Returns a new `List` with the element at the specified `index` removed.

##### Signature

```typescript
function removeAt<Value>(index: number): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(10, 20, 30);
const withoutMiddle = chain.of(numbers)
  .and(list.removeAt(1))
  .value();

console.log(withoutMiddle.value());
// => [10, 30]
```

#### update

Applies a `transform` function to each element of the `List`, returning a new `List` with the transformed elements.

##### Signature

```typescript
function update<Value, NewValue>(transform: (value: Value) => NewValue): (list: List<Value>) => List<NewValue>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3);
const doubledNumbers = chain.of(numbers)
  .and(list.update(n => n * 2))
  .value();

console.log(doubledNumbers.value());
// => [2, 4, 6]
```

#### updateAt

Applies an `update` function to the element at a specific `index` of a `List` instance, returning a new `List`.

##### Signature

```typescript
function updateAt<Value>(index: number, update: (value: Value) => Value): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3);
const updatedList = chain.of(numbers)
  .and(list.updateAt(1, n => n * 10))
  .value();

console.log(updatedList.value());
// => [1, 20, 3]
```

#### first

Returns a `Maybe` containing the first element of the `List`, or `none` if the list is empty.

##### Signature

```typescript
function first<Value>(): (list: List<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(10, 20, 30);
const firstNumber = chain.of(numbers)
  .and(list.first())
  .value();

console.log(firstNumber.or(0));
// => 10

const emptyList = list.of<number>();
const noNumber = chain.of(emptyList)
  .and(list.first())
  .value();

console.log(noNumber.or(0));
// => 0
```

#### last

Returns a `Maybe` containing the last element of the `List`, or `none` if the list is empty.

##### Signature

```typescript
function last<Value>(): (list: List<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(10, 20, 30);
const lastNumber = chain.of(numbers)
  .and(list.last())
  .value();

console.log(lastNumber.or(0));
// => 30

const emptyList = list.of<number>();
const noNumber = chain.of(emptyList)
  .and(list.last())
  .value();

console.log(noNumber.or(0));
// => 0
```

#### at

Returns a `Maybe` containing the element at the specified `index` of the `List`, or `none` if the index is out of bounds.

##### Signature

```typescript
function at<Value>(index: number): (list: List<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(10, 20, 30);
const numberAtOne = chain.of(numbers)
  .and(list.at(1))
  .value();

console.log(numberAtOne.or(0));
// => 20

const numberAtFive = chain.of(numbers)
  .and(list.at(5))
  .value();

console.log(numberAtFive.or(0));
// => 0
```

#### count

Returns the number of elements in a `List` instance.

##### Signature

```typescript
function count<Value>(): (list: List<Value>) => number
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const listCount = chain.of(numbers)
  .and(list.count())
  .value();

console.log(listCount);
// => 5
```

#### any

Checks if at least one element in the `List` satisfies the provided `accept` predicate.

##### Signature

```typescript
function any<Value>(accept: (value: Value) => boolean): (list: List<Value>) => boolean
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const hasEven = chain.of(numbers)
  .and(list.any(n => n % 2 === 0))
  .value();

console.log(hasEven);
// => true
```

#### all

Checks if all elements in the `List` satisfy the provided `accept` predicate.

##### Signature

```typescript
function all<Value>(accept: (value: Value) => boolean): (list: List<Value>) => boolean
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(2, 4, 6);
const allEven = chain.of(numbers)
  .and(list.all(n => n % 2 === 0))
  .value();

console.log(allEven);
// => true

const mixedNumbers = list.of(1, 2, 3);
const allEvenMixed = chain.of(mixedNumbers)
  .and(list.all(n => n % 2 === 0))
  .value();

console.log(allEvenMixed);
// => false
```

#### find

Returns a `Maybe` containing the first element that satisfies the `accept` predicate, or `none` if no such element is found.

##### Signature

```typescript
function find<Value>(accept: (value: Value) => boolean): (list: List<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const firstEven = chain.of(numbers)
  .and(list.find(n => n % 2 === 0))
  .value();

console.log(firstEven.or(0));
// => 2

const notFound = chain.of(numbers)
  .and(list.find(n => n > 10))
  .value();

console.log(notFound.or(0));
// => 0
```

#### position

Returns a `Maybe` containing the index of the first element that satisfies the `is` predicate, or `none` if no such element is found.

##### Signature

```typescript
function position<Value>(is: (value: Value) => boolean): (list: List<Value>) => maybe.Maybe<number>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(10, 20, 30, 20);
const indexOf20 = chain.of(numbers)
  .and(list.position(n => n === 20))
  .value();

console.log(indexOf20.or(-1));
// => 1

const indexOf40 = chain.of(numbers)
  .and(list.position(n => n === 40))
  .value();

console.log(indexOf40.or(-1));
// => -1
```

#### append

Appends one or more new values to the end of the `List`, returning a new `List`.

##### Signature

```typescript
function append<Value>(...newValues: Value[]): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2);
const appendedList = chain.of(numbers)
  .and(list.append(3, 4))
  .value();

console.log(appendedList.value());
// => [1, 2, 3, 4]
```

#### enumerate

Returns a new `List` of tuples, where each tuple contains the index and the value of the elements in the original `List`.

##### Signature

```typescript
function enumerate<Value>(): (list: List<Value>) => List<[number, Value]>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const letters = list.of("a", "b", "c");
const enumerated = chain.of(letters)
  .and(list.enumerate())
  .value();

console.log(enumerated.value());
// => [[0, "a"], [1, "b"], [2, "c"]]
```

#### each

Applies a side-effecting `effect` function to each element of the `List`. Returns the original `List` (for chaining).

##### Signature

```typescript
function each<Value>(effect: (value: Value) => void): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3);
chain.of(numbers)
  .and(list.each(n => console.log(`Processing: ${n}`)))
  .value();
// => Processing: 1
// => Processing: 2
// => Processing: 3
```

#### sort

Returns a new `List` with elements sorted in ascending order. (Uses default `toSorted()` behavior).

##### Signature

```typescript
function sort<Value>(): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const unsorted = list.of(3, 1, 2);
const sorted = chain.of(unsorted)
  .and(list.sort())
  .value();

console.log(sorted.value());
// => [1, 2, 3]
```

#### indices

Returns a new `List` containing the indices of the elements in the original `List`.

##### Signature

```typescript
function indices<Value>(): (list: List<Value>) => List<number>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const letters = list.of("a", "b", "c");
const listIndices = chain.of(letters)
  .and(list.indices())
  .value();

console.log(listIndices.value());
// => [0, 1, 2]
```

#### has

Checks if any element in the `List` satisfies the provided `condition` predicate.

##### Signature

```typescript
function has<Value>(condition: (value: Value) => boolean): (list: List<Value>) => boolean
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(10, 20, 30);
const hasTwenty = chain.of(numbers)
  .and(list.has(n => n === 20))
  .value();

console.log(hasTwenty);
// => true

const hasForty = chain.of(numbers)
  .and(list.has(n => n === 40))
  .value();

console.log(hasForty);
// => false
```

#### drop

Returns a new `List` with the first `count` elements removed.

##### Signature

```typescript
function drop<Value>(count: number): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const droppedList = chain.of(numbers)
  .and(list.drop(2))
  .value();

console.log(droppedList.value());
// => [3, 4, 5]
```

#### dropLast

Returns a new `List` with the last `count` elements removed.

##### Signature

```typescript
function dropLast<Value>(count: number): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const droppedLastList = chain.of(numbers)
  .and(list.dropLast(2))
  .value();

console.log(droppedLastList.value());
// => [1, 2, 3]
```

#### dropUntil

Returns a new `List` by dropping elements from the beginning until the `condition` predicate returns `true`. The element that satisfies the condition is included.

##### Signature

```typescript
function dropUntil<Value>(condition: (value: Value) => boolean): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const droppedUntilList = chain.of(numbers)
  .and(list.dropUntil(n => n >= 3))
  .value();

console.log(droppedUntilList.value());
// => [3, 4, 5]
```

#### take

Returns a new `List` containing the first `count` elements.

##### Signature

```typescript
function take<Value>(count: number): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const takenList = chain.of(numbers)
  .and(list.take(3))
  .value();

console.log(takenList.value());
// => [1, 2, 3]
```

#### takeLast

Returns a new `List` containing the last `count` elements.

##### Signature

```typescript
function takeLast<Value>(count: number): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const takenLastList = chain.of(numbers)
  .and(list.takeLast(3))
  .value();

console.log(takenLastList.value());
// => [3, 4, 5]
```

#### takeUntil

Returns a new `List` by taking elements from the beginning until the `condition` predicate returns `true`. The element that satisfies the condition is *not* included.

##### Signature

```typescript
function takeUntil<Value>(condition: (value: Value) => boolean): (list: List<Value>) => List<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = list.of(1, 2, 3, 4, 5);
const takenUntilList = chain.of(numbers)
  .and(list.takeUntil(n => n >= 3))
  .value();

console.log(takenUntilList.value());
// => [1, 2]
```

#### zip

Combines two `List` instances into a new `List` of pairs, where the i-th pair contains the i-th element from each of the input lists. The length of the resulting list is the minimum of the two input list lengths.

##### Signature

```typescript
function zip<Value, OtherValue>(other: List<OtherValue>): (list: List<Value>) => List<[Value, OtherValue]>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const list1 = list.of(1, 2, 3);
const list2 = list.of("a", "b", "c", "d");
const zippedList = chain.of(list1)
  .and(list.zip(list2))
  .value();

console.log(zippedList.value());
// => [[1, "a"], [2, "b"], [3, "c"]]
```

### future

The `future` module provides a way to represent asynchronous operations that may succeed with a value or fail with an issue, similar to Promises but with a functional approach.

#### of

Creates a `Future` instance by providing a function that takes `succeed` and `fail` callbacks.

##### Signature

```typescript
function of<Value = never, Issue = UnexpectedIssue>(run: (succeed: (value: Value) => void, fail: (issue: Issue) => void) => void): Future<Value, Issue | UnexpectedIssue>
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const successfulFuture = future.of<string>((succeed) => {
  setTimeout(() => succeed("Operation Successful"), 100);
});

successfulFuture.when(
  value => console.log(value),
  error => console.error(error)
);
// => Operation Successful
```

#### succeed

Creates a `Future` instance that immediately succeeds with the given `value`.

##### Signature

```typescript
function succeed<Value = never>(value: Value): Future<Value>
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const success = chain.of("Data Loaded")
  .and(future.succeed)
  .value();

success.when(
  value => console.log(value),
  error => console.error(error)
);
// => Data Loaded
```

#### fail

Creates a `Future` instance that immediately fails with the given `issue`.

##### Signature

```typescript
function fail<Issue>(issue: Issue): Future<never, Issue | UnexpectedIssue>
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const failure = chain.of("Network Error")
  .and(future.fail)
  .value();

failure.when(
  value => console.log(value),
  error => console.error(error)
);
// => Network Error
```

#### update

Transforms the successful value of a `Future` using a `transform` function, returning a new `Future`. If the original `Future` fails, the new `Future` will also fail with the same issue.

##### Signature

```typescript
function update<Value, Issue, NewValue>(transform: (value: Value) => NewValue): (future: Future<Value, Issue>) => Future<NewValue, Issue | UnexpectedIssue>
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const doubled = chain.of(10)
  .and(future.succeed)
  .and(future.update(value => value * 2))
  .value();

doubled.when(
  value => console.log(value),
  error => console.error(error)
);
// => 20
```

#### upgrade

Transforms the successful value of a `Future` into another `Future` using an `update` function, effectively flattening nested futures. If either the original `Future` or the `update` function's `Future` fails, the resulting `Future` will fail.

##### Signature

```typescript
function upgrade<Value, Issue, NewValue, NewIssue>(update: (value: Value) => Future<NewValue, NewIssue>): (future: Future<Value, Issue>) => Future<NewValue, Issue | NewIssue | UnexpectedIssue>
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const fetchData = (id: number) => future.of<string>((succeed) => {
  setTimeout(() => succeed(`Data for ${id}`), 50);
});

const userProfile = chain.of(123)
  .and(future.succeed)
  .and(future.upgrade(fetchData))
  .value();

userProfile.when(
  value => console.log(value),
  error => console.error(error)
);
// => Data for 123
```

### numeric

The `numeric` module provides functions for performing immutable numeric operations and comparisons using a functional approach.

#### of

Creates a `Numeric` instance from a number.

##### Signature

```typescript
function of(value: number): Numeric
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const myNumber = numeric.of(10);
console.log(myNumber.value());
// => 10

const chainedNumber = chain.of(20)
  .and(numeric.of)
  .value();
console.log(chainedNumber.value());
// => 20
```

#### between

Checks if a `Numeric` value is inclusively between a `lowerbound` and an `upperbound`.

##### Signature

```typescript
function between(lowerbound: Numeric, upperbound: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isBetween = chain.of(numeric.of(5))
  .and(numeric.between(numeric.of(1), numeric.of(10)))
  .value();

console.log(isBetween);
// => true

const isNotBetween = chain.of(numeric.of(15))
  .and(numeric.between(numeric.of(1), numeric.of(10)))
  .value();

console.log(isNotBetween);
// => false
```

#### equalTo

Checks if a `Numeric` value is equal to another `Numeric` value.

##### Signature

```typescript
function equalTo(other: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isEqual = chain.of(numeric.of(5))
  .and(numeric.equalTo(numeric.of(5)))
  .value();

console.log(isEqual);
// => true
```

#### differentThan

Checks if a `Numeric` value is different from another `Numeric` value.

##### Signature

```typescript
function differentThan(other: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isDifferent = chain.of(numeric.of(5))
  .and(numeric.differentThan(numeric.of(10)))
  .value();

console.log(isDifferent);
// => true
```

#### greaterThan

Checks if a `Numeric` value is greater than another `Numeric` value.

##### Signature

```typescript
function greaterThan(other: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isGreater = chain.of(numeric.of(10))
  .and(numeric.greaterThan(numeric.of(5)))
  .value();

console.log(isGreater);
// => true
```

#### lowerThan

Checks if a `Numeric` value is lower than another `Numeric` value.

##### Signature

```typescript
function lowerThan(other: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isLower = chain.of(numeric.of(5))
  .and(numeric.lowerThan(numeric.of(10)))
  .value();

console.log(isLower);
// => true
```

#### greaterOrEqualTo

Checks if a `Numeric` value is greater than or equal to another `Numeric` value.

##### Signature

```typescript
function greaterOrEqualTo(other: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isGreaterOrEqual = chain.of(numeric.of(10))
  .and(numeric.greaterOrEqualTo(numeric.of(10)))
  .value();

console.log(isGreaterOrEqual);
// => true
```

#### lowerOrEqualTo

Checks if a `Numeric` value is lower than or equal to another `Numeric` value.

##### Signature

```typescript
function lowerOrEqualTo(other: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isLowerOrEqual = chain.of(numeric.of(5))
  .and(numeric.lowerOrEqualTo(numeric.of(5)))
  .value();

console.log(isLowerOrEqual);
// => true
```

#### divisibleBy

Checks if a `Numeric` value is divisible by another `Numeric` value.

##### Signature

```typescript
function divisibleBy(divider: Numeric): (numeric: Numeric) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isDivisible = chain.of(numeric.of(10))
  .and(numeric.divisibleBy(numeric.of(2)))
  .value();

console.log(isDivisible);
// => true
```

#### add

Adds two `Numeric` values.

##### Signature

```typescript
function add(second: Numeric): (first: Numeric) => Numeric
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const sum = chain.of(numeric.of(5))
  .and(numeric.add(numeric.of(3)))
  .value();

console.log(sum.value());
// => 8
```

#### subtract

Subtracts the `second` `Numeric` value from the `first` `Numeric` value.

##### Signature

```typescript
function subtract(second: Numeric): (first: Numeric) => Numeric
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const difference = chain.of(numeric.of(10))
  .and(numeric.subtract(numeric.of(4)))
  .value();

console.log(difference.value());
// => 6
```

#### multiply

Multiplies two `Numeric` values.

##### Signature

```typescript
function multiply(second: Numeric): (first: Numeric) => Numeric
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const product = chain.of(numeric.of(6))
  .and(numeric.multiply(numeric.of(7)))
  .value();

console.log(product.value());
// => 42
```

#### divide

Divides the `first` `Numeric` value by the `second` `Numeric` value. Returns a `Maybe<Numeric>` to handle division by zero.

##### Signature

```typescript
function divide(second: Numeric): (first: Numeric) => maybe.Maybe<Numeric>
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const quotient = chain.of(numeric.of(10))
  .and(numeric.divide(numeric.of(2)))
  .value();

console.log(quotient.or(numeric.of(0)).value());
// => 5

const divisionByZero = chain.of(numeric.of(10))
  .and(numeric.divide(numeric.of(0)))
  .value();

console.log(divisionByZero.or(numeric.of(0)).value());
// => 0
```

#### toPower

Raises a `Numeric` value to the power of another `Numeric` value.

##### Signature

```typescript
function toPower(power: Numeric): (numeric: Numeric) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const result = chain.of(numeric.of(2))
  .and(numeric.toPower(numeric.of(3)))
  .value();

console.log(result);
// => 8
```

#### maximum

Returns a `Numeric` instance representing the maximum of the given `numeric` and additional `numerics`.

##### Signature

```typescript
function maximum(...numerics: Numeric[]): (numeric: Numeric) => Numeric
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const maxNumber = chain.of(numeric.of(5))
  .and(numeric.maximum(numeric.of(10), numeric.of(2)))
  .value();

console.log(maxNumber.value());
// => 10
```

#### minimum

Returns a `Numeric` instance representing the minimum of the given `numeric` and additional `numerics`.

##### Signature

```typescript
function minimum(...numerics: Numeric[]): (numeric: Numeric) => Numeric
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const minNumber = chain.of(numeric.of(5))
  .and(numeric.minimum(numeric.of(10), numeric.of(2)))
  .value();

console.log(minNumber.value());
// => 2
```

#### compare

Compares two `Numeric` values and returns a `Comparison` enum indicating whether the first is `Greater`, `Lower`, or `Equal` to the second.

##### Signature

```typescript
function compare(second: Numeric): (first: Numeric) => Comparison
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const comparisonResult = chain.of(numeric.of(10))
  .and(numeric.compare(numeric.of(5)))
  .value();

console.log(comparisonResult === numeric.Comparison.Greater);
// => true
```

### logic

The `logic` module provides higher-order functions for composing and transforming boolean logic and function pipelines.

#### not

Returns a new function that negates the boolean result of the input `callback` function.

##### Signature

```typescript
function not<Parameters extends Array<unknown>>(callback: (...parameters: Parameters) => boolean): (...args: Parameters) => boolean
```

##### Example

```typescript
import { chain, logic } from "@aminnairi/prelude";

const isEven = (num: number) => num % 2 === 0;
const isOdd = logic.not(isEven);

console.log(isOdd(5));
// => true
console.log(isOdd(4));
// => false
```

#### and

Returns a new function that performs a logical AND operation on the results of two input boolean-returning functions.

##### Signature

```typescript
function and<Parameters extends Array<unknown>>(secondCallback: (...parameters: Parameters) => boolean): (firstCallback: (...parameters: Parameters) => boolean) => (...parameters: Parameters) => boolean
```

##### Example

```typescript
import { chain, logic } from "@aminnairi/prelude";

const isEven = (num: number) => num % 2 === 0;
const isPositive = (num: number) => num > 0;

const isEvenAndPositive = chain.of(isEven)
  .and(logic.and(isPositive))
  .value();

console.log(isEvenAndPositive(4));
// => true
console.log(isEvenAndPositive(-2));
// => false
```

#### or

Returns a new function that performs a logical OR operation on the results of two input boolean-returning functions.

##### Signature

```typescript
function or<Parameters extends Array<unknown>>(secondCallback: (...parameters: Parameters) => boolean): (firstCallback: (...parameters: Parameters) => boolean) => (...parameters: Parameters) => boolean
```

##### Example

```typescript
import { chain, logic } from "@aminnairi/prelude";

const isEven = (num: number) => num % 2 === 0;
const isNegative = (num: number) => num < 0;

const isEvenOrNegative = chain.of(isEven)
  .and(logic.or(isNegative))
  .value();

console.log(isEvenOrNegative(3));
// => false
console.log(isEvenOrNegative(-5));
// => true
console.log(isEvenOrNegative(4));
// => true
```

#### pipe

Returns a new function that composes two functions, where the output of the first function becomes the input of the second function.

##### Signature

```typescript
function pipe<Input, Output, Value>(second: (input: Output) => Value): (first: (input: Input) => Output) => (input: Input) => Value
```

##### Example

```typescript
import { chain, logic } from "@aminnairi/prelude";

const addOne = (num: number) => num + 1;
const multiplyByTwo = (num: number) => num * 2;

const addOneThenMultiplyByTwo = chain.of(addOne)
  .and(logic.pipe(multiplyByTwo))
  .value();

console.log(addOneThenMultiplyByTwo(5));
// => 12 ((5 + 1) * 2)
```
