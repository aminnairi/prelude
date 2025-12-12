import { describe, test, expect } from "vitest";
import { none, some } from "./maybe";

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
