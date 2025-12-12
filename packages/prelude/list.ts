import { none, some, type Maybe } from "./maybe";

interface List<Value> {
  keep: (when: (value: Value) => boolean) => List<Value>;
  remove: (when: (value: Value) => boolean) => List<Value>;
  removeAt: (index: number) => List<Value>;
  updateAll: <NewValue>(update: (value: Value) => NewValue) => List<NewValue>;
  updateAt: (index: number, update: (value: Value) => Value) => List<Value>;
  first: () => Maybe<Value>;
  last: () => Maybe<Value>;
  at: (index: number) => Maybe<Value>;
  count: () => number;
  toArray: () => Array<Value>;
  any: (accept: (value: Value) => boolean) => boolean;
  all: (accept: (value: Value) => boolean) => boolean;
  find: (accept: (value: Value) => boolean) => Maybe<Value>;
  position: (is: (value: Value) => boolean) => Maybe<number>
  append: (...values: Value[]) => List<Value>;
  enumerate: () => List<[number, Value]>
  each: (effect: (value: Value) => void) => List<Value>
  sort: () => List<Value>;
  indices: () => List<number>;
  has: (condition: (value: Value) => boolean) => boolean;
  join: (separator: string) => string;
  drop: (count: number) => List<Value>;
  dropLast: (count: number) => List<Value>;
  dropUntil: (condition: (value: Value) => boolean) => List<Value>;
  dropWhile: (condition: (value: Value) => boolean) => List<Value>;
  take: (count: number) => List<Value>;
  takeLast: (count: number) => List<Value>;
  takeUntil: (condition: (value: Value) => boolean) => List<Value>;
  takeWhile: (condition: (value: Value) => boolean) => List<Value>;
  zip: (list: List<Value>) => List<Value>;
  repeat: (count: number, value: Value) => List<Value>;
}

export const of = <Value = never>(...values: Value[]): List<Value> => {
  return {
    keep: (when: (value: Value) => boolean) => {
      return of(...values.filter(value => {
        return when(value);
      }));
    },
    any: (when) => {
      return values.some(value => {
        return when(value);
      });
    },
    all: (when) => {
      return values.every(value => {
        return when(value);
      })
    },
    remove: (when: (value: Value) => boolean) => {
      return of(...values.filter(value => {
        return !when(value);
      }));
    },
    removeAt: (index) => {
      return of(...values.filter((_, currentIndex) => {
        return index !== currentIndex;
      }));
    },
    find: (when) => {
      const value = values.find(value => {
        return when(value);
      });

      if (typeof value === "undefined") {
        return none();
      }

      return some<Value>(value);
    },
    position: (is) => {
      const result = values.findIndex(value => {
        return is(value);
      });

      if (result < 0) {
        return none();
      }

      return some(result);
    },
    updateAll: (update) => {
      return of(...values.map(value => update(value)));
    },
    updateAt: (index, update) => {
      return of(...values.map((value, currentIndex) => {
        if (currentIndex !== index) {
          return value;
        }

        return update(value);
      }));
    },
    count: () => {
      return values.length;
    },
    first: (): Maybe<Value> => {
      const value = values.at(0);

      if (!value) {
        return none();
      }

      return some<Value>(value);
    },
    last: (): Maybe<Value> => {
      const value = values.at(-1);

      if (!value) {
        return none();
      }

      return some<Value>(value);
    },
    at: (index: number): Maybe<Value> => {
      const value = values.at(index);

      if (!value) {
        return none();
      }

      return some<Value>(value);
    },
    toArray() {
      return values;
    },
    append: (...newValues) => {
      return of(...values, ...newValues);
    },
    enumerate: () => {
      return of(...values.entries());
    },
    each: (effect) => {
      values.forEach(value => {
        effect(value);
      });

      return of(...values);
    },
    sort: () => {
      return of(...values.toSorted());
    },
    indices: () => {
      return of(...values.keys());
    },
    has: (condition) => {
      const found = values.find(value => {
        return condition(value);
      });

      return typeof found !== "undefined";
    },
    join: (separator) => {
      return values.join(separator);
    }
  };
};
