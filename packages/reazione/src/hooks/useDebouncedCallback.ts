'use client';

import { useCallback, useEffect, useRef } from 'react';

export type DebouncedCallback<Args extends unknown[]> = {
  run: (...args: Args) => void;
  cancel: () => void;
};

/**
 * Returns a debounced wrapper around the latest `callback` plus a `cancel`
 * for flushing pending invocations (e.g. when clearing an input). The timer
 * is cleaned up on unmount and `run`/`cancel` have stable identities.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
): DebouncedCallback<Args> => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const cancel = useCallback(() => clearTimeout(timeoutRef.current), []);

  const run = useCallback(
    (...args: Args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [delayMs],
  );

  return { run, cancel };
};
