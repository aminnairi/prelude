import { describe, test, expect } from "vitest";
import * as numeric from "./numeric";
import * as chain from "./chain";
import * as maybe from "./maybe";

describe("numeric", () => {
  test("equalTo", () => {
    const result = chain
      .of(123)
      .and(numeric.equalTo(123))
      .link();

    expect(result).toBe(true);
  });

  test("differentThan", () => {
    const result = chain
      .of(123)
      .and(numeric.differentThan(456))
      .link();

    expect(result).toBe(true);
  });

  test("between", () => {
    const result = chain
      .of(123)
      .and(numeric.between(100, 200))
      .link();

    const lower = chain
      .of(50)
      .and(numeric.between(100, 200))
      .link();

    const greater = chain
      .of(250)
      .and(numeric.between(100, 200))
      .link();

    expect(result).toBe(true);
    expect(lower).toBe(false);
    expect(greater).toBe(false);
  });

  test("greaterThan", () => {
    const greater = chain
      .of(123)
      .and(numeric.greaterThan(100))
      .link();

    const notGreater = chain
      .of(123)
      .and(numeric.greaterThan(200))
      .link();

    expect(greater).toBe(true);
    expect(notGreater).toBe(false);
  });

  test("lowerThan", () => {
    const lowerThan = chain
      .of(123)
      .and(numeric.lowerThan(200))
      .link();

    const notLowerThan = chain
      .of(123)
      .and(numeric.lowerThan(50))
      .link();

    expect(lowerThan).toBe(true);
    expect(notLowerThan).toBe(false);
  });

  test("greaterOrEqualTo", () => {
    const greater = chain
      .of(123)
      .and(numeric.greaterOrEqualTo(50))
      .link();

    const equal = chain
      .of(123)
      .and(numeric.greaterOrEqualTo(123))
      .link();

    const lower = chain
      .of(123)
      .and(numeric.greaterOrEqualTo(200))
      .link();

    expect(greater).toBe(true);
    expect(equal).toBe(true);
    expect(lower).toBe(false);
  });

  test("lowerOrEqualTo", () => {
    const greater = chain
      .of(123)
      .and(numeric.lowerOrEqualTo(50))
      .link();

    const equal = chain
      .of(123)
      .and(numeric.lowerOrEqualTo(123))
      .link();

    const lower = chain
      .of(123)
      .and(numeric.lowerOrEqualTo(200))
      .link();

    expect(greater).toBe(false);
    expect(equal).toBe(true);
    expect(lower).toBe(true);
  });

  test("divisible", () => {
    const value = chain
      .of(100)
      .and(numeric.divisibleBy(2))
      .link();

    expect(value).toBe(true);
  });

  test("add", () => {
    const value = chain
      .of(123)
      .and(numeric.add(123))
      .link();

    expect(value).toStrictEqual(246);
  });

  test("add variadic", () => {
    const value = chain
      .of(10)
      .and(numeric.add(1, 2, 3))
      .link();

    expect(value).toStrictEqual(16);
  });

  test("subtract", () => {
    const value = chain
      .of(123)
      .and(numeric.subtract(123))
      .link();

    expect(value).toStrictEqual(0);
  });

  test("multiply", () => {
    const value = chain
      .of(123)
      .and(numeric.multiply(2))
      .link();

    expect(value).toStrictEqual(246);
  });

  test("divide", () => {
    const value = chain
      .of(200)
      .and(numeric.divide(2))
      .link()
      .or(0);

    const nothing = chain
      .of(200)
      .and(numeric.divide(0))
      .link()
      .or(0);

    expect(value).toStrictEqual(100);
    expect(nothing).toStrictEqual(0);
  });

  test("toPower", () => {
    const value = chain
      .of(2)
      .and(numeric.toPower(8))
      .link();

    expect(value).toStrictEqual(256);
  });

  test("max", () => {
    const value = chain
      .of(10)
      .and(numeric.maximum(5, 6))
      .link();

    expect(value).toStrictEqual(10);
  });

  test("min", () => {
    const value = chain
      .of(10)
      .and(numeric.minimum(5, 6))
      .link();

    expect(value).toStrictEqual(5);
  });

  test("compare", () => {
    const greater = chain
      .of(10)
      .and(numeric.compare(5))
      .link();

    const lower = chain
      .of(10)
      .and(numeric.compare(20))
      .link();

    const equal = chain
      .of(10)
      .and(numeric.compare(10))
      .link();

    expect(greater).toStrictEqual(numeric.Comparison.Greater);
    expect(lower).toStrictEqual(numeric.Comparison.Lower);
    expect(equal).toStrictEqual(numeric.Comparison.Equal);
  });
});
