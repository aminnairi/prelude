import { basic, chain, maybe, web } from "@aminnairi/prelude";

const toggleDrawerWithId = chain.of(web.getElementById)
  .and(basic.pipe(maybe.and(web.toggleClass("opened"))))
  .and(basic.pipe(maybe.and(web.on("click", () => alert("Hello")))))
  .link();

const element = toggleDrawerWithId("drawer").or(null);

if (!element) {
  console.error("nothing to toggle because element is not found");
}
