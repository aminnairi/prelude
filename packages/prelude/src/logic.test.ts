import { describe, test, expect } from "vitest";
import * as logic from "./logic";

describe("basics", () => {
  test("not", () => {
    const isAdministrator = (name: string) => {
      if (name === "amin") {
        return true;
      }

      return false;
    };

    const isNotAdministrator = logic.not(isAdministrator);

    expect(isNotAdministrator("amin")).toBe(false);
  });
});
