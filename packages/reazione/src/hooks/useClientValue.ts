'use client';

import { useEffect, useMemo, useState } from 'react';

type Options<T> = {
  deps?: unknown[];
  initialValue: T;
};

/**
 * Renders `initialValue` on the server/hydration pass, then resolves the
 * value with `initializer` on the client (re-running when `deps` change).
 * Avoids hydration mismatches for values that only exist client-side.
 */
export function useClientValue<T>(
  initializer: () => T,
  { deps = [], initialValue }: Options<T>,
): T {
  const [value, setValue] = useState<T>(initialValue);

  // Dynamic deps by design: callers own the dependency list of `initializer`.
  // oxlint-disable-next-line react/exhaustive-deps
  const memoizedInitializer = useMemo(() => initializer, deps);

  useEffect(() => {
    setValue(memoizedInitializer());
  }, [memoizedInitializer]);

  return value;
}
