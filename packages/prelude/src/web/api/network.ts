import * as result from "../../result";

export interface Network extends EventTarget {
  downlink: number
  effectiveType: string
}

export class NetworkNotSupported extends Error {
  public override readonly name = "NetworkNotSupported";
}

export function isNetwork(value: unknown): value is Network {
  return typeof value === "object"
    && value !== null
    && "downlink" in value
    && typeof value.downlink === "number"
    && "effectiveType" in value
    && typeof value.effectiveType === "string"
    && value instanceof EventTarget
}

export enum EffectiveType {
  VerySlow = "slow-2g",
  Slow = "2g",
  Fast = "3g",
  VeryFast = "4g"
}

export const request = (): result.Result<Network, NetworkNotSupported> => {
  if (!("connection" in window.navigator)) {
    return result.error(new NetworkNotSupported);
  }

  if (!isNetwork(window.navigator.connection)) {
    return result.error(new NetworkNotSupported);
  }

  return result.ok(window.navigator.connection);
}
