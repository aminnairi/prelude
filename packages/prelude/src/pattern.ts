export const test = (pattern: RegExp) => {
  return (input: string) => {
    return pattern.test(input);
  };
};
