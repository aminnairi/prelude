import * as maybe from "./maybe";

export enum Comparison {
  Greater,
  Lower,
  Equal,
}

export interface Numeric {
  value: () => number;
}

export const of = (value: number): Numeric => {
  return {
    value: () => value,
  };
};

export const between = (lowerbound: Numeric, upperbound: Numeric) => {
  return (numeric: Numeric) => {
    const value = numeric.value();

    if (value < lowerbound.value()) {
      return false;
    }

    if (value > upperbound.value()) {
      return false;
    }

    return true;
  };
};

export const equalTo = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() === other.value();
  };
};

export const differentThan = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() !== other.value();
  };
};

export const greaterThan = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() > other.value();
  };
};

export const lowerThan = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() < other.value();
  };
};

export const greaterOrEqualTo = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() >= other.value();
  };
};

export const lowerOrEqualTo = (other: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() <= other.value();
  };
};

export const divisibleBy = (divider: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() % divider.value() === 0;
  };
};

export const add = (second: Numeric) => {
  return (first: Numeric) => {
    return of(first.value() + second.value());
  };
};

export const subtract = (second: Numeric) => {
  return (first: Numeric) => {
    return of(first.value() - second.value());
  };
};

export const multiply = (second: Numeric) => {
  return (first: Numeric) => {
    return of(first.value() * second.value());
  };
};

export const divide = (second: Numeric) => {
  return (first: Numeric) => {
    const secondValue = second.value();

    if (secondValue === 0) {
      return maybe.none<Numeric>();
    }

    return maybe.some(of(first.value() / second.value()));
  };
};

export const toPower = (power: Numeric) => {
  return (numeric: Numeric) => {
    return numeric.value() ** power.value();
  };
};

export const maximum = (...numerics: Numeric[]) => {
  return (numeric: Numeric) => {
    return of(Math.max(numeric.value(), ...numerics.map(numeric => numeric.value())));
  };
};

export const minimum = (...numerics: Numeric[]) => {
  return (numeric: Numeric) => {
    return of(Math.min(numeric.value(), ...numerics.map(numeric => numeric.value())));
  };
};

export const compare = (second: Numeric) => {
  return (first: Numeric) => {
    const firstValue = first.value();
    const secondValue = second.value();

    if (firstValue > secondValue) {
      return Comparison.Greater;
    }

    if (firstValue < secondValue) {
      return Comparison.Lower;
    }

    return Comparison.Equal;
  };
};
