## Project

The project is a library aiming to help users empower their TypeScript code with functional programming niceties to write code in a more declarative manner. The name of the prelude package is `@aminnairi/prelude`.

## Architecture

The project is architectured around the prelude package which located under the packages/prelude folder.

An example can also be found in the example folder.

## Code convention

Code should use functional programming style whenever possible and should avoid at any cost any mutation. Recursivity is encouraged.

## Documentation

Whenever the user wants you to document the code, you'll write for the prelude package inside the `README.md` file the complete API for all modules exported in the `packages/prelude/index.ts` file.

A good documentation for any exposed function looks like that.

```markdown
## API

### someModule

description of the module

#### someFunction

Description of the function

##### Signature

Function signature in here inside of a code block.

##### Example

Code sample in here inside of a code block
```

## Correctness

Each time you need to check if your work has not introduced any regression or type error, you should run the following commands.

The first commands aims to check for TypeScript lint errors.

```bash
npm -w packages/prelude run lint
```

The second command aims to check that the spec is still at 100% code coverage and all tests pass successfully.

```bash
npm -w packages/prelude test
```

In case something is wrong, you should fix and run again these commands until the issue is resolved.
