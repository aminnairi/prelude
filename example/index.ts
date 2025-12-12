import * as list from "@aminnairi/prelude/list";

const result = list
  .of(1, 2, 3)
  .at(5)
  .or(-1);

console.log(result);
