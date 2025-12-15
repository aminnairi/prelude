export const pipe = <Input, Output, Value>(second: (input: Output) => Value) => {
  return (first: (input: Input) => Output) => {
    return (input: Input) => {
      return second(first(input));
    };
  };
};
