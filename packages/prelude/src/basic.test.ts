import { describe, test, expect } from "vitest";
import * as basic from "./basic";
import * as chain from "./chain";

describe("basics", () => {
  test("pipe", () => {
    const characters = (input: string) => input.split("");
    const numbers = (chars: string[]) => chars.map(character => parseInt(character));
    const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

    const charactersToNumbers = chain
      .of(characters)
      .and(basic.pipe(numbers))
      .and(basic.pipe(sum))
      .link();

    expect(charactersToNumbers("12345")).toBe(15);
  });
});
