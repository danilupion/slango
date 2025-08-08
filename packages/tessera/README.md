# Tessera (@slango/tessera)

Collection of TypeScript utilities.

## Installation

```bash
pnpm add @slango/tessera
```

## Usage

```ts
import type { Maybe } from '@slango/tessera/maybe';

function greet(name: Maybe<string>) {
  return name ?? 'Anonymous';
}
```

## Testing

Run linting and unit tests:

```bash
pnpm lint
pnpm test
```

## Contributing

Issues and pull requests are welcome.
