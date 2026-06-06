'use client';

import { useEffect } from 'react';

export const SCROLLBAR_WIDTH_VAR = '--scrollbar-width';

/**
 * Locks background scroll, padding the document to compensate for the removed
 * scrollbar so the layout doesn't shift. The scrollbar width is also exposed
 * as a CSS variable for fixed-position elements that need the same offset.
 */
export const usePreventScrolling = (active = true): void => {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const previousOverflow = html.style.overflow;
    const previousPaddingRight = html.style.paddingRight;
    html.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      html.style.paddingRight = `${scrollbarWidth}px`;
      html.style.setProperty(SCROLLBAR_WIDTH_VAR, `${scrollbarWidth}px`);
    }
    return () => {
      html.style.overflow = previousOverflow;
      html.style.paddingRight = previousPaddingRight;
      html.style.removeProperty(SCROLLBAR_WIDTH_VAR);
    };
  }, [active]);
};
