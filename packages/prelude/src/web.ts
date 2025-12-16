import * as maybe from "./maybe";

export const getElementById = (id: string) => {
  const element = document.getElementById(id);

  if (!element) {
    return maybe.none<HTMLElement>();
  }

  return maybe.some(element)
};

export function toggleClass(className: string, element: HTMLElement): HTMLElement;
export function toggleClass(className: string): (element: HTMLElement) => HTMLElement;
export function toggleClass(className: string, element?: HTMLElement) {
  function execute(className: string, element: HTMLElement) {
    element.classList.toggle(className);
    return element;
  }

  if (!element) {
    return function (element: HTMLElement) {
      return execute(className, element);
    }
  }

  return execute(className, element);
}

export function on(name: string, handler: EventListenerOrEventListenerObject, element: HTMLElement): HTMLElement;
export function on(name: string, handler: EventListenerOrEventListenerObject): (element: HTMLElement) => HTMLElement;
export function on(name: string, handler: EventListenerOrEventListenerObject, element?: HTMLElement) {
  function execute(name: string, handler: EventListenerOrEventListenerObject, element: HTMLElement) {
    element.addEventListener(name, handler);
    return element;
  }

  if (!element) {
    return function (element: HTMLElement) {
      return execute(name, handler, element);
    }
  }

  return execute(name, handler, element);
}
