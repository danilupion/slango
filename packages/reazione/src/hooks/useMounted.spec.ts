import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMounted } from './useMounted.js';

describe('useMounted', () => {
  it('returns true once mounted', () => {
    const { result } = renderHook(() => useMounted());

    expect(result.current).toBe(true);
  });

  it('stays true across rerenders', () => {
    const { result, rerender } = renderHook(() => useMounted());

    rerender();

    expect(result.current).toBe(true);
  });
});
