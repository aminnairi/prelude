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

export function setAttribute(attributeName: string, attributeValue: string): (element: HTMLElement) => HTMLElement
export function setAttribute(attributeName: string, attributeValue: string, element: HTMLElement): HTMLElement
export function setAttribute(attributeName: string, attributeValue: string, element?: HTMLElement) {
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

export function getAttribute(attributeName: string, element: HTMLElement): string | null;
export function getAttribute(attributeName: string, element?: HTMLElement) {
  const execute = (attributeName: string, element: HTMLElement) => {
    return element.getAttribute(attributeName);
  };
}

export function appendChild(child: Node): (parent: HTMLElement) => HTMLElement;
export function appendChild(child: Node, parent: HTMLElement): HTMLElement;
export function appendChild(child: Node, parent?: HTMLElement) {
  const execute = (child: Node, parent: HTMLElement) => {
    parent.appendChild(child);
    return parent;
  };

  if (typeof parent === "undefined") {
    return (parent: HTMLElement) => {
      return execute(child, parent);
    };
  }

  return execute(child, parent);
}

export function blur(element: HTMLElement) {
  element.blur();
  return element;
}

export function focus(element: HTMLElement) {
  element.focus();
  return element;
}

export function click(element: HTMLElement) {
  element.click();
  return element;
}

export function cloneNode(element: HTMLElement) {
  return element.cloneNode();
}

export function cloneNodeDeep(element: HTMLElement) {
  return element.cloneNode(true);
}

export function getElementsByClassName(className: string, element: HTMLElement): HTMLCollectionOf<Element>;
export function getElementsByClassName(className: string): (element: HTMLElement) => HTMLCollectionOf<Element>;
export function getElementsByClassName(className: string, element?: HTMLElement) {
  const execute = (className: string, element: HTMLElement) => {
    return element.getElementsByClassName(className);
  };

  if (typeof element === "undefined") {
    return (element: HTMLElement) => {
      return execute(className, element);
    };
  }

  return execute(className, element);
}

export function getElementsByTagName(name: string): (element: HTMLElement) => HTMLCollectionOf<Element>;
export function getElementsByTagName(name: string, element: HTMLElement): HTMLCollectionOf<Element>;
export function getElementsByTagName(name: string, element?: HTMLElement) {
  const execute = (name: string, element: HTMLElement) => {
    return element.getElementsByTagName(name);
  };

  if (typeof element === "undefined") {
    return (element: HTMLElement) => {
      return execute(name, element);
    };
  }

  return execute(name, element);
}

export function contains(node: Node): (element: HTMLElement) => boolean;
export function contains(node: Node, element: HTMLElement): boolean;
export function contains(node: Node, element?: HTMLElement) {
  const execute = (node: Node, element: HTMLElement) => {
    return element.contains(node);
  };

  if (typeof element === "undefined") {
    return (element: HTMLElement) => {
      return execute(node, element);
    };
  }

  return execute(node, element);
}

export function dispatchEvent(event: Event): (element: HTMLElement) => HTMLElement;
export function dispatchEvent(event: Event, element: HTMLElement): HTMLElement;
export function dispatchEvent(event: Event, element?: HTMLElement) {
  const execute = (event: Event, element: HTMLElement) => {
    element.dispatchEvent(event);
    return element;
  }

  if (typeof element === "undefined") {
    return (element: HTMLElement) => {
      return execute(event, element);
    };
  }

  return execute(event, element);
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
