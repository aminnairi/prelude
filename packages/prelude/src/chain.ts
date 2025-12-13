export interface Chain<Value> {
  and: <NewValue>(update: (value: Value) => NewValue | Chain<NewValue>) => Chain<NewValue>;
  value: () => Value;
}

export const of = <Value>(value: Value): Chain<Value> => {
  return {
    and: (update) => {
      const updatedValue = update(value);
      // Check if the updatedValue is a Chain itself
      if (isChain(updatedValue)) {
        return of(updatedValue.value());
      }
      return of(updatedValue);
    },
    value: () => {
      return value;
    },
  };
};

// Helper function to check if an object is a Chain
const isChain = <T>(obj: any): obj is Chain<T> => {
  return obj && typeof obj === 'object' && typeof obj.value === 'function';
};

