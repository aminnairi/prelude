export interface Maybe<Value> {
  and: <NewValue>(update: (value: Value) => NewValue) => Maybe<NewValue>;
  or: <NewValue>(fallback: NewValue) => Value | NewValue;
}

export function some<Value>(value: Value): Maybe<Value> {
  return {
    and: (update) => {
      return some(update(value));
    },
    or: () => value,
  };
};

export function none<Value>(): Maybe<Value> {
  return {
    and: () => none(),
    or: fallback => fallback,
  };
};

export const or = <Value>(value: Value) => {
  return (maybe: Maybe<Value>) => {
    return maybe.or(value);
  };
};

export const and = <Value, NewValue>(update: (value: Value) => NewValue) => {
  return (maybe: Maybe<Value>) => {
    return maybe.and(update);
  };
};
