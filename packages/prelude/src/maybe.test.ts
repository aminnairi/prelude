import { describe, test, expect } from "vitest";
import { none, some } from "./maybe";
import * as chain from "./chain";
import * as maybe from "./maybe"; // Import maybe to access the exported or function

describe("or", () => {
  test("some", () => {
    const maybe = some(123);
    const value = maybe.or(0);

    expect(value).toStrictEqual(123);
  });

  test("none", () => {
    const maybe = none<number>();
    const value = maybe.or(0);

    expect(value).toStrictEqual(0);
  });

  test("exported or with some", () => {
    const valueWithSome = chain.of(maybe.some(10))
      .and(maybe.or(5))
      .value();

    expect(valueWithSome).toStrictEqual(10);
  });

  test("exported or with none", () => {
    const valueWithNone = chain.of(maybe.none<number>())
      .and(maybe.or(5))
      .value();

    expect(valueWithNone).toStrictEqual(5);
  });
});


describe("and", () => {
  test("some", () => {
    const maybe = some(123).and(value => value * 2);
    const value = maybe.or(0);

    expect(value).toStrictEqual(246);
  });

  test("none", () => {
    const maybe = none<number>().and(value => value * 2);
    const value = maybe.or(0);

    expect(value).toStrictEqual(0);
  });
});
