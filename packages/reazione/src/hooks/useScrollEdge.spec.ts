import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Edge, useScrollEdge } from './useScrollEdge.js';

const makeScrollable = ({
  scrollTop = 0,
  scrollHeight = 1000,
  clientHeight = 500,
}: Partial<Pick<HTMLElement, 'scrollTop' | 'scrollHeight' | 'clientHeight'>> = {}) => {
  const element = document.createElement('div');
  Object.defineProperties(element, {
    scrollTop: { value: scrollTop, configurable: true },
    scrollHeight: { value: scrollHeight, configurable: true },
    clientHeight: { value: clientHeight, configurable: true },
    scrollLeft: { value: 0, configurable: true },
    scrollWidth: { value: 0, configurable: true },
    clientWidth: { value: 0, configurable: true },
  });
  return element;
};

describe('useScrollEdge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires onEdgeReached when scrolled within the offset of the bottom', () => {
    const element = makeScrollable({ scrollTop: 450 });
    const onEdgeReached = vi.fn();

    renderHook(() =>
      useScrollEdge({ onEdgeReached, scrollElement: { current: element }, debounceDelay: 50 }),
    );

    element.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(50);

    expect(onEdgeReached).toHaveBeenCalledTimes(1);
  });

  it('does not fire when far from the edge', () => {
    const element = makeScrollable({ scrollTop: 0 });
    const onEdgeReached = vi.fn();

    renderHook(() =>
      useScrollEdge({ onEdgeReached, scrollElement: { current: element }, debounceDelay: 50 }),
    );

    element.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(50);

    expect(onEdgeReached).not.toHaveBeenCalled();
  });

  it('supports the top edge', () => {
    const element = makeScrollable({ scrollTop: 10 });
    const onEdgeReached = vi.fn();

    renderHook(() =>
      useScrollEdge({
        edge: Edge.TOP,
        onEdgeReached,
        scrollElement: { current: element },
        debounceDelay: 50,
      }),
    );

    element.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(50);

    expect(onEdgeReached).toHaveBeenCalledTimes(1);
  });

  it('debounces bursts of scroll events into one invocation', () => {
    const element = makeScrollable({ scrollTop: 450 });
    const onEdgeReached = vi.fn();

    renderHook(() =>
      useScrollEdge({ onEdgeReached, scrollElement: { current: element }, debounceDelay: 50 }),
    );

    for (let i = 0; i < 5; i++) {
      element.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(10);
    }
    vi.advanceTimersByTime(50);

    expect(onEdgeReached).toHaveBeenCalledTimes(1);
  });

  it('stops listening after unmount', () => {
    const element = makeScrollable({ scrollTop: 450 });
    const onEdgeReached = vi.fn();

    const { unmount } = renderHook(() =>
      useScrollEdge({ onEdgeReached, scrollElement: { current: element }, debounceDelay: 50 }),
    );

    unmount();
    element.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(100);

    expect(onEdgeReached).not.toHaveBeenCalled();
  });
});
