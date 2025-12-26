import { maybe, chain, web } from "@aminnairi/prelude";

// Creation

const title = chain
  .of(document)
  .and(web.createElement("h1"))
  .and(web.property.textContent.set("Register form"))
  .link();

const button = chain
  .of(document)
  .and(web.createElement("button"))
  .and(web.attribute.set("id", "test"))
  .and(web.property.textContent.set("Register"))
  .link();

const input = chain
  .of(document)
  .and(web.createElement("input"))
  .and(web.attribute.set("type", "email"))
  .and(web.attribute.set("placeholder", "Ex: user@domain.com"))
  .and(web.attribute.set("required", "true"))
  .link();

const form = chain
  .of(web.element.form.create())
  .and(web.attribute.set("autofocus", "true"))
  .and(web.appendChild(input))
  .and(web.appendChild(button))
  .link();

// LISTENERS

chain
  .of(form)
  .and(web.on("submit", web.preventDefault(() => {
    const email = chain
      .of(input)
      .and(web.property.value.get)
      .and(maybe.or(""))
      .link();

    alert(`Form submitted with email: ${email}`);

    web.reset(form);
  })));

// ATTACH TO BODY

chain
  .of(document.body)
  .and(web.appendChild(title))
  .and(web.appendChild(form));
