import { result } from "@aminnairi/prelude";

class VibrateNotSupportedError extends Error {
  public override readonly name = "VibrateNotSupported";
}

export const vibrate = (pattern: VibratePattern): result.Result<null, VibrateNotSupportedError> => {
  if (typeof window.navigator.vibrate === "undefined") {
    return result.error(new VibrateNotSupportedError);
  }

  window.navigator.vibrate(pattern);

  return result.ok(null);
};
