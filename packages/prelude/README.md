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
import { maybe } from "@aminnairi/prelude";

const result = maybe.some(10).and(value => value * 2);
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
import { maybe } from "@aminnairi/prelude";

const result = maybe.none<number>().and(value => value * 2);
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
  .link();

console.log(valueWithSome);
// => 10

const valueWithNone = chain.of(maybe.none<number>())
  .and(maybe.or(5))
  .link();

console.log(valueWithNone);
// => 5
```

#### and

A curried function that applies a function to the value inside a `Maybe`.

##### Signature

```typescript
export const and: <Value, NewValue>(update: (value: Value) => NewValue) => (maybe: Maybe<Value>) => Maybe<NewValue>;
```

##### Example

```typescript
import { chain, maybe } from "@aminnairi/prelude";

const result = chain.of(maybe.some(10))
  .and(maybe.and(value => value * 2))
  .link();

console.log(result.or(0));
// => 20
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

### basic

The `basic` module provides fundamental utilities for function composition.

#### pipe

Returns a new function that composes two functions, where the output of the first function becomes the input of the second function.

##### Signature

```typescript
function pipe<Input, Output, Value>(second: (input: Output) => Value): (first: (input: Input) => Output) => (input: Input) => Value
```

##### Example

```typescript
import { basic, chain } from "@aminnairi/prelude";

const addOne = (num: number) => num + 1;
const multiplyByTwo = (num: number) => num * 2;

const addOneThenMultiplyByTwo = chain.of(addOne)
  .and(basic.pipe(multiplyByTwo))
  .link();

console.log(addOneThenMultiplyByTwo(5));
// => 12 ((5 + 1) * 2)
```

#### peek

Allows "peeking" at a value in a chain for debugging or side-effects without altering the value. It can be used in a curried manner within a chain or directly with a value.

##### Signature

```typescript
function peek<Value>(callback: (value: Value) => void): (value: Value) => void;
function peek<Value>(callback: (value: Value) => void, value: Value): void;
```

##### Example (curried)

```typescript
import { basic, chain } from "@aminnairi/prelude";

chain.of(123)
  .and(basic.peek(console.log)) // logs 123
  .and(value => value * 2)
  .and(basic.peek(console.log)); // logs 246
```

##### Example (direct)

```typescript
import { basic } from "@aminnairi/prelude";

basic.peek(console.log, "hello"); // logs "hello"
```

### boolean

The `boolean` module provides functions for logical operations.

#### not

Returns a new function that negates the boolean result of the input `callback` function.

##### Signature

```typescript
function not<Parameters extends Array<unknown>>(callback: (...parameters: Parameters) => boolean): (...args: Parameters) => boolean
```

##### Example

```typescript
import { boolean } from "@aminnairi/prelude";

const isEven = (num: number) => num % 2 === 0;
const isOdd = boolean.not(isEven);

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
import { chain, boolean } from "@aminnairi/prelude";

const isEven = (num: number) => num % 2 === 0;
const isPositive = (num: number) => num > 0;

const isEvenAndPositive = chain.of(isEven)
  .and(boolean.and(isPositive))
  .link();

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
import { chain, boolean } from "@aminnairi/prelude";

const isEven = (num: number) => num % 2 === 0;
const isNegative = (num: number) => num < 0;

const isEvenOrNegative = chain.of(isEven)
  .and(boolean.or(isNegative))
  .link();

console.log(isEvenOrNegative(3));
// => false
console.log(isEvenOrNegative(-5));
// => true
console.log(isEvenOrNegative(4));
// => true
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
import { future } from "@aminnairi/prelude";

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
import { future } from "@aminnairi/prelude";

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
import { future } from "@aminnairi/prelude";

const success = future.succeed("Data Loaded");

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
import { future } from "@aminnairi/prelude";

const failure = future.fail("Network Error");

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

const aFuture = future.succeed(10);

const doubled = chain.of(aFuture)
  .and(future.update(value => value * 2))
  .link();

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

const userProfile = chain.of(future.succeed(123))
  .and(future.upgrade(fetchData))
  .link();

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

### http

The `http` module provides functions for making HTTP requests and handling responses in a functional way, utilizing the `Future` and `Maybe` modules for asynchronous operations and optional values.

#### HttpError

Represents an error that occurred during an HTTP request.

##### Signature

```typescript
class HttpError extends Error {
  readonly name: "HttpError";
  constructor(public readonly error: unknown);
}
```

#### JsonError

Represents an error that occurred during JSON parsing of an HTTP response.

##### Signature

```typescript
class JsonError extends Error {
  readonly name: "JsonError";
  constructor(public readonly error: Error);
}
```

#### getText

Sends an HTTP GET request to the specified URL. It returns a `Future` which resolves with a `Response` object.

##### Signature

```typescript
function getText(url: string, options?: RequestInit): future.Future<Response, HttpError | future.UnexpectedIssue>
```

##### Example

```typescript
import { http } from "@aminnairi/prelude";

