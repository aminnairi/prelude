import { list, chain, text, maybe, numeric, basic } from "@aminnairi/prelude";

const fileContent = `
  1;2;3;4;5
  6;7;8;9;10
  11;12;13;14;15
`;

const sumCSVFileContent = chain
  .of(text.lines())
  .and(basic.pipe(list.update(text.split(";"))))
  .and(basic.pipe(list.update(list.update(text.toInteger()))))
  .and(basic.pipe(list.update(list.update(maybe.or(0)))))
  .and(basic.pipe(list.update(list.upgrade(0, numeric.add()))))
  .and(basic.pipe(list.upgrade(0, numeric.add())))
  .link();

console.assert(sumCSVFileContent(fileContent) === 120, "CSV file sum should give 120");
