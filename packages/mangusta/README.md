# Mangusta (@slango/mangusta)

Mongoose middlewares and utilities.

## Installation

```bash
pnpm add @slango/mangusta
```

## Usage

```ts
import { Schema } from 'mongoose';
import password from '@slango/mangusta/middleware/password';

const UserSchema = new Schema();
UserSchema.plugin(password());
```

## Testing

Run linting and unit tests:

```bash
pnpm lint
pnpm test
```

## Contributing

Issues and pull requests are welcome.
