import { maybe, chain, web } from "@aminnairi/prelude";

const title = chain
  .of(document)
  .and(web.createElement("h1"))
  .and(web.attribute.textContent.set("Register form"))
  .link();

const button = chain
  .of(document)
  .and(web.createElement("button"))
  .and(web.attribute.set("id", "test"))
  .and(web.attribute.textContent.set("Register"))
  .link();

const input = chain
  .of(document)
  .and(web.createElement("input"))
  .and(web.attribute.set("type", "email"))
  .and(web.attribute.set("placeholder", "Ex: user@domain.com"))
  .and(web.attribute.set("required", "true"))
  .link();

const form = chain
  .of(document)
  .and(web.createElement("form"))
  .and(web.appendChild(input))
  .and(web.appendChild(button))
  .and(web.on("submit", web.preventDefault(() => {
    const email = chain
      .of(input)
      .and(web.attribute.value.get)
      .and(maybe.or(""))
      .link();

    alert(`Form submitted with email: ${email}`);
  })))
  .link();

chain
  .of(document.body)
  .and(web.appendChild(title))
  .and(web.appendChild(form));


