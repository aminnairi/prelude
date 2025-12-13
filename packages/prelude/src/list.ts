import * as maybe from "./maybe";

export const keep = <Value>(when: (value: Value) => boolean) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.filter(value => {
      return when(value);
    })];
  };
};

export const join = <Value>(separator: string) => {
  return (list: Array<Value>): string => {
    return list.join(separator);
  };
};

export const remove = <Value>(when: (value: Value) => boolean) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.filter(value => {
      return !when(value);
    })];
  };
};


export const removeAt = <Value>(index: number) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.filter((_, currentIndex) => {
      return index !== currentIndex;
    })];
  };
};


export const update = <Value, NewValue>(transform: (value: Value) => NewValue) => {
  return (list: Array<Value>): Array<NewValue> => {
    return [...list.map(value => transform(value))];
  };
};


export const updateAt = <Value>(index: number, update: (value: Value) => Value) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.map((value, currentIndex) => {
      if (currentIndex !== index) {
        return value;
      }

      return update(value);
    })];
  };
};

export const first = <Value>() => {
  return (list: Array<Value>) => {

    const value = list.at(0);

    if (!value) {
      return maybe.none<Value>();
    }

    return maybe.some<Value>(value);
  }
};

export const last = <Value>() => {
  return (list: Array<Value>) => {
    const value = list.at(-1);

    if (!value) {
      return maybe.none<Value>();
    }

    return maybe.some<Value>(value);
  };
};

export const at = <Value>(index: number) => {
  return (list: Array<Value>) => {
    const value = list.at(index);

    if (!value) {
      return maybe.none<Value>();
    }

    return maybe.some<Value>(value);
  }
};

export const count = <Value>() => {
  return (list: Array<Value>) => {
    return list.length;
  };
};

export const any = <Value>(accept: (value: Value) => boolean) => {
  return (list: Array<Value>) => {
    return list.some(value => {
      return accept(value);
    });
  };
};

export const all = <Value>(accept: (value: Value) => boolean) => {
  return (list: Array<Value>) => {
    return list.every(value => {
      return accept(value);
    });
  };
};

export const find = <Value>(accept: (value: Value) => boolean) => {
  return (list: Array<Value>) => {
    const value = list.find(value => {
      return accept(value);
    });

    if (typeof value === "undefined") {
      return maybe.none();
    }

    return maybe.some<Value>(value);
  };
};

export const position = <Value>(is: (value: Value) => boolean) => {
  return (list: Array<Value>) => {
    const result = list.findIndex(value => {
      return is(value);
    });

    if (result < 0) {
      return maybe.none();
    }

    return maybe.some(result);
  };
};

export const append = <Value>(...newValues: Value[]) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list, ...newValues];
  };
};

export const enumerate = <Value>() => {
  return (list: Array<Value>): Array<[number, Value]> => {
    return [...list.entries()];
  };
};

export const each = <Value>(effect: (value: Value) => void) => {
  return (list: Array<Value>): Array<Value> => {
    const values = list;

    values.forEach(value => {
      effect(value);
    });

    return [...values];
  };
};

export const sort = <Value>() => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.toSorted()];
  };
};

export const indices = <Value>() => {
  return (list: Array<Value>): Array<number> => {
    return [...list.keys()];
  };
};

export const has = <Value>(condition: (value: Value) => boolean) => {
  return (list: Array<Value>) => {
    const found = list.find(value => {
      return condition(value);
    });

    return typeof found !== "undefined";
  };
};

export const drop = <Value>(count: number) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.slice(count)];
  };
};

export const dropLast = <Value>(count: number) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.slice(0, -count)];
  };
};

export const dropUntil = <Value>(condition: (value: Value) => boolean) => {
  return (list: Array<Value>): Array<Value> => {
    const [value, ...remainingValues] = list;

    if (!value) {
      return [...remainingValues];
    }

    const refused = condition(value);

    if (refused) {
      return dropUntil(condition)([...remainingValues]);
    }

    return [value, ...remainingValues];
  };
};

export const take = <Value>(count: number) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.slice(0, count)];
  };
};

export const takeLast = <Value>(count: number) => {
  return (list: Array<Value>): Array<Value> => {
    return [...list.slice(count - 1)];
  };
};

export const takeUntil = <Value>(condition: (value: Value) => boolean) => {
  return (list: Array<Value>): Array<Value> => {
    const [value, ...remainingValues] = list;

    if (!value) {
      return [];
    }

    const refused = condition(value);

    if (refused) {
      return [];
    }

    return [value, ...takeUntil(condition)(remainingValues)];
  };
};

export const zip = <Value, OtherValue>(other: Array<OtherValue>) => {
  return (list: Array<Value>): Array<[Value, OtherValue]> => {
    const arrayList = list;
    const otherArrayList = other;
    const length = Math.min(arrayList.length, otherArrayList.length);
    const result: [Value, OtherValue][] = [];

    for (let i = 0; i < length; i++) {
      result.push([arrayList[i]!, otherArrayList[i]!]); // Using non-null assertion operator
    }

    return [...result];
  };
}

export const upgrade = <Value, NewValue>(value: NewValue, reducer: (previous: NewValue, current: Value) => NewValue) => {
  return (list: Array<Value>) => {
    return list.reduce((previous, current) => {
      return reducer(previous, current);
    }, value);
  };
};


