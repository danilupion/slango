'use client';

import { useEffect, useState } from 'react';

/**
 * Returns false during SSR/hydration and true after the component mounts.
 * Useful for gating client-only rendering.
 */
export const useMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
