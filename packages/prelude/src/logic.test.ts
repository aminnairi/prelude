import { describe, test, expect } from "vitest";
import * as logic from "./logic";
import * as stream from "./stream";

describe("basics", () => {
  test("not", () => {
    const isAdministrator = (name: string) => name === "amin";
    const isNotAdministrator = logic.not(isAdministrator);

    expect(isNotAdministrator("amin")).toBe(false);
  });

  test("and", () => {
    const isEightCharacters = (password: string) => password.length >= 8;
    const hasNumber = (password: string) => /\d+/.test(password);
    const hasLowercase = (password: string) => /[a-z]/.test(password);
    const hasUppercase = (password: string) => /[A-Z]/.test(password);
    const hasSymbols = (password: string) => /[^a-zA-Z0-9]/.test(password);

    const isRobustPassword = stream
      .of(isEightCharacters)
      .next(logic.and(hasNumber))
      .next(logic.and(hasLowercase))
      .next(logic.and(hasUppercase))
      .next(logic.and(hasSymbols))
      .value();

    expect(isRobustPassword("Password123!@#")).toBe(true);
    expect(isRobustPassword("password123!@#")).toBe(false);
    expect(isRobustPassword("Password!@#")).toBe(false);
    expect(isRobustPassword("Password123")).toBe(false);
  });

  test("or", () => {
    const isMotorcycle = (vehicle: string) => vehicle === "motorcycle";
    const isCar = (vehicle: string) => vehicle === "car";
    const isBicycle = (vehicle: string) => vehicle === "bicycle";

    const isLandVehicle = stream
      .of(isMotorcycle)
      .next(logic.or(isCar))
      .next(logic.or(isBicycle))
      .value();


    expect(isLandVehicle("car")).toBe(true);
    expect(isLandVehicle("boat")).toBe(false);
  });

  test("pipe", () => {
    const characters = (input: string) => input.split("");
    const numbers = (chars: string[]) => chars.map(character => parseInt(character));
    const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

    const charactersToNumbers = stream
      .of(characters)
      .next(logic.pipe(numbers))
      .next(logic.pipe(sum))
      .value();

    expect(charactersToNumbers("12345")).toBe(15);
  });
});
