import * as list from "./list";
import * as chain from "./chain";
import * as text from "./text";
import { test, expect, vi } from "vitest";

test("toArray", () => {
  const array = [1, 2, 3];

  expect(array).toStrictEqual([1, 2, 3]);
});

test("first", () => {
  const emptyList = list
    .first()([])
    .or(0);

  const filledList = list
    .first()([1, 2, 3])
    .or(0);

  expect(emptyList).toStrictEqual(0);
  expect(filledList).toStrictEqual(1);
});

test("last", () => {
  const emptyList = list
    .last()([])
    .or(0);

  const filledList = list
    .last()([1, 2, 3])
    .or(0);

  expect(emptyList).toStrictEqual(0);
  expect(filledList).toStrictEqual(3);
});

test("at", () => {
  const emptyList = list
    .at(1)([])
    .or(0);

  const filledList = list
    .at(1)([1, 2, 3])
    .or(0);

  expect(emptyList).toStrictEqual(0);
  expect(filledList).toStrictEqual(2);
});

test("keep", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.keep(value => value % 2 === 0))
    .value();

  expect(result).toStrictEqual([2, 4]);
});

test("remove", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.remove(value => value % 2 !== 0))
    .value();

  expect(result).toStrictEqual([2, 4]);
});

test("count", () => {
  const result = chain
    .of([1, 2, 3])
    .and(list.count())
    .value();

  expect(result).toStrictEqual(3);
});

test("update", () => {
  const result = chain
    .of([1, 2, 3])
    .and(list.update(value => value * 2))
    .value();

  expect(result).toStrictEqual([2, 4, 6]);
});

test("any", () => {
  const firstResult = chain
    .of([1, 2, 3])
    .and(list.any(value => value > 0))
    .value();

  const secondResult = chain
    .of([1, 2, 3])
    .and(list.any(value => value > 5))
    .value();

  expect(firstResult).toBe(true);
  expect(secondResult).toBe(false);
});

test("all", () => {
  const firstResult = chain
    .of([1, 2, 3])
    .and(list.all(value => value > 0))
    .value();

  const secondResult = chain
    .of([1, 2, 3])
    .and(list.all(value => value > 5))
    .value();

  expect(firstResult).toBe(true);
  expect(secondResult).toBe(false);
});

test("find", () => {
  const found = list
    .find(value => value === 2)([1, 2, 3])
    .or(0);

  const notFound = list
    .find(value => value === 5)([1, 2, 3])
    .or(0);

  expect(found).toStrictEqual(2);
  expect(notFound).toStrictEqual(0);
});

test("position", () => {
  const found = list
    .position(value => value === 2)([1, 2, 3])
    .or(-1);

  const notFound = list
    .position(value => value === 5)([1, 2, 3])
    .or(-1);

  expect(found).toStrictEqual(1);
  expect(notFound).toStrictEqual(-1);
});

test("updateAt", () => {
  const resultWithUpdate = chain
    .of([1, 2, 3])
    .and(list.updateAt(1, value => value * 2))
    .value();

  const resultWithoutUpdate = chain
    .of([1, 2, 3])
    .and(list.updateAt(5, value => value * 2))
    .value();

  expect(resultWithUpdate).toStrictEqual([1, 4, 3]);
  expect(resultWithoutUpdate).toStrictEqual([1, 2, 3]);
});

test("append", () => {
  const result = chain
    .of([1, 2, 3])
    .and(list.append(4, 5, 6))
    .value();

  expect(result).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test("removeAt", () => {
  const result = chain
    .of([1, 2, 3])
    .and(list.removeAt(2))
    .value();

  expect(result).toStrictEqual([1, 2]);
});

test("enumerate", () => {
  const result = chain
    .of([1, 2, 3])
    .and(list.enumerate())
    .value();

  expect(result).toStrictEqual([[0, 1], [1, 2], [2, 3]]);
});

test("each", () => {
  const effect = vi.fn();

  chain
    .of([1, 2, 3])
    .and(list.each(effect));

  expect(effect).toHaveBeenCalledTimes(3);
});

test("sort", () => {
  const original = [3, 1, 2];
  const sorted = chain.of(original).and(list.sort()).value();

  expect(original).toStrictEqual([3, 1, 2]);
  expect(sorted).toStrictEqual([1, 2, 3]);
});

test("indices", () => {
  const result = chain
    .of([9, 8, 7])
    .and(list.indices())
    .value();

  expect(result).toStrictEqual([0, 1, 2]);
});

test("has", () => {
  const resultFound = chain
    .of([1, 2, 3])
    .and(list.has((value) => value === 2))
    .value();


  const resultNotFound = chain
    .of([1, 2, 3])
    .and(list.has((value) => value === 5))
    .value();

  expect(resultFound).toBe(true);
  expect(resultNotFound).toBe(false);
});

test("join", () => {
  const result = chain
    .of([1, 2, 3])
    .and(list.join("-"))
    .value();

  expect(result).toStrictEqual("1-2-3");
});

test("drop", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.drop(2))
    .value();

  expect(result).toStrictEqual([3, 4, 5]);
});

test("dropLast", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.dropLast(2))
    .value();

  expect(result).toStrictEqual([1, 2, 3]);
});

test("dropUntil", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.dropUntil(value => value < 3))
    .value();

  const emptyResult = chain
    .of([])
    .and(list.dropUntil(value => value < 3))
    .value();

  expect(result).toStrictEqual([3, 4, 5]);
  expect(emptyResult).toStrictEqual([]);
});

test("take", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.take(3))
    .value();

  expect(result).toStrictEqual([1, 2, 3]);
});

test("takeLast", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.takeLast(3))
    .value();

  expect(result).toStrictEqual([3, 4, 5]);
});

test("takeUntil", () => {
  const result = chain
    .of([1, 2, 3, 4, 5])
    .and(list.takeUntil((value) => value > 3))
    .value();

  const emptyResult = chain
    .of([])
    .and(list.takeUntil(value => value > 3))
    .value();

  expect(result).toStrictEqual([1, 2, 3]);
  expect(emptyResult).toStrictEqual([]);
});

test("zip", () => {
  const result = chain
    .of([1, 3, 5])
    .and(list.zip([2, 4, 6]))
    .value();

  const emptyListResult = chain
    .of([1, 2, 3])
    .and(list.zip([]))
    .value();

  expect(result).toStrictEqual([[1, 2], [3, 4], [5, 6]]);
  expect(emptyListResult).toStrictEqual([]);
});

test("upgrade", () => {
  const value = chain
    .of([1, 2, 3, 4, 5])
    .and(list.upgrade(0, (total, value) => total + value))
    .value();

  expect(value).toStrictEqual(15);
});
