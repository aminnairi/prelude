import * as maybe from "./maybe";
import * as text from "./text";

interface List<Value> {
  value: () => Array<Value>;
}

export const of = <Value = never>(...values: Value[]): List<Value> => {
  return {
    value() {
      return values;
    },
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

export const first = <Value>() => {
  return (list: List<Value>) => {

    const value = list.value().at(0);

    if (!value) {
      return maybe.none<Value>();
    }

    return maybe.some<Value>(value);
  }
};

export const last = <Value>() => {
  return (list: List<Value>) => {
    const value = list.value().at(-1);

    if (!value) {
      return maybe.none<Value>();
    }

    return maybe.some<Value>(value);
  };
};

export const at = <Value>(index: number) => {
  return (list: List<Value>) => {
    const value = list.value().at(index);

    if (!value) {
      return maybe.none<Value>();
    }

    return maybe.some<Value>(value);
  }
};

export const count = <Value>() => {
  return (list: List<Value>) => {
    return list.value().length;
  };
};

export const any = <Value>(accept: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return list.value().some(value => {
      return accept(value);
    });
  };
};

export const all = <Value>(accept: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    return list.value().every(value => {
      return accept(value);
    });
  };
};

export const find = <Value>(accept: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    const value = list.value().find(value => {
      return accept(value);
    });

    if (typeof value === "undefined") {
      return maybe.none();
    }

    return maybe.some<Value>(value);
  };
};

export const position = <Value>(is: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    const result = list.value().findIndex(value => {
      return is(value);
    });

    if (result < 0) {
      return maybe.none();
    }

    return maybe.some(result);
  };
};

export const append = <Value>(...newValues: Value[]) => {
  return (list: List<Value>) => {
    return of(...list.value(), ...newValues);
  };
};

export const enumerate = <Value>() => {
  return (list: List<Value>) => {
    return of(...list.value().entries());
  };
};

export const each = <Value>(effect: (value: Value) => void) => {
  return (list: List<Value>) => {
    const values = list.value();

    values.forEach(value => {
      effect(value);
    });

    return of(...values);
  };
};

export const sort = <Value>() => {
  return (list: List<Value>) => {
    return of(...list.value().toSorted());
  };
};

export const indices = <Value>() => {
  return (list: List<Value>) => {
    return of(...list.value().keys());
  };
};

export const has = <Value>(condition: (value: Value) => boolean) => {
  return (list: List<Value>) => {
    const found = list.value().find(value => {
      return condition(value);
    });

    return typeof found !== "undefined";
  };
};

export const drop = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(count));
  };
};

export const dropLast = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(0, -count));
  };
};

export const dropUntil = <Value>(condition: (value: Value) => boolean) => {
  return (list: List<Value>): List<Value> => {
    const [value, ...remainingValues] = list.value();

    if (!value) {
      return of(...remainingValues);
    }

    const refused = condition(value);

    if (refused) {
      return dropUntil(condition)(of(...remainingValues));
    }

    return of(value, ...remainingValues);
  };
};

export const take = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(0, count));
  };
};

export const takeLast = <Value>(count: number) => {
  return (list: List<Value>) => {
    return of(...list.value().slice(count - 1));
  };
};

export const takeUntil = <Value>(condition: (value: Value) => boolean) => {
  return (list: List<Value>): List<Value> => {
    const [value, ...remainingValues] = list.value();

    if (!value) {
      return of();
    }

    const refused = condition(value);

    if (refused) {
      return of();
    }

    return of(value, ...takeUntil(condition)(of(...remainingValues)).value());
  };
};

export const zip = <Value>(other: List<Value>) => {
  return (list: List<Value>): List<Value> => {
    const arrayList = list.value();
    const [first, ...remainingValues] = arrayList;

    if (!first) {
      return of(...arrayList);
    }

    const [second, ...remainingOthers] = other.value();

    if (!second) {
      return of(first, ...remainingValues);
    }

    return of(first, second, ...zip(of(...remainingOthers))(of(...remainingValues)).value());
  };
}
