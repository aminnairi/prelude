import { basic, chain, maybe, web } from "@aminnairi/prelude";

const openCloseDrawer = chain.of(web.getElementById)
  .and(basic.pipe(maybe.and(web.toggleClass("opened"))))
  .link();

openCloseDrawer("drawer");
