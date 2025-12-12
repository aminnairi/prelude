# @aminnairi/prelude

Type-safe standard library for TypeScript

## Installation

```bash
npm i @aminnairi/prelude
```

## Usage

```typescript
import { chain, list } from "@aminnairi/prelude";

chain
  .of(list.of(1, 2, 3))
  .and(list.keep((value) => value < 3))
  .and(list.each(console.log));
```

## Example

See [`example`](../../example/)
