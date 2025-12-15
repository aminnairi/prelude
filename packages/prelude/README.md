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
  .of([1, 2, 3])
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

const result = chain.of(10).link();

console.log(result);
// => 10
```

#### and

Applies a function to the value inside the `Chain` and returns a new `Chain` with the result. If the function returns a `Chain`, it is automatically unwrapped.

##### Signature

```typescript
and: <NewValue>(update: (value: Value) => NewValue | Chain<NewValue>) => Chain<NewValue>
```

##### Example

```typescript
import { chain } from "@aminnairi/prelude";

const result = chain.of(10)
  .and(value => value * 2)
  .and(value => value + 5)
  .link();

console.log(result);
// => 25
```

##### Example with Chain unwrapping

```typescript
import { chain } from "@aminnairi/prelude";

const result = chain.of(10)
  .and(value => chain.of(value + 1)) // An intermediate function returning a Chain
  .and(value => value * 2)
  .link();

console.log(result);
// => 22 ( (10 + 1) * 2 )
```

#### link

Extracts the value from the `Chain`.

##### Signature

```typescript
link: () => Value
```

##### Example

```typescript
import { chain } from "@aminnairi/prelude";

const result = chain.of(10)
  .and(value => value * 2)
  .link();

console.log(result);
// => 20
```

### text

The `text` module provides functions for immutable string manipulation using a functional approach.

#### from

Converts an unknown input to its string representation.

##### Signature

```typescript
function from(input: unknown): string
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const numToString = chain.of(123)
  .and(text.from)
  .value();

console.log(numToString);
// => "123"

const boolToString = chain.of(true)
  .and(text.from)
  .value();

console.log(boolToString);
// => "true"
```

#### count

Returns the number of characters in a string.

##### Signature

```typescript
function count(): (text: string) => number
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const textLength = chain.of("Hello World")
  .and(text.count())
  .value();

console.log(textLength);
// => 11
```

#### concatenate

Concatenates a `suffix` string to the current string.

##### Signature

```typescript
function concatenate(suffix: string): (text: string) => string
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const greeting = chain.of("Hello")
  .and(text.concatenate(" World"))
  .value();

console.log(greeting);
// => "Hello World"
```

#### updateAll

Applies an `update` function to each character of a string.

##### Signature

```typescript
function updateAll(update: (character: string) => string): (text: string) => string
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const capitalized = chain.of("hello")
  .and(text.updateAll(char => char.toUpperCase()))
  .value();

console.log(capitalized);
// => "HELLO"
```

#### updateAt

Applies an `update` function to the character at a specific `index` of a string.

##### Signature

```typescript
function updateAt(index: number, update: (character: string) => string): (text: string) => string
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const modifiedText = chain.of("Hello")
  .and(text.updateAt(0, char => char.toLowerCase()))
  .value();

console.log(modifiedText);
// => "hello"
```

#### lines

Splits a string into an array of lines based on the newline character.

##### Signature

```typescript
function lines(): (text: string) => Array<string>
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const multilineText = "Line 1\\nLine 2\\nLine 3";
const textLines = chain.of(multilineText)
  .and(text.lines())
  .value();

console.log(textLines);
// => ["Line 1", "Line 2", "Line 3"]
```

#### split

Splits a string into an array of substrings using the specified `separator`.

##### Signature

```typescript
function split(separator: string): (text: string) => Array<string>
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const commaSeparated = "apple,banana,orange";
const fruits = chain.of(commaSeparated)
  .and(text.split(","))
  .value();

console.log(fruits);
// => ["apple", "banana", "orange"]
```

#### toInteger

Converts a string to an integer. Returns a `Maybe<number>` to handle invalid number strings.

##### Signature

```typescript
function toInteger(): (text: string) => maybe.Maybe<number>
```

##### Example

```typescript
import { chain, text, maybe } from "@aminnairi/prelude";

const intString = "123";
const parsedInt = chain.of(intString)
  .and(text.toInteger())
  .and(maybe.or(0))
  .value();

console.log(parsedInt);
// => 123

const nonIntString = "abc";
const notParsedInt = chain.of(nonIntString)
  .and(text.toInteger())
  .and(maybe.or(0))
  .value();

console.log(notParsedInt);
// => 0
```

#### prefix

Adds a `prefix` string to the beginning of the current string.

##### Signature

```typescript
function prefix(prefix: string): (text: string) => string
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const prefixedText = chain.of("world")
  .and(text.prefix("Hello, "))
  .value();

