import { chain, pattern, boolean } from "@aminnairi/prelude";

const isValidPassword = chain
  .of(pattern.test(/[a-z]/))
  .and(boolean.and(pattern.test(/[A-Z]/)))
  .and(boolean.and(pattern.test(/\d/)))
  .and(boolean.and(pattern.test(/[^a-zA-Z0-9]/)))
  .link();

console.assert(isValidPassword("Password123!@#") === true, "Password123!@# should be valid");
console.assert(isValidPassword("password") === false, "password should be invalid");
