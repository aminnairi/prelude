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
