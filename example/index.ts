import { list, chain, text, maybe, numeric, pattern, basic, future, http, boolean } from "@aminnairi/prelude";
import { z } from "zod";

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

const isValidPassword = chain
  .of(pattern.test(/[a-z]/))
  .and(boolean.and(pattern.test(/[A-Z]/)))
  .and(boolean.and(pattern.test(/\d/)))
  .and(boolean.and(pattern.test(/[^a-zA-Z0-9]/)))
  .link();

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
  .and(basic.pipe(text.prefix("https://jsonplaceholder.typicode.com/users/")))
  .and(basic.pipe(http.get))
  .and(basic.pipe(future.upgrade(http.json)))
  .and(basic.pipe(future.update(userIdSchema)))
  .and(basic.pipe(future.update(text.from)))
  .and(basic.pipe(future.update(text.prefix("https://jsonplaceholder.typicode.com/users/"))))
  .and(basic.pipe(future.update(text.suffix("/posts"))))
  .and(basic.pipe(future.upgrade(http.get)))
  .and(basic.pipe(future.upgrade(http.json)))
  .link();

getUserPosts(1).when(console.log, console.error);
// [{userId: 1, id: 7, title: "magnam facilitis autem", body: "..."}, ...]
