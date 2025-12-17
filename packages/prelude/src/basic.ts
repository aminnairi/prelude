export const pipe = <Input, Output, Value>(second: (input: Output) => Value) => {
  return (first: (input: Input) => Output) => {
    return (input: Input) => {
      return second(first(input));
    };
  };
};

export function peek<Value>(callback: (value: Value) => void): (value: Value) => void;
export function peek<Value>(callback: (value: Value) => void, value: Value): void;
export function peek<Value>(callback: (value: Value) => void, value?: Value) {
  const execute = (callback: (value: Value) => void, value: Value) => {
    callback(value);
    return value;
  };

  if (typeof value === "undefined") {
    return (value: Value) => {
      execute(callback, value);
    };
  }

  execute(callback, value);
};
