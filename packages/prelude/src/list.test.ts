import * as list from "./list";
import * as stream from "./stream";
import * as text from "./text";
import { test, expect, vi } from "vitest";

test("toArray", () => {
  const array = list.of(1, 2, 3).value();

  expect(array).toStrictEqual([1, 2, 3]);
});

test("first", () => {
  const emptyList = stream
    .of(list.of<number>())
    .next(list.first())
    .value()
    .or(0);

  const filledList = stream
    .of(list.of(1, 2, 3))
    .next(list.first())
    .value()
    .or(0);

  expect(emptyList).toStrictEqual(0);
  expect(filledList).toStrictEqual(1);
});

test("last", () => {
  const emptyList = stream
    .of(list.of<number>())
    .next(list.last())
    .value()
    .or(0);

  const filledList = stream
    .of(list.of(1, 2, 3))
    .next(list.last())
    .value()
    .or(0);

  expect(emptyList).toStrictEqual(0);
  expect(filledList).toStrictEqual(3);
});

test("at", () => {
  const emptyList = stream
    .of(list.of<number>())
    .next(list.at(1))
    .value()
    .or(0);

  const filledList = stream
    .of(list.of(1, 2, 3))
    .next(list.at(1))
    .value()
    .or(0);

  expect(emptyList).toStrictEqual(0);
  expect(filledList).toStrictEqual(2);
});

test("keep", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.keep(value => value % 2 === 0))
    .value()
    .value();

  expect(result).toStrictEqual([2, 4]);
});

test("remove", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.remove(value => value % 2 !== 0))
    .value()
    .value();

  expect(result).toStrictEqual([2, 4]);
});

test("count", () => {
  const result = stream
    .of(list.of(1, 2, 3))
    .next(list.count())
    .value();

  expect(result).toStrictEqual(3);
});

test("update", () => {
  const result = stream
    .of(list.of(1, 2, 3))
    .next(list.update(value => value * 2))
    .value()
    .value();

  expect(result).toStrictEqual([2, 4, 6]);
});

test("any", () => {
  const firstResult = stream
    .of(list.of(1, 2, 3))
    .next(list.any(value => value > 0))
    .value();

  const secondResult = stream
    .of(list.of(1, 2, 3))
    .next(list.any(value => value > 5))
    .value();

  expect(firstResult).toBe(true);
  expect(secondResult).toBe(false);
});

test("all", () => {
  const firstResult = stream
    .of(list.of(1, 2, 3))
    .next(list.all(value => value > 0))
    .value();

  const secondResult = stream
    .of(list.of(1, 2, 3))
    .next(list.all(value => value > 5))
    .value();

  expect(firstResult).toBe(true);
  expect(secondResult).toBe(false);
});

test("find", () => {
  const found = stream
    .of(list.of(1, 2, 3))
    .next(list.find(value => value === 2))
    .value()
    .or(0);

  const notFound = stream
    .of(list.of(1, 2, 3))
    .next(list.find(value => value === 5))
    .value()
    .or(0);

  expect(found).toStrictEqual(2);
  expect(notFound).toStrictEqual(0);
});

test("position", () => {
  const found = stream
    .of(list.of(1, 2, 3))
    .next(list.position(value => value === 2))
    .value()
    .or(-1);

  const notFound = stream
    .of(list.of(1, 2, 3))
    .next(list.position(value => value === 5))
    .value()
    .or(-1);

  expect(found).toStrictEqual(1);
  expect(notFound).toStrictEqual(-1);
});

test("updateAt", () => {
  const resultWithUpdate = stream
    .of(list.of(1, 2, 3))
    .next(list.updateAt(1, value => value * 2))
    .value()
    .value();

  const resultWithoutUpdate = stream
    .of(list.of(1, 2, 3))
    .next(list.updateAt(5, value => value * 2))
    .value()
    .value();

  expect(resultWithUpdate).toStrictEqual([1, 4, 3]);
  expect(resultWithoutUpdate).toStrictEqual([1, 2, 3]);
});

test("append", () => {
  const result = stream
    .of(list.of(1, 2, 3))
    .next(list.append(4, 5, 6))
    .value()
    .value();

  expect(result).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test("removeAt", () => {
  const result = stream
    .of(list.of(1, 2, 3))
    .next(list.removeAt(2))
    .value()
    .value();

  expect(result).toStrictEqual([1, 2]);
});

test("enumerate", () => {
  const result = stream
    .of(list.of(1, 2, 3))
    .next(list.enumerate())
    .value()
    .value();

  expect(result).toStrictEqual([[0, 1], [1, 2], [2, 3]]);
});

test("each", () => {
  const effect = vi.fn();

  stream
    .of(list.of(1, 2, 3))
    .next(list.each(effect));

  expect(effect).toHaveBeenCalledTimes(3);
});

test("sort", () => {
  const original = list.of(3, 1, 2);
  const sorted = stream.of(original).next(list.sort()).value().value();

  expect(original.value()).toStrictEqual([3, 1, 2]);
  expect(sorted).toStrictEqual([1, 2, 3]);
});

test("indices", () => {
  const result = stream
    .of(list.of(9, 8, 7))
    .next(list.indices())
    .value()
    .value();

  expect(result).toStrictEqual([0, 1, 2]);
});

test("has", () => {
  const resultFound = stream
    .of(list.of(1, 2, 3))
    .next(list.has((value) => value === 2))
    .value();


  const resultNotFound = stream
    .of(list.of(1, 2, 3))
    .next(list.has((value) => value === 5))
    .value();

  expect(resultFound).toBe(true);
  expect(resultNotFound).toBe(false);
});

test("join", () => {
  const result = stream
    .of(list.of(1, 2, 3))
    .next(list.join(text.of("-")))
    .value()
    .value();

  expect(result).toStrictEqual("1-2-3");
});

test("drop", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.drop(2))
    .value()
    .value();

  expect(result).toStrictEqual([3, 4, 5]);
});

test("dropLast", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.dropLast(2))
    .value()
    .value();

  expect(result).toStrictEqual([1, 2, 3]);
});

test("dropUntil", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.dropUntil(value => value < 3))
    .value()
    .value();

  const emptyResult = stream
    .of(list.of())
    .next(list.dropUntil(value => value < 3))
    .value()
    .value();

  expect(result).toStrictEqual([3, 4, 5]);
  expect(emptyResult).toStrictEqual([]);
});

test("take", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.take(3))
    .value()
    .value();

  expect(result).toStrictEqual([1, 2, 3]);
});

test("takeLast", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.takeLast(3))
    .value()
    .value();

  expect(result).toStrictEqual([3, 4, 5]);
});

test("takeUntil", () => {
  const result = stream
    .of(list.of(1, 2, 3, 4, 5))
    .next(list.takeUntil((value) => value > 3))
    .value()
    .value();

  const emptyResult = stream
    .of(list.of())
    .next(list.takeUntil(value => value > 3))
    .value()
    .value();

  expect(result).toStrictEqual([1, 2, 3]);
  expect(emptyResult).toStrictEqual([]);
});

test("zip", () => {
  const result = stream
    .of(list.of(1, 3, 5))
    .next(list.zip(list.of(2, 4, 6)))
    .value()
    .value();

  const emptyListResult = stream
    .of(list.of(1, 2, 3))
    .next(list.zip(list.of()))
    .value()
    .value();

  expect(result).toStrictEqual([1, 2, 3, 4, 5, 6]);
  expect(emptyListResult).toStrictEqual([1, 2, 3]);
});
