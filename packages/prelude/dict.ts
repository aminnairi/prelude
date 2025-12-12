import { none, some, type Maybe } from "./maybe";

type A = {
  amin: true,
  handsome: "yes"
}

type B = Omit<A, "handsome">

interface Dict<Target extends Record<string, unknown>> {
  keys: () => string[];
  values: () => unknown[];
  pairs: () => [string, Target[keyof Target]][];
  get: (key: keyof Target) => Maybe<Target[typeof key]>;
  set: (key: keyof Target, value: Target[typeof key]) => Dict<Target>;
  remove: <Key extends keyof Target>(key: Key) => Dict<Omit<Target, Key>>;
}

export const of = <Target extends Record<string, unknown>>(target: Target): Dict<Target> => {
  return {
    keys: () => {
      return Object.keys(target);
    },
    values: () => {
      return Object.values(target);
    },
    pairs: () => {
      return Object.entries(target) as [string, Target[keyof Target]][];
    },
    get: (key) => {
      const value = target[key];

      if (typeof value === "undefined") {
        return none();
      }

      return some<Target[typeof key]>(value);
    },
    set: (key, value) => {
      return of(Object.fromEntries(Object.entries(target).map(([oldKey, oldValue]) => {
        if (oldKey !== key) {
          return [oldKey, oldValue];
        }

        return [oldKey, value];
      })) as Target);
    },
    remove: (key) => {
      return of(Object.fromEntries(Object.entries(target).filter(([oldKey, oldValue]) => {
        return oldKey !== key;
      })) as Omit<Target, typeof key>);
    }
  };
};

const x = of({
  amin: true,
  handsome: "yes"
}).remove("handsome");
