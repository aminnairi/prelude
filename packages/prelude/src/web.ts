import * as maybe from "./maybe";

export const getElementById = (id: string) => {
  const element = document.getElementById(id);

  if (!element) {
    return maybe.none<HTMLElement>();
  }

  return maybe.some(element)
};

export const toggleClass = (className: string) => {
  return (element: HTMLElement) => {
    element.classList.toggle(className);
  };
};
