import { list, stream, future } from "@aminnairi/prelude";

stream
  .of(future.of<number>(succeed => setTimeout(() => succeed(123), 1000)))
  .and(future.update(value => value * 2))
  .value()
  .when(console.log, console.error);

const result = stream
  .of(list.of(1, 2, 3))
  .and(list.keep(value => value < 3))
  .value()
  .value();

console.log(result);
// [1, 2]
