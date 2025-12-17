import { describe, test, expect, vi } from "vitest";
import * as web from "./web";
import * as chain from "./chain";
import * as maybe from "./maybe";

describe("web", () => {
  test("getElementById", () => {
    const div = document.createElement("div");

    div.id = "something";

    document.body.appendChild(div);

    const foundElement = chain
      .of(web.getElementById("something"))
      .and(maybe.or(document.createElement("span")))
      .link();

    const notFoundElement = chain
      .of(web.getElementById("nothing"))
      .and(maybe.or(document.createElement("span")))
      .link();

    expect(foundElement.id).toStrictEqual("something");
    expect(notFoundElement.id).toStrictEqual("");

    document.body.removeChild(div);
  });

  test("toggleClass", () => {
    const div = document.createElement("div");

    div.id = "something";

    document.body.appendChild(div);

    web.toggleClass("slide-in", div);

    chain
      .of(web.getElementById("something"))
      .and(maybe.and(web.toggleClass("open")))

    expect(div.classList.contains("open")).toBe(true);
    expect(div.classList.contains("slide-in")).toBe(true);
  });

  test("on", () => {
    const button = document.createElement("button");
    const onClickHandler = vi.fn();
    const onFocusHandler = vi.fn();

    document.body.appendChild(button);

    web.on("click", onClickHandler, button);

    const onClickFor = chain.of(web.on("focus", onFocusHandler)).link();

    onClickFor(button);

    button.click();
    button.focus();

    expect(onClickHandler).toHaveBeenCalledOnce();
    expect(onFocusHandler).toHaveBeenCalledOnce();

    document.body.removeChild(button);
  })
});
