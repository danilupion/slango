/**
 * Module for managing the test MongoDB URI.
 * This allows tests to access the current test database URI without relying on environment variables.
 */

let currentTestMongoUri: null | string = null;

/**
 * Sets the current test MongoDB URI.
 * Called internally by setupMongoTestEnvironment().
 * @internal
 */
export function setTestMongoUri(uri: string): void {
  currentTestMongoUri = uri;
}

/**
 * Gets the current test MongoDB URI.
 * Use this to configure frameworks (like NestJS) that need the database connection string.
 *
 * @example
 * ```typescript
 * // In your test setup
 * import { getTestMongoUri } from '@slango/mangusta/test-utils/testMongoUri';
 *
 * const moduleFixture = await Test.createTestingModule({
 *   imports: [AppModule],
 * })
 *   .overrideProvider(DATABASE_URI)
 *   .useFactory({ factory: () => getTestMongoUri() })
 *   .compile();
 * ```
 *
 * @throws Error if called before setupMongoTestEnvironment() has run
 */
export function getTestMongoUri(): string {
  if (!currentTestMongoUri) {
    throw new Error(
      'Test MongoDB URI not available. Ensure setupMongoTestEnvironment() is called in beforeAll.',
    );
  }
  return currentTestMongoUri;
}

/**
 * Clears the current test MongoDB URI.
 * Called internally by setupMongoTestEnvironment() in afterAll.
 * @internal
 */
export function clearTestMongoUri(): void {
  currentTestMongoUri = null;
}