console.log(prefixedText);
// => "Hello, world"
```

#### suffix

Adds a `suffix` string to the end of the current string.

##### Signature

```typescript
function suffix(suffix: string): (text: string) => string
```

##### Example

```typescript
import { chain, text } from "@aminnairi/prelude";

const suffixedText = chain.of("Hello")
  .and(text.suffix(" World!"))
  .value();

console.log(suffixedText);
// => "Hello World!"
```

### list

The `list` module provides functions for working with immutable lists, offering a functional approach to common array operations.

#### of

Creates a new `Array` instance from the provided values.

##### Signature

```typescript
function of<Value = never>(...values: Value[]): Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const newlist = chain.of(1)
  .and(list.of(2, 3, 4))
  .value();

console.log(newlist);
// => [2, 3, 4]
```

#### keep

Returns a new `Array` containing only the elements for which the `when` predicate returns `true`.

##### Signature

```typescript
function keep<Value>(when: (value: Value) => boolean): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = chain.of(numbers)
  .and(list.keep(n => n % 2 === 0))
  .value();

console.log(evenNumbers);
// => [2, 4]
```

#### join

Concatenates the string representation of the array's elements, separated by the provided `separator` string.

##### Signature

```typescript
function join<Value>(separator: string): (list: Array<Value>) => string
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const words = ["hello", "world"];
const sentence = chain.of(words)
  .and(list.join(" "))
  .value();

console.log(sentence);
// => "hello world"
```

#### remove

Returns a new `Array` containing only the elements for which the `when` predicate returns `false`.

##### Signature

```typescript
function remove<Value>(when: (value: Value) => boolean): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const oddNumbers = chain.of(numbers)
  .and(list.remove(n => n % 2 === 0))
  .value();

console.log(oddNumbers);
// => [1, 3, 5]
```

#### removeAt

Returns a new `Array` with the element at the specified `index` removed.

##### Signature

```typescript
function removeAt<Value>(index: number): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const withoutMiddle = chain.of(numbers)
  .and(list.removeAt(1))
  .value();

console.log(withoutMiddle);
// => [10, 30]
```

#### update

Applies a `transform` function to each element of the `Array`, returning a new `Array` with the transformed elements.

##### Signature

```typescript
function update<Value, NewValue>(transform: (value: Value) => NewValue): (list: Array<Value>) => Array<NewValue>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3];
const doubledNumbers = chain.of(numbers)
  .and(list.update(n => n * 2))
  .value();

console.log(doubledNumbers);
// => [2, 4, 6]
```

#### updateAt

Applies an `update` function to the element at a specific `index` of an `Array` instance, returning a new `Array`.

##### Signature

```typescript
function updateAt<Value>(index: number, update: (value: Value) => Value): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3];
const updatedList = chain.of(numbers)
  .and(list.updateAt(1, n => n * 10))
  .value();

