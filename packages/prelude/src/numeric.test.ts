import { describe, test, expect } from "vitest";
import * as numeric from "./numeric";
import * as chain from "./chain";
import * as maybe from "./maybe";

describe("numeric", () => {
  test("equalTo", () => {
    const result = chain
      .of(123)
      .and(numeric.equalTo(123))
      .value();

    expect(result).toBe(true);
  });

  test("differentThan", () => {
    const result = chain
      .of(123)
      .and(numeric.differentThan(456))
      .value();

    expect(result).toBe(true);
  });

  test("between", () => {
    const result = chain
      .of(123)
      .and(numeric.between(100, 200))
      .value();

    const lower = chain
      .of(50)
      .and(numeric.between(100, 200))
      .value();

    const greater = chain
      .of(250)
      .and(numeric.between(100, 200))
      .value();

    expect(result).toBe(true);
    expect(lower).toBe(false);
    expect(greater).toBe(false);
  });

  test("greaterThan", () => {
    const greater = chain
      .of(123)
      .and(numeric.greaterThan(100))
      .value();

    const notGreater = chain
      .of(123)
      .and(numeric.greaterThan(200))
      .value();

    expect(greater).toBe(true);
    expect(notGreater).toBe(false);
  });

  test("lowerThan", () => {
    const lowerThan = chain
      .of(123)
      .and(numeric.lowerThan(200))
      .value();

    const notLowerThan = chain
      .of(123)
      .and(numeric.lowerThan(50))
      .value();

    expect(lowerThan).toBe(true);
    expect(notLowerThan).toBe(false);
  });

  test("greaterOrEqualTo", () => {
    const greater = chain
      .of(123)
      .and(numeric.greaterOrEqualTo(50))
      .value();

    const equal = chain
      .of(123)
      .and(numeric.greaterOrEqualTo(123))
      .value();

    const lower = chain
      .of(123)
      .and(numeric.greaterOrEqualTo(200))
      .value();

    expect(greater).toBe(true);
    expect(equal).toBe(true);
    expect(lower).toBe(false);
  });

  test("lowerOrEqualTo", () => {
    const greater = chain
      .of(123)
      .and(numeric.lowerOrEqualTo(50))
      .value();

    const equal = chain
      .of(123)
      .and(numeric.lowerOrEqualTo(123))
      .value();

    const lower = chain
      .of(123)
      .and(numeric.lowerOrEqualTo(200))
      .value();

    expect(greater).toBe(false);
    expect(equal).toBe(true);
    expect(lower).toBe(true);
  });

  test("divisible", () => {
    const value = chain
      .of(100)
      .and(numeric.divisibleBy(2))
      .value();

    expect(value).toBe(true);
  });

  test("add", () => {
    const value = chain
      .of(123)
      .and(numeric.add(123))
      .value();

    expect(value).toStrictEqual(246);
  });

  test("subtract", () => {
    const value = chain
      .of(123)
      .and(numeric.subtract(123))
      .value();

    expect(value).toStrictEqual(0);
  });

  test("multiply", () => {
    const value = chain
      .of(123)
      .and(numeric.multiply(2))
      .value();

    expect(value).toStrictEqual(246);
  });

  test("divide", () => {
    const value = chain
      .of(200)
      .and(numeric.divide(2))
      .value()
      .or(0);

    const nothing = chain
      .of(200)
      .and(numeric.divide(0))
      .value()
      .or(0);

    expect(value).toStrictEqual(100);
    expect(nothing).toStrictEqual(0);
  });

  test("toPower", () => {
    const value = chain
      .of(2)
      .and(numeric.toPower(8))
      .value();

    expect(value).toStrictEqual(256);
  });

  test("max", () => {
    const value = chain
      .of(10)
      .and(numeric.maximum(5, 6))
      .value();

    expect(value).toStrictEqual(10);
  });

  test("min", () => {
    const value = chain
      .of(10)
      .and(numeric.minimum(5, 6))
      .value();

    expect(value).toStrictEqual(5);
  });

  test("compare", () => {
    const greater = chain
      .of(10)
      .and(numeric.compare(5))
      .value();

    const lower = chain
      .of(10)
      .and(numeric.compare(20))
      .value();

    const equal = chain
      .of(10)
      .and(numeric.compare(10))
      .value();

    expect(greater).toStrictEqual(numeric.Comparison.Greater);
    expect(lower).toStrictEqual(numeric.Comparison.Lower);
    expect(equal).toStrictEqual(numeric.Comparison.Equal);
  });
});
