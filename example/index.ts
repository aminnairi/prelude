import { list, chain } from "@aminnairi/prelude";

const result = chain
  .of(list.of(1, 2, 3))
  .and(list.keep(value => value < 3))
  .value()
  .value();

console.log(result);
