export const not = <Parameters extends Array<unknown>>(callback: (...parameters: Parameters) => boolean) => {
  return (...args: Parameters) => {
    return !callback(...args);
  };
};

export const and = <Parameters extends Array<unknown>>(secondCallback: (...parameters: Parameters) => boolean) => {
  return (firstCallback: (...parameters: Parameters) => boolean) => {
    return (...parameters: Parameters) => {
      return firstCallback(...parameters) && secondCallback(...parameters);
    };
  };
};

export const or = <Parameters extends Array<unknown>>(secondCallback: (...parameters: Parameters) => boolean) => {
  return (firstCallback: (...parameters: Parameters) => boolean) => {
    return (...parameters: Parameters) => {
      return firstCallback(...parameters) || secondCallback(...parameters);
    };
  };
};

export const pipe = <Input, Output, Value>(second: (input: Output) => Value) => {
  return (first: (input: Input) => Output) => {
    return (input: Input) => {
      return second(first(input));
    };
  };
};
