import { describe, test, expect } from "vitest";
import * as numeric from "./numeric";
import * as chain from "./chain";
import * as maybe from "./maybe";

describe("numeric", () => {
  test("equalTo", () => {
    const result = chain
      .of(numeric.of(123))
      .and(numeric.equalTo(numeric.of(123)))
      .value();

    expect(result).toBe(true);
  });

  test("differentThan", () => {
    const result = chain
      .of(numeric.of(123))
      .and(numeric.differentThan(numeric.of(456)))
      .value();

    expect(result).toBe(true);
  });

  test("between", () => {
    const result = chain
      .of(numeric.of(123))
      .and(numeric.between(numeric.of(100), numeric.of(200)))
      .value();

    const lower = chain
      .of(numeric.of(50))
      .and(numeric.between(numeric.of(100), numeric.of(200)))
      .value();

    const greater = chain
      .of(numeric.of(250))
      .and(numeric.between(numeric.of(100), numeric.of(200)))
      .value();

    expect(result).toBe(true);
    expect(lower).toBe(false);
    expect(greater).toBe(false);
  });

  test("greaterThan", () => {
    const greater = chain
      .of(numeric.of(123))
      .and(numeric.greaterThan(numeric.of(100)))
      .value();

    const notGreater = chain
      .of(numeric.of(123))
      .and(numeric.greaterThan(numeric.of(200)))
      .value();

    expect(greater).toBe(true);
    expect(notGreater).toBe(false);
  });

  test("lowerThan", () => {
    const lowerThan = chain
      .of(numeric.of(123))
      .and(numeric.lowerThan(numeric.of(200)))
      .value();

    const notLowerThan = chain
      .of(numeric.of(123))
      .and(numeric.lowerThan(numeric.of(50)))
      .value();

    expect(lowerThan).toBe(true);
    expect(notLowerThan).toBe(false);
  });

  test("greaterOrEqualTo", () => {
    const greater = chain
      .of(numeric.of(123))
      .and(numeric.greaterOrEqualTo(numeric.of(50)))
      .value();

    const equal = chain
      .of(numeric.of(123))
      .and(numeric.greaterOrEqualTo(numeric.of(123)))
      .value();

    const lower = chain
      .of(numeric.of(123))
      .and(numeric.greaterOrEqualTo(numeric.of(200)))
      .value();

    expect(greater).toBe(true);
    expect(equal).toBe(true);
    expect(lower).toBe(false);
  });

  test("greaterOrEqualTo", () => {
    const greater = chain
      .of(numeric.of(123))
      .and(numeric.lowerOrEqualTo(numeric.of(50)))
      .value();

    const equal = chain
      .of(numeric.of(123))
      .and(numeric.lowerOrEqualTo(numeric.of(123)))
      .value();

    const lower = chain
      .of(numeric.of(123))
      .and(numeric.lowerOrEqualTo(numeric.of(200)))
      .value();

    expect(greater).toBe(false);
    expect(equal).toBe(true);
    expect(lower).toBe(true);
  });

  test("divisible", () => {
    const value = chain
      .of(numeric.of(100))
      .and(numeric.divisibleBy(numeric.of(2)))
      .value();

    expect(value).toBe(true);
  });

  test("add", () => {
    const value = chain
      .of(numeric.of(123))
      .and(numeric.add(numeric.of(123)))
      .value()
      .value();

    expect(value).toStrictEqual(246);
  });

  test("subtract", () => {
    const value = chain
      .of(numeric.of(123))
      .and(numeric.subtract(numeric.of(123)))
      .value()
      .value();

    expect(value).toStrictEqual(0);
  });

  test("subtract", () => {

    const value = chain
      .of(numeric.of(123))
      .and(numeric.multiply(numeric.of(2)))
      .value()
      .value();

    expect(value).toStrictEqual(246);
  });

  test("divide", () => {
    const value = chain
      .of(numeric.of(200))
      .and(numeric.divide(numeric.of(2)))
      .and(maybe.or(numeric.of(0)))
      .value()
      .value();

    const nothing = chain
      .of(numeric.of(200))
      .and(numeric.divide(numeric.of(0)))
      .value()
      .or(numeric.of(0))
      .value();

    expect(value).toStrictEqual(100);
    expect(nothing).toStrictEqual(0);
  });

  test("toPower", () => {
    const value = chain
      .of(numeric.of(2))
      .and(numeric.toPower(numeric.of(8)))
      .value();

    expect(value).toStrictEqual(256);
  });

  test("max", () => {
    const value = chain
      .of(numeric.of(10))
      .and(numeric.maximum(numeric.of(5), numeric.of(6)))
      .value()
      .value();

    expect(value).toStrictEqual(10);
  });

  test("min", () => {
    const value = chain
      .of(numeric.of(10))
      .and(numeric.minimum(numeric.of(5), numeric.of(6)))
      .value()
      .value();

    expect(value).toStrictEqual(5);
  });

  test("compare", () => {
    const greater = chain
      .of(numeric.of(10))
      .and(numeric.compare(numeric.of(5)))
      .value();

    const lower = chain
      .of(numeric.of(10))
      .and(numeric.compare(numeric.of(20)))
      .value();

    const equal = chain
      .of(numeric.of(10))
      .and(numeric.compare(numeric.of(10)))
      .value();

    expect(greater).toStrictEqual(numeric.Comparison.Greater);
    expect(lower).toStrictEqual(numeric.Comparison.Lower);
    expect(equal).toStrictEqual(numeric.Comparison.Equal);
  });
});
