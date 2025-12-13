import { test, expect } from "vitest";
import * as chain from "./chain";
import * as list from "./list";

test("and", () => {
  const result = chain.of(1).and(value => value * 2).value();

  expect(result).toBe(2);
});
