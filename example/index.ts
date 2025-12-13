import { list, chain, text, maybe, numeric } from "@aminnairi/prelude";

const file = `
  1;2;3;4;5
  6;7;8;9;10
  11;12;13;14;15
`;

chain.of(file)
  .and(text.of)
  .and(text.lines())
  .and(list.update(line => chain.of(line).and(text.split(text.of(";"))).value()))
  .and(list.update(line => chain.of(line).and(list.update(text.toInteger())).value()))
  .and(list.update(line => chain.of(line).and(list.update(maybe.or(numeric.of(0)))).value()))
  .and(list.update(line => chain.of(line).and(list.upgrade(numeric.of(0), (total, value) => chain.of(value).and(numeric.add(total)).value())).value()))
