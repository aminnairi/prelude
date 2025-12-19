import { maybe, chain, web } from "@aminnairi/prelude";

const title = chain
  .of(document)
  .and(web.createElement("h1"))
  .and(web.setTextContent("Register form"))
  .link();

const button = chain
  .of(document)
  .and(web.createElement("button"))
  .and(web.setAttribute("id", "test"))
  .and(web.setTextContent("Register"))
  .link();

const input = chain
  .of(document)
  .and(web.createElement("input"))
  .and(web.setAttribute("type", "email"))
  .and(web.setAttribute("placeholder", "Ex: user@domain.com"))
  .and(web.setAttribute("required", "true"))
  .link();

const form = chain
  .of(document)
  .and(web.createElement("form"))
  .and(web.appendChild(input))
  .and(web.appendChild(button))
  .and(web.on("submit", web.preventDefault(() => {
    const email = chain
      .of(input)
      .and(web.getValue)
      .and(maybe.or(""))
      .link();

    alert(`Form submitted with email: ${email}`);
  })))
  .link();

chain
  .of(document.body)
  .and(web.appendChild(title))
  .and(web.appendChild(form));


