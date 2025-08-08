# Ristretto (@slango/ristretto)

Opinionated REST client.

## Installation

```bash
pnpm add @slango/ristretto
```

## Usage

```ts
import { get } from '@slango/ristretto';

const user = await get<User>('https://api.example.com/users/1')();
```

## Testing

Run linting and unit tests:

```bash
pnpm lint
pnpm test
```

## Contributing

Issues and pull requests are welcome.
