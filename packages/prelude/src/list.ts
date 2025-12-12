import { none, some, type Maybe } from "./maybe";
import * as text from "./text";

interface List<Value> {
  first: () => Maybe<Value>;
  last: () => Maybe<Value>;
  at: (index: number) => Maybe<Value>;
  count: () => number;
  value: () => Array<Value>;
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
  drop: (count: number) => List<Value>;
  dropLast: (count: number) => List<Value>;
  dropUntil: (condition: (value: Value) => boolean) => List<Value>;
  take: (count: number) => List<Value>;
  takeLast: (count: number) => List<Value>;
  takeUntil: (condition: (value: Value) => boolean) => List<Value>;
  zip: (list: List<Value>) => List<Value>;
}

export const of = <Value = never>(...values: Value[]): List<Value> => {
  return {
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
    value() {
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
    drop: (count) => {
      return of(...values.slice(count));
    },
    dropLast: (count) => {
      return of(...values.slice(0, -count));
    },
    dropUntil: (condition) => {
      const [value, ...remainingValues] = values;

      if (!value) {
        return of(...remainingValues);
      }

      const refused = condition(value);

      if (refused) {
        return of(...remainingValues).dropUntil(condition);
      }

      return of(value, ...remainingValues);
    },
    take: (count) => {
      return of(...values.slice(0, count));
    },
    takeLast: (count) => {
      return of(...values.slice(count - 1));
    },
    takeUntil: (condition) => {
      const [value, ...remainingValues] = values;

      if (!value) {
        return of();
      }

      const refused = condition(value);

      if (refused) {
        return of();
      }

      return of(...[value, ...of(...remainingValues).takeUntil(condition).value()]);
    },
    zip: (list) => {
      const arrayList = list.value();
      const [first, ...remainingValues] = values;

      if (!first) {
        return of(...arrayList);
      }

      const [second, ...remainingArrayList] = arrayList;

      if (!second) {
        return of(first, ...remainingValues);
      }

      return of(...[first, second, ...of(...remainingValues).zip(of(...remainingArrayList)).value()]);
    }
  };
};

export const keep = <Value>(when: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return of(...list.value().filter(value => {
      return when(value);
    }));
  };
};

export const join = <Value>(separator: text.Text) => {
  return (list: List<Value>) => {
    return text.of(list.value().join(separator.value()));
  };
};

export const remove = <Value>(when: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return of(...list.value().filter(value => {
      return !when(value);
    }));
  };
};


export const removeAt = <Value>(index: number) => {
  return (list: List<Value>) => {
    return of(...list.value().filter((_, currentIndex) => {
      return index !== currentIndex;
    }));
  };
};


export const update = <Value, NewValue>(transform: (value: Value) => NewValue) => {
  return (list: List<Value>) => {
    return of(...list.value().map(value => transform(value)));
  };
};


export const updateAt = <Value>(index: number, update: (value: Value) => Value) => {
  return (list: List<Value>) => {
    return of(...list.value().map((value, currentIndex) => {
      if (currentIndex !== index) {
        return value;
      }

      return update(value);
    }));
  };
};
