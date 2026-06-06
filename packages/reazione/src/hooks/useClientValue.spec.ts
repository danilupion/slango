import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useClientValue } from './useClientValue.js';

describe('useClientValue', () => {
  it('resolves the initializer value after mount', () => {
    const { result } = renderHook(() => useClientValue(() => 'client', { initialValue: 'server' }));

    expect(result.current).toBe('client');
  });

  it('re-runs the initializer when deps change', () => {
    const initializer = vi.fn((suffix: string) => `value-${suffix}`);
    const { result, rerender } = renderHook(
      ({ suffix }) =>
        useClientValue(() => initializer(suffix), { deps: [suffix], initialValue: '' }),
      { initialProps: { suffix: 'a' } },
    );

    expect(result.current).toBe('value-a');

    rerender({ suffix: 'b' });

    expect(result.current).toBe('value-b');
  });

  it('does not re-run the initializer when deps are stable', () => {
    const initializer = vi.fn(() => 42);
    const { rerender } = renderHook(() =>
      useClientValue(initializer, { deps: ['fixed'], initialValue: 0 }),
    );

    rerender();
    rerender();

    expect(initializer).toHaveBeenCalledTimes(1);
  });
});
