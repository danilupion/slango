import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SCROLLBAR_WIDTH_VAR, usePreventScrolling } from './usePreventScrolling.js';

describe('usePreventScrolling', () => {
  const html = document.documentElement;

  beforeEach(() => {
    html.style.overflow = '';
    html.style.paddingRight = '';
    html.style.removeProperty(SCROLLBAR_WIDTH_VAR);
    vi.restoreAllMocks();
  });

  it('sets html overflow to hidden when active', () => {
    renderHook(() => usePreventScrolling());

    expect(html.style.overflow).toBe('hidden');
  });

  it('restores previous overflow on unmount', () => {
    html.style.overflow = 'auto';

    const { unmount } = renderHook(() => usePreventScrolling());

    expect(html.style.overflow).toBe('hidden');

    unmount();

    expect(html.style.overflow).toBe('auto');
  });

  it('does not modify overflow when active is false', () => {
    html.style.overflow = 'scroll';

    renderHook(() => usePreventScrolling(false));

    expect(html.style.overflow).toBe('scroll');
  });

  it('compensates for scrollbar width with paddingRight', () => {
    vi.spyOn(html, 'clientWidth', 'get').mockReturnValue(984);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);

    renderHook(() => usePreventScrolling());

    expect(html.style.paddingRight).toBe('16px');
    expect(html.style.getPropertyValue(SCROLLBAR_WIDTH_VAR)).toBe('16px');
  });

  it('restores previous paddingRight and removes the CSS variable on unmount', () => {
    vi.spyOn(html, 'clientWidth', 'get').mockReturnValue(984);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
    html.style.paddingRight = '8px';

    const { unmount } = renderHook(() => usePreventScrolling());

    expect(html.style.paddingRight).toBe('16px');

    unmount();

    expect(html.style.paddingRight).toBe('8px');
    expect(html.style.getPropertyValue(SCROLLBAR_WIDTH_VAR)).toBe('');
  });

  it('does not set paddingRight or the CSS variable when there is no scrollbar', () => {
    vi.spyOn(html, 'clientWidth', 'get').mockReturnValue(1000);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);

    renderHook(() => usePreventScrolling());

    expect(html.style.paddingRight).toBe('');
    expect(html.style.getPropertyValue(SCROLLBAR_WIDTH_VAR)).toBe('');
  });
});
