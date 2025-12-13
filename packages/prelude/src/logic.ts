export const not = <Parameters extends Array<unknown>>(callback: (...parameters: Parameters) => boolean) => {
  return (...args: Parameters) => {
    return !callback(...args);
  }
}
