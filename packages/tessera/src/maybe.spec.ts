import { describe, expectTypeOf, it } from 'vitest';

import { Maybe, Nullable, Optional } from './maybe.js';

describe('Maybe Types', () => {
  it('Maybe type should allow null, undefined, or T', () => {
    expectTypeOf<Maybe<string>>().toMatchTypeOf<null | string | undefined>();
    expectTypeOf<Maybe<string>>().not.toMatchTypeOf<number>();
  });

  it('Nullable type should allow null or T', () => {
    expectTypeOf<Nullable<string>>().toMatchTypeOf<null | string>();
    expectTypeOf<Nullable<string>>().not.toMatchTypeOf<undefined>();
    expectTypeOf<Nullable<string>>().not.toMatchTypeOf<number>();
  });

  it('Optional type should allow undefined or T', () => {
    expectTypeOf<Optional<string>>().toMatchTypeOf<string | undefined>();
    expectTypeOf<Optional<string>>().not.toMatchTypeOf<null>();
    expectTypeOf<Optional<string>>().not.toMatchTypeOf<number>();
  });
});
