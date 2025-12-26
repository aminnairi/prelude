export function set(attributeName: string, attributeValue: string): <Target extends HTMLElement>(element: Target) => Target
export function set<Target extends HTMLElement>(attributeName: string, attributeValue: string, element: Target): Target
export function set<Target extends HTMLElement>(attributeName: string, attributeValue: string, element?: Target) {
  const execute = (attributeName: string, attributeValue: string, element: Target): Target => {
    element.setAttribute(attributeName, attributeValue);
    return element;
  };

  if (typeof element === "undefined") {
    return (element: Target) => {
      return execute(attributeName, attributeValue, element);
    };
  }

  return execute(attributeName, attributeValue, element);
}

export function get(attributeName: string): <Target extends HTMLElement>(element: Target) => string | null;
export function get<Target extends HTMLElement>(attributeName: string, element: Target): string | null;
export function get<Target extends HTMLElement>(attributeName: string, element?: Target) {
  const execute = (attributeName: string, element: Target) => {
    return element.getAttribute(attributeName);
  };

  if (typeof element === "undefined") {
    return (element: Target) => {
      return execute(attributeName, element);
    };
  }

  return execute(attributeName, element);
}

