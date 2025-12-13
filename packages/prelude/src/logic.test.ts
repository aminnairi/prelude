import { describe, test, expect } from "vitest";
import * as logic from "./logic";
import * as chain from "./chain";

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

    const isRobustPassword = chain
      .of(isEightCharacters)
      .and(logic.and(hasNumber))
      .and(logic.and(hasLowercase))
      .and(logic.and(hasUppercase))
      .and(logic.and(hasSymbols))
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

    const isLandVehicle = chain
      .of(isMotorcycle)
      .and(logic.or(isCar))
      .and(logic.or(isBicycle))
      .value();


    expect(isLandVehicle("car")).toBe(true);
    expect(isLandVehicle("boat")).toBe(false);
  });

  test("pipe", () => {
    const characters = (input: string) => input.split("");
    const numbers = (chars: string[]) => chars.map(character => parseInt(character));
    const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

    const charactersToNumbers = chain
      .of(characters)
      .and(logic.pipe(numbers))
      .and(logic.pipe(sum))
      .value();

    expect(charactersToNumbers("12345")).toBe(15);
  });
});
