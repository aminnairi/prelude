import { list, chain, text, maybe, numeric, pattern, logic, future, http } from "@aminnairi/prelude";
import { z } from "zod";

const fileContent = `
  1;2;3;4;5
  6;7;8;9;10
  11;12;13;14;15
`;

const sumCSVFileContent = chain
  .of(text.lines())
  .and(logic.pipe(list.update(text.split(";"))))
  .and(logic.pipe(list.update(list.update(text.toInteger()))))
  .and(logic.pipe(list.update(list.update(maybe.or(0)))))
  .and(logic.pipe(list.update(list.upgrade(0, numeric.add()))))
  .and(logic.pipe(list.upgrade(0, numeric.add())))
  .value();

console.assert(sumCSVFileContent(fileContent) === 120, "CSV file sum should give 120");

const isValidPassword = chain
  .of(pattern.test(/[a-z]/))
  .and(logic.and(pattern.test(/[A-Z]/)))
  .and(logic.and(pattern.test(/\d/)))
  .and(logic.and(pattern.test(/[^a-zA-Z0-9]/)))
  .value();

console.assert(isValidPassword("Password123!@#") === true, "Password123!@# should be valid");
console.assert(isValidPassword("password") === false, "password should be invalid");

const userIdSchema = (input: JSON) => {
  const schema = z.object({
    id: z.number(),
  });

  const validation = schema.safeParse(input);

  if (validation.success) {
    return validation.data.id;
  }

  return 0;
};

const getUserPosts = chain
  .of(text.from)
  .and(logic.pipe(text.prefix("https://jsonplaceholder.typicode.com/users/")))
  .and(logic.pipe(http.get))
  .and(logic.pipe(future.upgrade(http.json)))
  .and(logic.pipe(future.update(userIdSchema)))
  .and(logic.pipe(future.update(text.from)))
  .and(logic.pipe(future.update(text.prefix("https://jsonplaceholder.typicode.com/users/"))))
  .and(logic.pipe(future.update(text.suffix("/posts"))))
  .and(logic.pipe(future.upgrade(http.get)))
  .and(logic.pipe(future.upgrade(http.json)))
  .value();

getUserPosts(1).when(console.log, console.error);
// [{userId: 1, id: 7, title: "magnam facilitis autem", body: "..."}, ...]
