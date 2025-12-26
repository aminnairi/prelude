export function set(content: string): (element: HTMLElement) => HTMLElement;
export function set(content: string, element: HTMLElement): HTMLElement;
export function set(content: string, element?: HTMLElement) {
  const execute = (content: string, element: HTMLElement) => {
    element.textContent = content;
    return element;
  };

  if (typeof element === "undefined") {
    return (element: HTMLElement) => {
      return execute(content, element);
    };
  }

  return execute(content, element);
}
