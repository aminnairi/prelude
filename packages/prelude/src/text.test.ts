import { describe, test, expect } from "vitest";
import * as text from "./text";
import * as chain from "./chain";

describe("text", () => {
  test("value", () => {
    const result = chain
      .of(text.of("Hello"))
      .value()
      .value();

    expect(result).toStrictEqual("Hello");
  });

  test("count", () => {
    const result = chain
      .of(text.of("Hello"))
      .and(text.count())
      .value();

    expect(result).toBe(5);
  });

  test("concatenate", () => {
    const result = chain
      .of(text.of("Hello, "))
      .and(text.concatenate(text.of("world!")))
      .value()
      .value();

    expect(result).toStrictEqual("Hello, world!");
  });

  test("updateAll", () => {
    const result = chain
      .of(text.of("hello"))
      .and(text.updateAll(character => text.of(character.value().toUpperCase())))
      .value()
      .value();

    expect(result).toStrictEqual("HELLO");
  });

  test("updateAt", () => {
    const result = chain
      .of(text.of("hello"))
      .and(text.updateAt(1, character => text.of(character.value().toUpperCase())))
      .value()
      .value();

    expect(result).toStrictEqual("hEllo");
  });
});
