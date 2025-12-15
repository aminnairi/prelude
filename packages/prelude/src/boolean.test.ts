import { describe, test, expect } from "vitest";
import * as chain from "./chain";
import * as boolean from "./boolean";

describe("boolean", () => {
  test("not", () => {
    const isAdministrator = (name: string) => name === "amin";
    const isNotAdministrator = boolean.not(isAdministrator);

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
      .and(boolean.and(hasNumber))
      .and(boolean.and(hasLowercase))
      .and(boolean.and(hasUppercase))
      .and(boolean.and(hasSymbols))
      .link();

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
      .and(boolean.or(isCar))
      .and(boolean.or(isBicycle))
      .link();


    expect(isLandVehicle("car")).toBe(true);
    expect(isLandVehicle("boat")).toBe(false);
  });

});
