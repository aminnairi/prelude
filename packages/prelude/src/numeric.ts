import * as maybe from "./maybe";

export enum Comparison {
  Greater,
  Lower,
  Equal,
}

export const between = (lowerbound: number, upperbound: number) => {
  return (numeric: number) => {
    const value = numeric;

    if (value < lowerbound) {
      return false;
    }

    if (value > upperbound) {
      return false;
    }

    return true;
  };
};

export const equalTo = (other: number) => {
  return (numeric: number) => {
    return numeric === other;
  };
};

export const differentThan = (other: number) => {
  return (numeric: number) => {
    return numeric !== other;
  };
};

export const greaterThan = (other: number) => {
  return (numeric: number) => {
    return numeric > other;
  };
};

export const lowerThan = (other: number) => {
  return (numeric: number) => {
    return numeric < other;
  };
};

export const greaterOrEqualTo = (other: number) => {
  return (numeric: number) => {
    return numeric >= other;
  };
};

export const lowerOrEqualTo = (other: number) => {
  return (numeric: number) => {
    return numeric <= other;
  };
};

export const divisibleBy = (divider: number) => {
  return (numeric: number) => {
    return numeric % divider === 0;
  };
};

export const add = (...seconds: number[]) => {
  return (...firsts: number[]) => {
    return [...firsts, ...seconds].reduce((sum, current) => sum + current, 0);
  };
};

export const subtract = (second: number) => {
  return (first: number) => {
    return first - second;
  };
};

export const multiply = (second: number) => {
  return (first: number) => {
    return first * second;
  };
};

export const divide = (second: number) => {
  return (first: number) => {
    if (second === 0) {
      return maybe.none<number>();
    }

    return maybe.some(first / second);
  };
};

export const toPower = (power: number) => {
  return (numeric: number) => {
    return numeric ** power;
  };
};

export const maximum = (...numerics: number[]) => {
  return (numeric: number) => {
    return Math.max(numeric, ...numerics);
  };
};

export const minimum = (...numerics: number[]) => {
  return (numeric: number) => {
    return Math.min(numeric, ...numerics);
  };
};

export const compare = (second: number) => {
  return (first: number) => {
    const firstValue = first;
    const secondValue = second;

    if (firstValue > secondValue) {
      return Comparison.Greater;
    }

    if (firstValue < secondValue) {
      return Comparison.Lower;
    }

    return Comparison.Equal;
  };
};
