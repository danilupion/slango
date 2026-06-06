'use client';

import type { RefObject } from 'react';

import { useEffect } from 'react';

import { useDebouncedCallback } from './useDebouncedCallback.js';

export enum Edge {
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

export type UseScrollEdgeOptions = {
  debounceDelay?: number;
  edge?: Edge;
  offset?: number;
  onEdgeReached: () => Promise<void> | void;
  scrollElement?: RefObject<HTMLElement | null>;
};

/**
 * Invokes `onEdgeReached` (debounced) whenever scrolling comes within
 * `offset` pixels of the given edge of `scrollElement` (or the document).
 */
export const useScrollEdge = ({
  debounceDelay = 200,
  edge = Edge.BOTTOM,
  offset = 100,
  onEdgeReached,
  scrollElement,
}: UseScrollEdgeOptions): void => {
  const { run: handleScroll, cancel } = useDebouncedCallback(() => {
    const container = scrollElement?.current || document.documentElement;
    const { clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth } =
      container;

    const edgeConditions: Record<Edge, () => boolean> = {
      [Edge.BOTTOM]: () => scrollHeight - scrollTop - clientHeight <= offset,
      [Edge.LEFT]: () => scrollLeft <= offset,
      [Edge.RIGHT]: () => scrollWidth - scrollLeft - clientWidth <= offset,
      [Edge.TOP]: () => scrollTop <= offset,
    };

    if (edgeConditions[edge]()) {
      void onEdgeReached();
    }
  }, debounceDelay);

  useEffect(() => {
    const container = scrollElement?.current || window;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      cancel();
    };
  }, [handleScroll, cancel, scrollElement]);
};
