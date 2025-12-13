import { test, expect } from "vitest";
import * as chain from "./chain";

test("and", () => {
  const result = chain.of(1).and(value => value * 2).value();

  expect(result).toBe(2);
});

test("and with non-chain object (value property not a function)", () => {
  const nonChainObject = { value: "not a function" };
  const result = chain.of(1).and(() => nonChainObject).value();

  expect(result).toBe(nonChainObject);
});

test("and with non-chain object (no value property)", () => {
  const anotherNonChainObject = { foo: "bar" };
  const result = chain.of(1).and(() => anotherNonChainObject).value();

  expect(result).toBe(anotherNonChainObject);
});

test("and with nested chain", () => {
  const result = chain.of(10)
    .and(value => chain.of(value + 1))
    .and(value => value * 2)
    .value();

  expect(result).toBe(22); // (10 + 1) * 2
});

