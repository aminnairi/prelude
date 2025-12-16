import { chain, text, basic, future, http } from "@aminnairi/prelude";
import { z } from "zod";

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