console.log(updatedList);
// => [1, 20, 3]
```

#### first

Returns a `Maybe` containing the first element of the `Array`, or `none` if the array is empty.

##### Signature

```typescript
function first<Value>(): (list: Array<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const firstNumber = chain.of(numbers)
  .and(list.first())
  .and(maybe.or(0))
  .value();

console.log(firstNumber);
// => 10

const emptyList = [];
const noNumber = chain.of(emptyList)
  .and(list.first())
  .and(maybe.or(0))
  .value();

console.log(noNumber);
// => 0
```

#### last

Returns a `Maybe` containing the last element of the `Array`, or `none` if the array is empty.

##### Signature

```typescript
function last<Value>(): (list: Array<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const lastNumber = chain.of(numbers)
  .and(list.last())
  .and(maybe.or(0))
  .value();

console.log(lastNumber);
// => 30

const emptyList = [];
const noNumber = chain.of(emptyList)
  .and(list.last())
  .and(maybe.or(0))
  .value();

console.log(noNumber);
// => 0
```

#### at

Returns a `Maybe` containing the element at the specified `index` of the `Array`, or `none` if the index is out of bounds.

##### Signature

```typescript
function at<Value>(index: number): (list: Array<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const numberAtOne = chain.of(numbers)
  .and(list.at(1))
  .and(maybe.or(0))
  .value();

console.log(numberAtOne);
// => 20

const numberAtFive = chain.of(numbers)
  .and(list.at(5))
  .and(maybe.or(0))
  .value();

console.log(numberAtFive);
// => 0
```

#### count

Returns the number of elements in an `Array` instance.

##### Signature

```typescript
function count<Value>(): (list: Array<Value>) => number
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const listCount = chain.of(numbers)
  .and(list.count())
  .value();

console.log(listCount);
// => 5
```

#### any

Checks if at least one element in the `Array` satisfies the provided `accept` predicate.

##### Signature

```typescript
function any<Value>(accept: (value: Value) => boolean): (list: Array<Value>) => boolean
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const hasEven = chain.of(numbers)
  .and(list.any(n => n % 2 === 0))
  .value();

console.log(hasEven);
// => true
```

#### all

Checks if all elements in the `Array` satisfy the provided `accept` predicate.

##### Signature

```typescript
function all<Value>(accept: (value: Value) => boolean): (list: Array<Value>) => boolean
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [2, 4, 6];
const allEven = chain.of(numbers)
  .and(list.all(n => n % 2 === 0))
  .value();

console.log(allEven);
// => true

const mixedNumbers = [1, 2, 3];
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
function find<Value>(accept: (value: Value) => boolean): (list: Array<Value>) => maybe.Maybe<Value>
```

##### Example

```typescript
import { chain, list, maybe } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const firstEven = chain.of(numbers)
  .and(list.find(n => n % 2 === 0))
  .and(maybe.or(0))
  .value();

console.log(firstEven);
// => 2

const notFound = chain.of(numbers)
  .and(list.find(n => n > 10))
  .and(maybe.or(0))
  .value();

console.log(notFound);
// => 0
```

#### position

Returns a `Maybe` containing the index of the first element that satisfies the `is` predicate, or `none` if no such element is found.

##### Signature

```typescript
function position<Value>(is: (value: Value) => boolean): (list: Array<Value>) => maybe.Maybe<number>
```

##### Example

```typescript
import { chain, list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30, 20];
const indexOf20 = chain.of(numbers)
  .and(list.position(n => n === 20))
  .and(maybe.or(-1))
  .value();

console.log(indexOf20);
// => 1

const indexOf40 = chain.of(numbers)
  .and(list.position(n => n === 40))
  .and(maybe.or(-1))
  .value();

console.log(indexOf40);
// => -1
```

#### append

Appends one or more new values to the end of the `Array`, returning a new `Array`.

##### Signature

```typescript
function append<Value>(...newValues: Value[]): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2];
const appendedList = chain.of(numbers)
  .and(list.append(3, 4))
  .value();

console.log(appendedList);
// => [1, 2, 3, 4]
```

#### enumerate

Returns a new `Array` of tuples, where each tuple contains the index and the value of the elements in the original `Array`.

##### Signature

```typescript
function enumerate<Value>(): (list: Array<Value>) => Array<[number, Value]>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const letters = ["a", "b", "c"];
const enumerated = chain.of(letters)
  .and(list.enumerate())
  .value();

console.log(enumerated);
// => [[0, "a"], [1, "b"], [2, "c"]]
```

#### each

Applies a side-effecting `effect` function to each element of the `Array`. Returns the original `Array` (for chaining).

##### Signature

```typescript
function each<Value>(effect: (value: Value) => void): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3];
chain.of(numbers)
  .and(list.each(n => console.log(`Processing: ${n}`)));
// => Processing: 1
// => Processing: 2
// => Processing: 3
```

#### sort

Returns a new `Array` with elements sorted in ascending order. (Uses default `toSorted()` behavior).

##### Signature

```typescript
function sort<Value>(): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const unsorted = [3, 1, 2];
const sorted = chain.of(unsorted)
  .and(list.sort())
  .value();

console.log(sorted);
// => [1, 2, 3]
```

#### indices

Returns a new `Array` containing the indices of the elements in the original `Array`.

##### Signature

```typescript
function indices<Value>(): (list: Array<Value>) => Array<number>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const letters = ["a", "b", "c"];
const listIndices = chain.of(letters)
  .and(list.indices())
  .value();

console.log(listIndices);
// => [0, 1, 2]
```

#### has

Checks if any element in the `Array` satisfies the provided `condition` predicate.

##### Signature

```typescript
function has<Value>(condition: (value: Value) => boolean): (list: Array<Value>) => boolean
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
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

Returns a new `Array` with the first `count` elements removed.

##### Signature

```typescript
function drop<Value>(count: number): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const droppedList = chain.of(numbers)
  .and(list.drop(2))
  .value();

console.log(droppedList);
// => [3, 4, 5]
```

#### dropLast

Returns a new `Array` with the last `count` elements removed.

##### Signature

```typescript
function dropLast<Value>(count: number): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const droppedLastList = chain.of(numbers)
  .and(list.dropLast(2))
  .value();

console.log(droppedLastList);
// => [1, 2, 3]
```

#### dropUntil

Returns a new `Array` by dropping elements from the beginning until the `condition` predicate returns `true`. The element that satisfies the condition is included.

##### Signature

```typescript
function dropUntil<Value>(condition: (value: Value) => boolean): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const droppedUntilList = chain.of(numbers)
  .and(list.dropUntil(n => n >= 3))
  .value();

console.log(droppedUntilList);
// => [3, 4, 5]
```

#### take

Returns a new `Array` containing the first `count` elements.

##### Signature

```typescript
function take<Value>(count: number): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const takenList = chain.of(numbers)
  .and(list.take(3))
  .value();

console.log(takenList);
// => [1, 2, 3]
```

#### takeLast

Returns a new `Array` containing the last `count` elements.

##### Signature

```typescript
function takeLast<Value>(count: number): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const takenLastList = chain.of(numbers)
  .and(list.takeLast(3))
  .value();

console.log(takenLastList);
// => [3, 4, 5]
```

#### takeUntil

Returns a new `Array` by taking elements from the beginning until the `condition` predicate returns `true`. The element that satisfies the condition is *not* included.

##### Signature

```typescript
function takeUntil<Value>(condition: (value: Value) => boolean): (list: Array<Value>) => Array<Value>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const takenUntilList = chain.of(numbers)
  .and(list.takeUntil(n => n >= 3))
  .value();

console.log(takenUntilList);
// => [1, 2]
```

#### zip

Combines two `Array` instances into a new `Array` of pairs, where the i-th pair contains the i-th element from each of the input arrays. The length of the resulting array is the minimum of the two input array lengths.

##### Signature

```typescript
function zip<Value, OtherValue>(other: Array<OtherValue>): (list: Array<Value>) => Array<[Value, OtherValue]>
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const list1 = [1, 2, 3];
const list2 = ["a", "b", "c", "d"];
const zippedList = chain.of(list1)
  .and(list.zip(list2))
  .value();

console.log(zippedList);
// => [[1, "a"], [2, "b"], [3, "c"]]
```

#### upgrade

Reduces a list to a single value by applying a reducer function to each element.

##### Signature

```typescript
function upgrade<Value, NewValue>(value: NewValue, reducer: (previous: NewValue, current: Value) => NewValue): (list: Array<Value>) => NewValue
```

##### Example

```typescript
import { chain, list } from "@aminnairi/prelude";

const sum = chain.of([1, 2, 3, 4, 5])
  .and(list.upgrade(0, (total, num) => total + num))
  .value();

console.log(sum);
// => 15
```

### future

The `future` module provides a way to represent asynchronous operations that may succeed with a value or fail with an issue, similar to Promises but with a functional approach.

#### UnexpectedIssue

Represents an unexpected error that occurred within a `Future` operation, typically from synchronous exceptions.

##### Signature

```typescript
class UnexpectedIssue extends Error {
  readonly name: "UnexpectedIssue";
  constructor(error: unknown);
}
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const throwingFuture = future.of(() => {
  throw new Error("Something unexpected happened");
});

throwingFuture.when(
  value => console.log(value),
  issue => {
    if (issue instanceof future.UnexpectedIssue) {
      console.error("Unexpected Error Caught:", issue.error);
    }
  }
);
// => Unexpected Error Caught: Error: Something unexpected happened
```

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

#### when

Executes `success` callback if the `Future` succeeds, or `failure` callback if it fails. Returns the original `Future` (for chaining).

##### Signature

```typescript
function when<Value, Issue>(success: (value: Value) => void, failure: (issue: Issue | UnexpectedIssue) => void): (future: Future<Value, Issue>) => Future<Value, Issue>
```

##### Example

```typescript
import { chain, future } from "@aminnairi/prelude";

const myFuture = future.succeed("Hello");

chain.of(myFuture)
  .and(future.when(
    value => console.log("Success:", value),
    error => console.error("Failure:", error)
  ));
// => Success: Hello
```

### pattern

The `pattern` module provides utility functions for working with regular expressions in a functional manner.

#### test

Tests whether a string matches a given regular expression pattern.

##### Signature

```typescript
function test(pattern: RegExp): (input: string) => boolean
```

##### Example

```typescript
import { chain, pattern } from "@aminnairi/prelude";

const hasNumber = chain.of("hello123world")
  .and(pattern.test(/\d+/))
  .value();

console.log(hasNumber);
// => true

const hasNoNumber = chain.of("helloworld")
  .and(pattern.test(/\d+/))
  .value();

console.log(hasNoNumber);
// => false
```

### http

The `http` module provides functions for making HTTP requests and handling responses in a functional way, utilizing the `Future` and `Maybe` modules for asynchronous operations and optional values.

#### HttpError

Represents an error that occurred during an HTTP request.

##### Signature

```typescript
class HttpError extends Error {
  readonly name: "HttpError";
  constructor(error: unknown);
}
```

##### Example

```typescript
import { chain, future, http } from "@aminnairi/prelude";

chain.of("https://invalid.url")
  .and(http.get)
  .value()
  .when(
    value => console.log("Success:", value),
    issue => {
      if (issue instanceof http.HttpError) {
        console.error("HTTP Error:", issue.error);
      } else {
        console.error("Unexpected Error:", issue);
      }
    }
  );
// => HTTP Error: ... (fetch error)
```

#### JsonError

Represents an error that occurred during JSON parsing of an HTTP response.

##### Signature

```typescript
class JsonError extends Error {
  readonly name: "JsonError";
  constructor(error: Error);
}
```

##### Example

```typescript
import { chain, future, http } from "@aminnairi/prelude";

// Assuming a response that is not valid JSON
const invalidJsonResponse = new Response("not json", { status: 200 });

chain.of(invalidJsonResponse)
  .and(http.json)
  .value()
  .when(
    value => console.log("Success:", value),
    issue => {
      if (issue instanceof http.JsonError) {
        console.error("JSON Error:", issue.error.message);
      } else {
        console.error("Unexpected Error:", issue);
      }
    }
  );
// => JSON Error: SyntaxError: Unexpected token 'o', "not json" is not valid JSON
```

#### get

Sends an HTTP GET request to the specified URL.

##### Signature

```typescript
function get(url: string, options?: RequestInit): Future<Response, HttpError | future.UnexpectedIssue>
```

##### Example

```typescript
import { chain, future, http } from "@aminnairi/prelude";

chain.of("https://jsonplaceholder.typicode.com/todos/1")
  .and(http.get)
  .value()
  .when(
    response => console.log("Status:", response.status),
    issue => console.error("Error:", issue)
  );
// => Status: 200
```

#### json

Parses the body of an HTTP Response as JSON.

##### Signature

```typescript
function json(response: Response): Future<JSON, JsonError | future.UnexpectedIssue>
```

##### Example

```typescript
import { chain, future, http } from "@aminnairi/prelude";

chain.of("https://jsonplaceholder.typicode.com/todos/1")
  .and(http.get)
  .and(future.upgrade(http.json))
  .value()
  .when(
    data => console.log("Data:", data),
    issue => console.error("Error:", issue)
  );
// => Data: { userId: 1, id: 1, title: 'delectus aut autem', completed: false }


#### between

Checks if a number is inclusively between a `lowerbound` and an `upperbound`.

##### Signature

```typescript
function between(lowerbound: number, upperbound: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isBetween = chain.of(5)
  .and(numeric.between(1, 10))
  .value();

console.log(isBetween);
// => true

const isNotBetween = chain.of(15)
  .and(numeric.between(1, 10))
  .value();

console.log(isNotBetween);
// => false
```

#### equalTo

Checks if a number is equal to another number.

##### Signature

```typescript
function equalTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isEqual = chain.of(5)
  .and(numeric.equalTo(5))
  .value();

console.log(isEqual);
// => true
```

#### differentThan

Checks if a number is different from another number.

##### Signature

```typescript
function differentThan(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isDifferent = chain.of(5)
  .and(numeric.differentThan(10))
  .value();

console.log(isDifferent);
// => true
```

#### greaterThan

Checks if a number is greater than another number.

##### Signature

```typescript
function greaterThan(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isGreater = chain.of(10)
  .and(numeric.greaterThan(5))
  .value();

console.log(isGreater);
// => true
```

#### lowerThan

Checks if a number is lower than another number.

##### Signature

```typescript
function lowerThan(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isLower = chain.of(5)
  .and(numeric.lowerThan(10))
  .value();

console.log(isLower);
// => true
```

#### greaterOrEqualTo

Checks if a number is greater than or equal to another number.

##### Signature

```typescript
function greaterOrEqualTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isGreaterOrEqual = chain.of(10)
  .and(numeric.greaterOrEqualTo(10))
  .value();

console.log(isGreaterOrEqual);
// => true
```

#### lowerOrEqualTo

Checks if a number is lower than or equal to another number.

##### Signature

```typescript
function lowerOrEqualTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isLowerOrEqual = chain.of(5)
  .and(numeric.lowerOrEqualTo(5))
  .value();

console.log(isLowerOrEqual);
// => true
```

#### divisibleBy

Checks if a number is divisible by another number.

##### Signature

```typescript
function divisibleBy(divider: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isDivisible = chain.of(10)
  .and(numeric.divisibleBy(2))
  .value();

console.log(isDivisible);
// => true
```

#### add

Adds one or more numbers to an initial number.

##### Signature

```typescript
function add(...seconds: number[]): (first: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const sum = chain.of(5)
  .and(numeric.add(3))
  .value();

console.log(sum);
// => 8
```

##### Example with multiple numbers

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const total = chain.of(10)
  .and(numeric.add(1, 2, 3)) // Adds 1, 2, and 3 to 10
  .value();

console.log(total);
// => 16
```

#### subtract

Subtracts the `second` number from the `first` number.

##### Signature

```typescript
function subtract(second: number): (first: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const difference = chain.of(10)
  .and(numeric.subtract(4))
  .value();

console.log(difference);
// => 6
```

#### multiply

Multiplies two numbers.

##### Signature

```typescript
function multiply(second: number): (first: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const product = chain.of(6)
  .and(numeric.multiply(7))
  .value();

console.log(product);
// => 42
```

#### divide

Divides the `first` number by the `second` number. Returns a `Maybe<number>` to handle division by zero.

##### Signature

```typescript
function divide(second: number): (first: number) => maybe.Maybe<number>
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const quotient = chain.of(10)
  .and(numeric.divide(2))
  .value();

console.log(quotient.or(0));
// => 5

const divisionByZero = chain.of(10)
  .and(numeric.divide(0))
  .value();

console.log(divisionByZero.or(0));
// => 0
```

#### toPower

Raises a number to the power of another number.

##### Signature

```typescript
function toPower(power: number): (numeric: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const result = chain.of(2)
  .and(numeric.toPower(3))
  .value();

console.log(result);
// => 8
```

#### maximum

Returns the maximum of the given number and additional numbers.

##### Signature

```typescript
function maximum(...numerics: number[]): (numeric: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const maxNumber = chain.of(5)
  .and(numeric.maximum(10, 2))
  .value();

console.log(maxNumber);
// => 10
```

#### minimum

Returns the minimum of the given number and additional numbers.

##### Signature

```typescript
function minimum(...numerics: number[]): (numeric: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const minNumber = chain.of(5)
  .and(numeric.minimum(10, 2))
  .value();

console.log(minNumber);
// => 2
```

#### compare

Compares two numbers and returns a `Comparison` enum indicating whether the first is `Greater`, `Lower`, or `Equal` to the second.

##### Signature

```typescript
function compare(second: number): (first: number) => Comparison
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const comparisonResult = chain.of(10)
  .and(numeric.compare(5))
  .value();

console.log(comparisonResult === numeric.Comparison.Greater);
// => true
```

### numeric

The `numeric` module provides functions for performing immutable numeric operations and comparisons using a functional approach.

#### Comparison

An enumeration representing the result of a comparison between two numbers.

##### Signature

```typescript
enum Comparison {
  Greater,
  Lower,
  Equal,
}
```

#### between

Checks if a number is inclusively between a `lowerbound` and an `upperbound`.

##### Signature

```typescript
function between(lowerbound: number, upperbound: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isBetween = chain.of(5)
  .and(numeric.between(1, 10))
  .value();

console.log(isBetween);
// => true

const isNotBetween = chain.of(15)
  .and(numeric.between(1, 10))
  .value();

console.log(isNotBetween);
// => false
```

#### equalTo

Checks if a number is equal to another number.

##### Signature

```typescript
function equalTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isEqual = chain.of(5)
  .and(numeric.equalTo(5))
  .value();

console.log(isEqual);
// => true
```

#### differentThan

Checks if a number is different from another number.

##### Signature

```typescript
function differentThan(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isDifferent = chain.of(5)
  .and(numeric.differentThan(10))
  .value();

console.log(isDifferent);
// => true
```

#### greaterThan

Checks if a number is greater than another number.

##### Signature

```typescript
function greaterThan(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isGreater = chain.of(10)
  .and(numeric.greaterThan(5))
  .value();

console.log(isGreater);
// => true
```

#### lowerThan

Checks if a number is lower than another number.

##### Signature

```typescript
function lowerThan(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isLower = chain.of(5)
  .and(numeric.lowerThan(10))
  .value();

console.log(isLower);
// => true
```

#### greaterOrEqualTo

Checks if a number is greater than or equal to another number.

##### Signature

```typescript
function greaterOrEqualTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isGreaterOrEqual = chain.of(10)
  .and(numeric.greaterOrEqualTo(10))
  .value();

console.log(isGreaterOrEqual);
// => true
```

#### lowerOrEqualTo

Checks if a number is lower than or equal to another number.

##### Signature

```typescript
function lowerOrEqualTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isLowerOrEqual = chain.of(5)
  .and(numeric.lowerOrEqualTo(5))
  .value();

console.log(isLowerOrEqual);
// => true
```

#### divisibleBy

Checks if a number is divisible by another number.

##### Signature

```typescript
function divisibleBy(divider: number): (numeric: number) => boolean
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const isDivisible = chain.of(10)
  .and(numeric.divisibleBy(2))
  .value();

console.log(isDivisible);
// => true
```

#### add

Adds one or more numbers to an initial number.

##### Signature

```typescript
function add(...seconds: number[]): (first: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const sum = chain.of(5)
  .and(numeric.add(3))
  .value();

console.log(sum);
// => 8
```

##### Example with multiple numbers

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const total = chain.of(10)
  .and(numeric.add(1, 2, 3)) // Adds 1, 2, and 3 to 10
  .value();

console.log(total);
// => 16
```

#### subtract

Subtracts the `second` number from the `first` number.

##### Signature

```typescript
function subtract(second: number): (first: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const difference = chain.of(10)
  .and(numeric.subtract(4))
  .value();

console.log(difference);
// => 6
```

#### multiply

Multiplies two numbers.

##### Signature

```typescript
function multiply(second: number): (first: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const product = chain.of(6)
  .and(numeric.multiply(7))
  .value();

console.log(product);
// => 42
```

#### divide

Divides the `first` number by the `second` number. Returns a `Maybe<number>` to handle division by zero.

##### Signature

```typescript
function divide(second: number): (first: number) => maybe.Maybe<number>
```

##### Example

```typescript
import { chain, numeric, maybe } from "@aminnairi/prelude";

const quotient = chain.of(10)
  .and(numeric.divide(2))
  .and(maybe.or(0))
  .value();

console.log(quotient);
// => 5

const divisionByZero = chain.of(10)
  .and(numeric.divide(0))
  .and(maybe.or(0))
  .value();

console.log(divisionByZero);
// => 0
```

#### toPower

Raises a number to the power of another number.

##### Signature

```typescript
function toPower(power: number): (numeric: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const result = chain.of(2)
  .and(numeric.toPower(3))
  .value();

console.log(result);
// => 8
```

#### maximum

Returns the maximum of the given number and additional numbers.

##### Signature

```typescript
function maximum(...numerics: number[]): (numeric: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const maxNumber = chain.of(5)
  .and(numeric.maximum(10, 2))
  .value();

console.log(maxNumber);
// => 10
```

#### minimum

Returns the minimum of the given number and additional numbers.

##### Signature

```typescript
function minimum(...numerics: number[]): (numeric: number) => number
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const minNumber = chain.of(5)
  .and(numeric.minimum(10, 2))
  .value();

console.log(minNumber);
// => 2
```

#### compare

Compares two numbers and returns a `Comparison` enum indicating whether the first is `Greater`, `Lower`, or `Equal` to the second.

##### Signature

```typescript
function compare(second: number): (first: number) => Comparison
```

##### Example

```typescript
import { chain, numeric } from "@aminnairi/prelude";

const comparisonResult = chain.of(10)
  .and(numeric.compare(5))
  .value();

console.log(comparisonResult === numeric.Comparison.Greater);
// => true


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