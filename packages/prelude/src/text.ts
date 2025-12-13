import * as maybe from "./maybe";

export const count = () => {
  return (text: string) => {
    return text.length;
  };
};

export const concatenate = (suffix: string) => {
  return (text: string) => {
    return text + suffix;
  };
};

export const updateAll = (update: (character: string) => string) => {
  return (text: string) => {
    return text.split("").map(character => {
      return update(character);
    }).join("");
  };
};

export const updateAt = (index: number, update: (character: string) => string) => {
  return (text: string) => {
    return text.split("").map((character, currentIndex) => {
      if (currentIndex !== index) {
        return character;
      }

      return update(character);
    }).join("");
  };
};

export const lines = () => {
  return (text: string): Array<string> => {
    return [...text.split("\n")];
  };
};

export const split = (separator: string) => {
  return (text: string): Array<string> => {
    return [...text.split(separator)];
  };
};

export const toInteger = () => {
  return (text: string) => {
    const value = parseInt(text);

    if (Number.isNaN(value)) {
      return maybe.none<number>();
    }

    return maybe.some(value);
  };
};
