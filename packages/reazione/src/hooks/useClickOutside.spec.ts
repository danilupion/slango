import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useClickOutside } from './useClickOutside.js';

const mouseDown = (target: Node) => {
  const event = new MouseEvent('mousedown', { bubbles: true });
  target.dispatchEvent(event);
};

describe('useClickOutside', () => {
  it('fires when clicking outside the element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const onOutside = vi.fn();

    renderHook(() => useClickOutside({ current: element }, onOutside));
    mouseDown(document.body);

    expect(onOutside).toHaveBeenCalledTimes(1);
    element.remove();
  });

  it('does not fire when clicking inside the element', () => {
    const element = document.createElement('div');
    const child = document.createElement('span');
    element.appendChild(child);
    document.body.appendChild(element);
    const onOutside = vi.fn();

    renderHook(() => useClickOutside({ current: element }, onOutside));
    mouseDown(child);

    expect(onOutside).not.toHaveBeenCalled();
    element.remove();
  });

  it('does nothing while inactive and unsubscribes on unmount', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const onOutside = vi.fn();

    const { unmount } = renderHook(() => useClickOutside({ current: element }, onOutside, false));
    mouseDown(document.body);
    expect(onOutside).not.toHaveBeenCalled();

    unmount();
    mouseDown(document.body);
    expect(onOutside).not.toHaveBeenCalled();
    element.remove();
  });
});
