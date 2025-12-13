import { describe, test, expect } from "vitest";
import * as text from "./text";
import * as chain from "./chain";

describe("text", () => {
  test("from", () => {
    const num = 123;
    const bool = true;
    const obj = { a: 1 };

    expect(chain.of(num).and(text.from).value()).toStrictEqual("123");
    expect(chain.of(bool).and(text.from).value()).toStrictEqual("true");
    expect(chain.of(obj).and(text.from).value()).toStrictEqual("[object Object]");
  });

  test("prefix", () => {
    const result = chain
      .of("world")
      .and(text.prefix("Hello, "))
      .value();

    expect(result).toStrictEqual("Hello, world");
  });

  test("suffix", () => {
    const result = chain
      .of("Hello")
      .and(text.suffix(" World!"))
      .value();

    expect(result).toStrictEqual("Hello World!");
  });

  test("count", () => {
    const result = chain
      .of("Hello")
      .and(text.count())
      .value();

    expect(result).toBe(5);
  });

  test("concatenate", () => {
    const result = chain
      .of("Hello, ")
      .and(text.concatenate("world!"))
      .value();

    expect(result).toStrictEqual("Hello, world!");
  });

  test("updateAll", () => {
    const result = chain
      .of("hello")
      .and(text.updateAll(character => character.toUpperCase()))
      .value();

    expect(result).toStrictEqual("HELLO");
  });

  test("updateAt", () => {
    const result = chain
      .of("hello")
      .and(text.updateAt(1, character => character.toUpperCase()))
      .value();

    expect(result).toStrictEqual("hEllo");
  });

  test("lines", () => {
    const multilineText = "Line 1\nLine 2\nLine 3";
    const result = chain.of(multilineText)
      .and(text.lines())
      .value();

    expect(result).toStrictEqual(["Line 1", "Line 2", "Line 3"]);
  });

  test("split", () => {
    const commaSeparated = "apple,banana,orange";
    const result = chain.of(commaSeparated)
      .and(text.split(","))
      .value();

    expect(result).toStrictEqual(["apple", "banana", "orange"]);
  });

  test("toInteger with valid integer", () => {
    const intString = "123";
    const result = chain.of(intString)
      .and(text.toInteger())
      .value();

    expect(result.or(0)).toStrictEqual(123);
  });

  test("toInteger with invalid integer", () => {
    const nonIntString = "abc";
    const result = chain.of(nonIntString)
      .and(text.toInteger())
      .value();

    expect(result.or(0)).toStrictEqual(0);
  });
});
