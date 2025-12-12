export interface Maybe<Value> {
  and: <NewValue>(update: (value: Value) => NewValue) => Maybe<NewValue>;
  or: (fallback: Value) => Value;
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
