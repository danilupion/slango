'use client';

import type { RefObject } from 'react';

import { useEffect, useRef } from 'react';

/**
 * Invokes `onOutside` when a mousedown lands outside the referenced element.
 * The handler is kept fresh without re-subscribing the document listener.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  active = true,
): void => {
  const onOutsideRef = useRef(onOutside);
  onOutsideRef.current = onOutside;

  useEffect(() => {
    if (!active) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideRef.current();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, active]);
};
