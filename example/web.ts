import { basic, chain, maybe, web } from "@aminnairi/prelude";

const openCloseDrawer = chain.of(web.getElementById)
  .and(basic.pipe(maybe.and(web.toggleClass("opened"))))
  .and(basic.pipe(maybe.and(web.on("click", () => alert("Hello")))))
  .link();

openCloseDrawer("drawer");
