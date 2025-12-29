import * as result from "../../result";

export class BatteryAPINotSupported extends Error {
  public override readonly name = "BatteryAPINotSupported";
}

export interface Battery extends EventTarget {
  level: number
  charging: boolean
}

export function isFunction(fn: unknown): fn is Function {
  return typeof fn === "function";
}

export function isBattery(battery: unknown): battery is Battery {
  return typeof battery === "object"
    && battery !== null
    && "level" in battery
    && typeof battery.level === "number"
    && "charging" in battery
    && typeof battery.charging === "boolean"
    && battery instanceof EventTarget
}

export const request = async (): Promise<result.Result<Battery, BatteryAPINotSupported>> => {
  try {
    if (!("getBattery" in window.navigator)) {
      return result.error(new BatteryAPINotSupported);
    }

    if (!isFunction(window.navigator.getBattery)) {
      return result.error(new BatteryAPINotSupported);
    }

    const battery = await window.navigator.getBattery();

    if (!isBattery(battery)) {
      return result.error(new BatteryAPINotSupported);
    }

    return result.ok(battery);
  } catch {
    return result.error(new BatteryAPINotSupported);
  }
}
