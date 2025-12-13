import { describe, test, expect } from "vitest";
import * as numeric from "./numeric";
import * as stream from "./stream";
import * as maybe from "./maybe";

describe("numeric", () => {
  test("equalTo", () => {
    const result = stream
      .of(numeric.of(123))
      .next(numeric.equalTo(numeric.of(123)))
      .value();

    expect(result).toBe(true);
  });

  test("differentThan", () => {
    const result = stream
      .of(numeric.of(123))
      .next(numeric.differentThan(numeric.of(456)))
      .value();

    expect(result).toBe(true);
  });

  test("between", () => {
    const result = stream
      .of(numeric.of(123))
      .next(numeric.between(numeric.of(100), numeric.of(200)))
      .value();

    const lower = stream
      .of(numeric.of(50))
      .next(numeric.between(numeric.of(100), numeric.of(200)))
      .value();

    const greater = stream
      .of(numeric.of(250))
      .next(numeric.between(numeric.of(100), numeric.of(200)))
      .value();

    expect(result).toBe(true);
    expect(lower).toBe(false);
    expect(greater).toBe(false);
  });

  test("greaterThan", () => {
    const greater = stream
      .of(numeric.of(123))
      .next(numeric.greaterThan(numeric.of(100)))
      .value();

    const notGreater = stream
      .of(numeric.of(123))
      .next(numeric.greaterThan(numeric.of(200)))
      .value();

    expect(greater).toBe(true);
    expect(notGreater).toBe(false);
  });

  test("lowerThan", () => {
    const lowerThan = stream
      .of(numeric.of(123))
      .next(numeric.lowerThan(numeric.of(200)))
      .value();

    const notLowerThan = stream
      .of(numeric.of(123))
      .next(numeric.lowerThan(numeric.of(50)))
      .value();

    expect(lowerThan).toBe(true);
    expect(notLowerThan).toBe(false);
  });

  test("greaterOrEqualTo", () => {
    const greater = stream
      .of(numeric.of(123))
      .next(numeric.greaterOrEqualTo(numeric.of(50)))
      .value();

    const equal = stream
      .of(numeric.of(123))
      .next(numeric.greaterOrEqualTo(numeric.of(123)))
      .value();

    const lower = stream
      .of(numeric.of(123))
      .next(numeric.greaterOrEqualTo(numeric.of(200)))
      .value();

    expect(greater).toBe(true);
    expect(equal).toBe(true);
    expect(lower).toBe(false);
  });

  test("greaterOrEqualTo", () => {
    const greater = stream
      .of(numeric.of(123))
      .next(numeric.lowerOrEqualTo(numeric.of(50)))
      .value();

    const equal = stream
      .of(numeric.of(123))
      .next(numeric.lowerOrEqualTo(numeric.of(123)))
      .value();

    const lower = stream
      .of(numeric.of(123))
      .next(numeric.lowerOrEqualTo(numeric.of(200)))
      .value();

    expect(greater).toBe(false);
    expect(equal).toBe(true);
    expect(lower).toBe(true);
  });

  test("divisible", () => {
    const value = stream
      .of(numeric.of(100))
      .next(numeric.divisibleBy(numeric.of(2)))
      .value();

    expect(value).toBe(true);
  });

  test("add", () => {
    const value = stream
      .of(numeric.of(123))
      .next(numeric.add(numeric.of(123)))
      .value()
      .value();

    expect(value).toStrictEqual(246);
  });

  test("subtract", () => {
    const value = stream
      .of(numeric.of(123))
      .next(numeric.subtract(numeric.of(123)))
      .value()
      .value();

    expect(value).toStrictEqual(0);
  });

  test("subtract", () => {

    const value = stream
      .of(numeric.of(123))
      .next(numeric.multiply(numeric.of(2)))
      .value()
      .value();

    expect(value).toStrictEqual(246);
  });

  test("divide", () => {
    const value = stream
      .of(numeric.of(200))
      .next(numeric.divide(numeric.of(2)))
      .next(maybe.or(numeric.of(0)))
      .value()
      .value();

    const nothing = stream
      .of(numeric.of(200))
      .next(numeric.divide(numeric.of(0)))
      .value()
      .or(numeric.of(0))
      .value();

    expect(value).toStrictEqual(100);
    expect(nothing).toStrictEqual(0);
  });

  test("toPower", () => {
    const value = stream
      .of(numeric.of(2))
      .next(numeric.toPower(numeric.of(8)))
      .value();

    expect(value).toStrictEqual(256);
  });

  test("max", () => {
    const value = stream
      .of(numeric.of(10))
      .next(numeric.maximum(numeric.of(5), numeric.of(6)))
      .value()
      .value();

    expect(value).toStrictEqual(10);
  });

  test("min", () => {
    const value = stream
      .of(numeric.of(10))
      .next(numeric.minimum(numeric.of(5), numeric.of(6)))
      .value()
      .value();

    expect(value).toStrictEqual(5);
  });

  test("compare", () => {
    const greater = stream
      .of(numeric.of(10))
      .next(numeric.compare(numeric.of(5)))
      .value();

    const lower = stream
      .of(numeric.of(10))
      .next(numeric.compare(numeric.of(20)))
      .value();

    const equal = stream
      .of(numeric.of(10))
      .next(numeric.compare(numeric.of(10)))
      .value();

    expect(greater).toStrictEqual(numeric.Comparison.Greater);
    expect(lower).toStrictEqual(numeric.Comparison.Lower);
    expect(equal).toStrictEqual(numeric.Comparison.Equal);
  });
});
