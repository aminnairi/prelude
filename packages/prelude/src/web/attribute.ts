export * as value from "./attribute/value";
export * as textContent from "./attribute/textContent";

export function set(attributeName: string, attributeValue: string): (element: HTMLElement) => HTMLElement
export function set(attributeName: string, attributeValue: string, element: HTMLElement): HTMLElement
export function set(attributeName: string, attributeValue: string, element?: HTMLElement) {
  const execute = (attributeName: string, attributeValue: string, element: HTMLElement): HTMLElement => {
    element.setAttribute(attributeName, attributeValue);
    return element;
  };

  if (typeof element === "undefined") {
    return (element: HTMLElement): HTMLElement => {
      return execute(attributeName, attributeValue, element);
    };
  }

  return execute(attributeName, attributeValue, element);
}

export function get(attributeName: string): (element: HTMLElement) => string | null;
export function get(attributeName: string, element: HTMLElement): string | null;
export function get(attributeName: string, element?: HTMLElement) {
  const execute = (attributeName: string, element: HTMLElement) => {
    return element.getAttribute(attributeName);
  };

  if (typeof element === "undefined") {
    return (element: HTMLElement) => {
      return execute(attributeName, element);
    };
  }

  return execute(attributeName, element);
}

