import * as maybe from "./maybe";
import * as numeric from "./numeric";
import * as list from "./list";

export interface Text {
  value: () => string;
}

export const of = (text: string): Text => {
  return {
    value: () => {
      return text;
    },
  };
};

export const count = () => {
  return (text: Text) => {
    return text.value().length;
  };
};

export const concatenate = (suffix: Text) => {
  return (text: Text) => {
    return of(text.value() + suffix.value());
  };
};

export const updateAll = (update: (character: Text) => Text) => {
  return (text: Text) => {
    return of(text.value().split("").map(character => {
      return update(of(character)).value();
    }).join(""));
  };
};

export const updateAt = (index: number, update: (character: Text) => Text) => {
  return (text: Text) => {
    return of(text.value().split("").map((character, currentIndex) => {
      if (currentIndex !== index) {
        return character;
      }

      return update(of(character)).value();
    }).join(""));
  };
};

export const lines = () => {
  return (text: Text) => {
    return list.of<Text>(...text.value().split("\n").map(value => of(value)));
  };
};

export const split = (separator: Text) => {
  return (text: Text) => {
    return list.of(...text.value().split(separator.value()).map(of));
  };
};

export const toInteger = () => {
  return (text: Text) => {
    const value = parseInt(text.value());

    if (Number.isNaN(value)) {
      return maybe.none<numeric.Numeric>();
    }

    return maybe.some(numeric.of(value));
  };
};
