import { list, chain, text, maybe, numeric } from "@aminnairi/prelude";

const file = `
  1;2;3;4;5
  6;7;8;9;10
  11;12;13;14;15
`;

const identity = <Value>() => (value: Value) => value;

chain.of("")
  .and(text.lines())
  .and(list.update(text.toInteger()))
  .and(list.update(maybe.or(0)))


chain.of(file)
  .and(text.lines())
  .and(list.update(line => chain.of(line).and(text.split(";")).value()))
  .and(list.update(line => chain.of(line).and(list.update(text.toInteger())).value()))
  .and(list.update(line => chain.of(line).and(list.update(maybe.or(0))).value()))
  .and(list.update(line => chain.of(line).and(list.upgrade(0, (total, value) => chain.of(value).and(numeric.add(total)).value()))))
