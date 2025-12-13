export interface Chain<Value> {
  next: <NewValue>(update: (value: Value) => NewValue) => Chain<NewValue>
  value: () => Value;
}

export const of = <Value>(value: Value): Chain<Value> => {
  return {
    next: (update) => {
      return of(update(value));
    },
    value: () => {
      return value;
    }
  }
}