http.getText("https://jsonplaceholder.typicode.com/users")
  .when(
    response => {
      console.log(response.status);
    },
    issue => {
      console.error(issue);
    }
  );
```

#### getJson

Sends an HTTP GET request and parses the response body as JSON. It returns a `Future` which resolves with the JSON data.

##### Signature

```typescript
function getJson(url: string, options?: RequestInit): future.Future<JSON, JsonError | future.UnexpectedIssue>
```

##### Example

```typescript
import { http } from "@aminnairi/prelude";

http.getJson("https://jsonplaceholder.typicode.com/users")
  .when(
    json => {
      console.log(json);
    },
    issue => {
      console.error(issue);
    }
  );
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
import { list } from "@aminnairi/prelude";

const newList = list.of(1, 2, 3, 4);

console.log(newList);
// => [1, 2, 3, 4]
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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
import { list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const firstNumber = list.first()(numbers).or(0);

console.log(firstNumber);
// => 10

const emptyList: number[] = [];
const noNumber = list.first()(emptyList).or(0);

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
import { list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const lastNumber = list.last()(numbers).or(0);

console.log(lastNumber);
// => 30

const emptyList: number[] = [];
const noNumber = list.last()(emptyList).or(0);

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
import { list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30];
const numberAtOne = list.at(1)(numbers).or(0);

console.log(numberAtOne);
// => 20

const numberAtFive = list.at(5)(numbers).or(0);

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
  .link();

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
  .link();

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
  .link();

console.log(allEven);
// => true

const mixedNumbers = [1, 2, 3];
const allEvenMixed = chain.of(mixedNumbers)
  .and(list.all(n => n % 2 === 0))
  .link();

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
import { list, maybe } from "@aminnairi/prelude";

const numbers = [1, 2, 3, 4, 5];
const firstEven = list.find((n: number) => n % 2 === 0)(numbers).or(0);

console.log(firstEven);
// => 2
```

#### position

Returns a `Maybe` containing the index of the first element that satisfies the `is` predicate, or `none` if no such element is found.

##### Signature

```typescript
function position<Value>(is: (value: Value) => boolean): (list: Array<Value>) => maybe.Maybe<number>
```

##### Example

```typescript
import { list, maybe } from "@aminnairi/prelude";

const numbers = [10, 20, 30, 20];
const indexOf20 = list.position((n: number) => n === 20)(numbers).or(-1);

console.log(indexOf20);
// => 1
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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

console.log(hasTwenty);
// => true

const hasForty = chain.of(numbers)
  .and(list.has(n => n === 40))
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

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
  .link();

console.log(sum);
// => 15
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
import { numeric } from "@aminnairi/prelude";

const isBetween = numeric.between(1, 10)(5);
console.log(isBetween);
// => true
```

#### equalTo

Checks if a number is equal to another number.

##### Signature

```typescript
function equalTo(other: number): (numeric: number) => boolean
```

##### Example

```typescript
import { numeric } from "@aminnairi/prelude";

const isEqual = numeric.equalTo(5)(5);
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
import { numeric } from "@aminnairi/prelude";

const isDifferent = numeric.differentThan(10)(5);
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
import { numeric } from "@aminnairi/prelude";

const isGreater = numeric.greaterThan(5)(10);
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
import { numeric } from "@aminnairi/prelude";

const isLower = numeric.lowerThan(10)(5);
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
import { numeric } from "@aminnairi/prelude";

const isGreaterOrEqual = numeric.greaterOrEqualTo(10)(10);
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
import { numeric } from "@aminnairi/prelude";

const isLowerOrEqual = numeric.lowerOrEqualTo(5)(5);
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
import { numeric } from "@aminnairi/prelude";

const isDivisible = numeric.divisibleBy(2)(10);
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
import { numeric } from "@aminnairi/prelude";

const sum = numeric.add(3)(5);
console.log(sum);
// => 8
```

##### Example with multiple numbers

```typescript
import { numeric } from "@aminnairi/prelude";

const total = numeric.add(1, 2, 3)(10);
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
import { numeric } from "@aminnairi/prelude";

const difference = numeric.subtract(4)(10);
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
import { numeric } from "@aminnairi/prelude";

const product = numeric.multiply(7)(6);
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
import { numeric, maybe } from "@aminnairi/prelude";

const quotient = numeric.divide(2)(10).or(0);
console.log(quotient);
// => 5

const divisionByZero = numeric.divide(0)(10).or(0);
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
import { numeric } from "@aminnairi/prelude";

const result = numeric.toPower(3)(2);
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
import { numeric } from "@aminnairi/prelude";

const maxNumber = numeric.maximum(10, 2)(5);
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
import { numeric } from "@aminnairi/prelude";

const minNumber = numeric.minimum(10, 2)(5);
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
import { numeric } from "@aminnairi/prelude";

const comparisonResult = numeric.compare(5)(10);

console.log(comparisonResult === numeric.Comparison.Greater);
// => true
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
import { pattern } from "@aminnairi/prelude";

const hasNumber = pattern.test(/\d+/)("hello123world");
console.log(hasNumber);
// => true
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
import { text } from "@aminnairi/prelude";

const numToString = text.from(123);
console.log(numToString);
// => "123"
```

#### count

Returns the number of characters in a string.

##### Signature

```typescript
function count(): (text: string) => number
```

##### Example

```typescript
import { text } from "@aminnairi/prelude";

const textLength = text.count()("Hello World");
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
import { text } from "@aminnairi/prelude";

const greeting = text.concatenate(" World")("Hello");
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
import { text } from "@aminnairi/prelude";

const capitalized = text.updateAll(char => char.toUpperCase())("hello");
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
import { text } from "@aminnairi/prelude";

const modifiedText = text.updateAt(0, char => char.toLowerCase())("Hello");
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
import { text } from "@aminnairi/prelude";

const multilineText = "Line 1\nLine 2\nLine 3";
const textLines = text.lines()(multilineText);
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
import { text } from "@aminnairi/prelude";

const commaSeparated = "apple,banana,orange";
const fruits = text.split(",")(commaSeparated);
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
import { text, maybe } from "@aminnairi/prelude";

const intString = "123";
const parsedInt = text.toInteger()(intString).or(0);
console.log(parsedInt);
// => 123
```

#### prefix

Adds a `prefix` string to the beginning of the current string.

##### Signature

```typescript
function prefix(prefix: string): (text: string) => string
```

##### Example

```typescript
import { text } from "@aminnairi/prelude";

const prefixedText = text.prefix("Hello, ")("world");
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
import { text } from "@aminnairi/prelude";

const suffixedText = text.suffix(" World!")("Hello");
console.log(suffixedText);
// => "Hello World!"
```

### web

The `web` module provides utilities for interacting with the DOM in a functional and type-safe manner.

#### getElementById

Retrieves an element by its ID. It returns a `Maybe` type to safely handle cases where the element might not exist in the DOM.

##### Signature

```typescript
function getElementById(id: string): maybe.Maybe<HTMLElement>
```

##### Example

```typescript
import { web } from "@aminnairi/prelude";

// Assuming an element with id="existing-element" exists
const element = web.getElementById("existing-element").or(null);
console.log(element.id);
// => "existing-element"

const nonExistent = web.getElementById("non-existing-element").or(null);
console.log(nonExistent);
// => null
```

#### toggleClass

Toggles a CSS class on a given DOM element. It can be used directly by providing the element, or in a curried fashion, which is useful in chains.

##### Signature

```typescript
function toggleClass(className: string, element: HTMLElement): HTMLElement;
function toggleClass(className: string): (element: HTMLElement) => HTMLElement;
```

##### Example (direct)

```typescript
import { web } from "@aminnairi/prelude";

const el = document.createElement("div");
web.toggleClass("active", el);
console.log(el.classList.contains("active"));
// => true
```

##### Example (curried)

```typescript
import { basic, chain, maybe, web } from "@aminnairi/prelude";

const toggle = chain
  .of(web.getElementById)
  .and(basic.pipe(maybe.and(web.toggleClass("active"))))
  .link();

const el = document.createElement("div");
el.id = "my-el";
document.body.appendChild(el);

toggle("my-el");

console.log(el.classList.contains("active"));
// => true
```

#### on

Attaches an event listener to a DOM element. It can be used directly by providing the element, or in a curried fashion.

##### Signature

```typescript
function on(name: string, handler: EventListenerOrEventListenerObject, element: HTMLElement): HTMLElement;
function on(name: string, handler: EventListenerOrEventListenerObject): (element: HTMLElement) => HTMLElement;
```

##### Example (direct)

```typescript
import { web } from "@aminnairi/prelude";

const button = document.createElement("button");
web.on("click", () => alert("clicked!"), button);

// button.click(); // would trigger alert
```

##### Example (curried)

```typescript
import { basic, chain, maybe, web } from "@aminnairi/prelude";

const setupClickListener = chain
  .of(web.getElementById)
  .and(basic.pipe(maybe.and(web.on("click", () => alert("Button clicked!")))))
  .link();

const button = document.createElement("button");
button.id = "my-button";
document.body.appendChild(button);

setupClickListener("my-button");
// button.click(); // would trigger alert
```