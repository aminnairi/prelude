import { describe, test, expect } from "vitest";
import * as text from "./text";
import * as stream from "./stream";

describe("text", () => {
  test("value", () => {
    const result = stream
      .of(text.of("Hello"))
      .value()
      .value();

    expect(result).toStrictEqual("Hello");
  });

  test("count", () => {
    const result = stream
      .of(text.of("Hello"))
      .next(text.count())
      .value();

    expect(result).toBe(5);
  });

  test("concatenate", () => {
    const result = stream
      .of(text.of("Hello, "))
      .next(text.concatenate(text.of("world!")))
      .value()
      .value();

    expect(result).toStrictEqual("Hello, world!");
  });

  test("updateAll", () => {
    const result = stream
      .of(text.of("hello"))
      .next(text.updateAll(character => text.of(character.value().toUpperCase())))
      .value()
      .value();

    expect(result).toStrictEqual("HELLO");
  });

  test("updateAt", () => {
    const result = stream
      .of(text.of("hello"))
      .next(text.updateAt(1, character => text.of(character.value().toUpperCase())))
      .value()
      .value();

    expect(result).toStrictEqual("hEllo");
  });
});
