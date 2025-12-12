import * as list from "./list";
import { describe, test, expect, vi } from "vitest";

test("toArray", () => {
  const array = list.of(1, 2, 3).toArray();

  expect(array).toStrictEqual([1, 2, 3]);
});

test("first", () => {
  const emptyList = list.of<number>();
  const filledList = list.of(1, 2, 3);

  expect(emptyList.first().or(0)).toStrictEqual(0);
  expect(filledList.first().or(0)).toStrictEqual(1);
});

test("last", () => {
  const emptyList = list.of<number>();
  const filledList = list.of(1, 2, 3);

  expect(emptyList.last().or(0)).toStrictEqual(0);
  expect(filledList.last().or(0)).toStrictEqual(3);
});

test("at", () => {
  const emptyList = list.of<number>();
  const filledList = list.of(1, 2, 3);

  expect(emptyList.at(1).or(0)).toStrictEqual(0);
  expect(filledList.at(1).or(0)).toStrictEqual(2);
});

test("keep", () => {
  const result = list.of(1, 2, 3, 4, 5).keep(value => value % 2 === 0);

  expect(result.toArray()).toStrictEqual([2, 4]);
});

test("remove", () => {
  const result = list.of(1, 2, 3, 4, 5).remove(value => value % 2 !== 0);

  expect(result.toArray()).toStrictEqual([2, 4]);
});

test("count", () => {
  const result = list.of(1, 2, 3).count();

  expect(result).toStrictEqual(3);
});

test("update", () => {
  const result = list.of(1, 2, 3).updateAll(value => value * 2).toArray();

  expect(result).toStrictEqual([2, 4, 6]);
});

test("any", () => {
  const firstResult = list.of(1, 2, 3).any(value => value > 0);
  const secondResult = list.of(1, 2, 3).any(value => value > 5);

  expect(firstResult).toBe(true);
  expect(secondResult).toBe(false);
});

test("all", () => {
  const firstResult = list.of(1, 2, 3).all(value => value > 0);
  const secondResult = list.of(1, 2, 3).all(value => value > 5);

  expect(firstResult).toBe(true);
  expect(secondResult).toBe(false);
});

test("find", () => {
  const found = list.of(1, 2, 3).find(value => value === 2);
  const notFound = list.of(1, 2, 3).find(value => value === 5);

  expect(found.or(0)).toStrictEqual(2);
  expect(notFound.or(0)).toStrictEqual(0);
});

test("position", () => {
  const found = list.of(1, 2, 3).position(value => value === 2);
  const notFound = list.of(1, 2, 3).position(value => value === 5);

  expect(found.or(0)).toStrictEqual(1);
  expect(notFound.or(-1)).toStrictEqual(-1);
});

test("updateAt", () => {
  const resultWithUpdate = list.of(1, 2, 3).updateAt(1, value => value * 2).toArray();
  const resultWithoutUpdate = list.of(1, 2, 3).updateAt(5, value => value * 2).toArray();

  expect(resultWithUpdate).toStrictEqual([1, 4, 3]);
  expect(resultWithoutUpdate).toStrictEqual([1, 2, 3]);
});

test("append", () => {
  const result = list.of(1, 2, 3).append(4, 5, 6).toArray();

  expect(result).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test("removeAt", () => {
  const result = list.of(1, 2, 3).removeAt(2).toArray();

  expect(result).toStrictEqual([1, 2]);
});

test("enumerate", () => {
  const result = list.of(1, 2, 3).enumerate().toArray();

  list.of(1, 2, 3).enumerate().updateAll(([index, value]) => index * value);

  expect(result).toStrictEqual([[0, 1], [1, 2], [2, 3]]);
});

test("each", () => {
  const effect = vi.fn();

  list.of(1, 2, 3).each(effect);

  expect(effect).toHaveBeenCalledTimes(3);
});

test("sort", () => {
  const original = list.of(3, 1, 2);
  const sorted = original.sort();

  expect(original.toArray()).toStrictEqual([3, 1, 2]);
  expect(sorted.toArray()).toStrictEqual([1, 2, 3]);
});
