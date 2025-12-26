import * as maybe from "../../maybe";

export function get(element: HTMLElement) {
  if (element instanceof HTMLInputElement) {
    return maybe.some(element.value);
  }

  return maybe.none<string>();
}
