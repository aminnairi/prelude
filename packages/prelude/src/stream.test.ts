import { test, expect } from "vitest";
import * as stream from "./stream";
import * as list from "./list";

test("and", () => {
  const result = stream.of(1).and(value => value * 2).value();

  expect(result).toBe(2);
});
